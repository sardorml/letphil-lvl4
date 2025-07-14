import express from "express";
import cors from "cors"
import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json" with { type: 'json' };

// Initialize the Firebase Admin SDK

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Get a reference to the Firestore database

const db = admin.firestore();

const app = express();
app.use(express.json());
app.use(cors())
const PORT = 3005;

// get all polls from Firestore

app.get("/polls", async (req, res) => {
  try {
    // 1. Get a reference to your 'polls' collection in Firestore

    const pollsRef = db.collection("polls");

    // 2. Execute the query to get all documents in that collection

    // The .get() method returns a Promise that resolves to a QuerySnapshot

    const snapshot = await pollsRef.get();

    // 3. Check if the snapshot is empty (no documents found)

    if (snapshot.empty) {
      console.log("No matching polls found in Firestore.");

      // If no polls, send an empty array and a 200 OK status

      return res.status(200).send([]);
    }

    // 4. Process the documents from the snapshot

    const polls = [];

    snapshot.forEach((doc) => {
      // For each document, doc.id is its unique ID in Firestore

      // doc.data() contains the actual fields/values of the document

      polls.push({
        id: doc.id, // It's often useful to include the Firestore document ID

        ...doc.data(), // Spread the rest of the document data
      });
    });

    // 5. Send the array of polls back to the client with a 200 OK status

    res.status(200).send(polls);
  } catch (error) {
    // 6. Handle any errors that occur during the Firestore operation

    console.error("Error fetching polls from Firestore:", error);

    // Use a 500 status code for internal server errors

    res.status(500).send({
      message: "Failed to retrieve polls from the database.",
      error: error.message,
    });
  }

  // Removed the extra `res.status(200).send();` as the response is already handled

  // within the try or catch blocks. Sending a response twice will cause an error.
});

// get poll by id

app.get("/poll/:id", async (req, res) => {

  try {
    const pollId = req.params.id;


    // --- Input Validation ---

    // Firestore document IDs are strings, so no specific ObjectId validation is needed.
    // However, it's good practice to ensure the ID isn't empty or null.
    if (!pollId) {
      return res.status(400).send("Poll ID is required.");
    }

    // Get a reference to the specific poll document in your 'polls' collection
    const pollRef = db.collection('polls').doc(pollId);

    // Fetch the document
    const pollDoc = await pollRef.get(); // This gets a DocumentSnapshot

    // Check if the document exists
    if (!pollDoc.exists) {
      // If no document was found with that ID
      return res.status(404).send("Looks like that poll has vanished! Not found.");
    }

    // If it exists, get the data from the DocumentSnapshot
    const pollData = pollDoc.data();

    // Optionally, you might want to include the document ID in the response
    // as Firestore's .data() method doesn't include it by default.
    const pollWithId = {
      id: pollDoc.id, // The document ID itself
      ...pollData      // The rest of the poll data
    };

    // Send the poll data back
    res.status(200).send(pollWithId);

  } catch (error) {
    console.error("Oops! Error fetching poll:", error);

    // For general server errors
    res.status(500).send("A server error occurred while trying to retrieve the poll. Please try again!");
  }
});


// create poll

app.post("/poll/create", async (req, res) => {

  const { question, activeDays, options } = req.body;


  // Basic validation (optional but recommended)
  if (!question || !activeDays || !options || !Array.isArray(options) || options.length === 0) {

    return res.status(400).send({ message: "Missing required poll fields (question, activeDays, options)." });

  }


  const deadlineDate = new Date();

  deadlineDate.setDate(deadlineDate.getDate() + activeDays);


  // Prepare the poll object for Firestore

  // Firestore automatically handles JavaScript Date objects by converting them to Timestamps.

  const newPollData = {
    question: question,
    deadline: deadlineDate, // This will be stored as a Firestore Timestamp
    options: options.map((option) => {
      // Ensure each option has a default 'vote' count of 0
      // Make a copy to avoid mutating the original req.body.options if it's used elsewhere
      return { ...option, vote: 0 };
    }),
    createdAt: new Date() // Good practice to add a creation timestamp
  };


  try {
    // 1. Get a reference to your 'polls' collection
    const pollsCollectionRef = db.collection('polls');

    // 2. Add the new poll data to the collection.
    // .add() automatically generates a unique ID for the document.

    const docRef = await pollsCollectionRef.add(newPollData);

    // 3. Construct the response object including the new Firestore ID
    const createdPoll = {
      id: docRef.id, // The unique ID generated by Firestore
      ...newPollData // The data you just saved
    };


    // 4. Send the created poll data back to the client with a 201 Created status
    res.status(201).send(createdPoll);

  } catch (error) {

    // 5. Handle any errors during the Firestore operation
    console.error("Error creating poll in Firestore:", error);
    res.status(500).send({ message: "Failed to create poll.", error: error.message });

  }

});


app.post("/poll/:id", async (req, res) => {
  try {
    const pollId = req.params.id;
    const { option: optionIndex } = req.body; // This 'option' should be the numerical index of the option
    
    // --- Input Validation ---
    // Firestore document IDs are just strings, no special ObjectId validation needed.
    if (!pollId) {
      return res.status(400).send("No poll ID provided. Can't update the vote!");
    }

    // Ensure the option index is a valid non-negative number
    const parsedOptionIndex = parseInt(optionIndex);

    if (typeof optionIndex === 'undefined' || isNaN(parsedOptionIndex) || parsedOptionIndex < 0) {
      return res.status(400).send("A valid option index (number) must be provided for the vote.");
    }


    // Get a reference to the specific poll document in your 'polls' collection
    const pollRef = db.collection('polls').doc(pollId);

    // This variable will hold the updated poll data to send back after a successful transaction
    let updatedPollData = null;

    // --- Firestore Transaction ---
    // We use a transaction to ensure atomic read-modify-write for the votes.

    await db.runTransaction(async (transaction) => {

      // 1. Read the current state of the poll document within the transaction
      const pollDoc = await transaction.get(pollRef);

      // Check if the poll exists
      if (!pollDoc.exists) {
        // If not found, throw an error. The outer try-catch will handle it.
        const error = new Error("Whoops! Looks like that poll doesn't exist anymore.");

        error.status = 404; // Custom status property for easier error handling

        throw error;

      }


      // Get the current data of the poll
      const pollData = pollDoc.data();

      // Make sure 'options' exists and is an array, default to empty if not
      let options = pollData.options || [];


      // Validate that the provided option index is actually within the bounds of the options array
      if (parsedOptionIndex >= options.length || parsedOptionIndex < 0) {

        const error = new Error("That option index isn't valid for this poll. Did someone mess with the options?");

        error.status = 400;

        throw error;

      }

      // 2. Modify the options array in memory
      // Important: Create a shallow copy of the array. Firestore updates often work best
      // when you provide a completely new object or array for modified nested fields.
      const newOptions = [...options];

      

      // Ensure the 'vote' property exists and is a number before incrementing
      if (typeof newOptions[parsedOptionIndex].vote !== 'number') {
        newOptions[parsedOptionIndex].vote = 0; // Initialize if it's missing or not a number
      }

      // Increment the vote count for the chosen option
      newOptions[parsedOptionIndex].vote += 1;


      // 3. Write the updated options array back to the document within the transaction
      transaction.update(pollRef, { options: newOptions });

      // Prepare the data to be sent back to the client.
      // We combine the original poll data with the newly updated options.
      updatedPollData = { ...pollData, options: newOptions };

    });

    // If the transaction successfully commits, send back the updated poll data

    res.send(updatedPollData);


  } catch (error) {

    console.error("Uh oh, something went wrong updating the poll:", error.message);

    // Use the custom 'status' property for specific error responses

    if (error.status) {
      res.status(error.status).send(error.message);

    } else {
      // For any other unexpected errors during the process
      res.status(500).send("A server error occurred while trying to cast your vote. Please try again!");

    }

  }

});


app.listen(PORT, console.log("port working"));
