import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";

function BookDetails() {
  const [book, setBook] = useState(null); // State to hold book details
  const [reviews, setReviews] = useState([]); // State to hold reviews
  const [rating, setRating] = useState(0);
  const { id } = useParams(); // Get the book ID from the URL parameters
  const endpoint = "http://localhost:3000/books/:id"; // Replace with actual endpoint
  const reviewEndpoint = "http://localhost:3000/books/:id/reviews";
  const reviewSubmitEndpoint = "http://localhost:3000/reviews";

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    const reviewer = e.target.reviewer.value;
    const comment = e.target.comment.value;
    const reviewData = {
      book: id, // Use the book ID from the URL
      reviewer,
      rating: parseInt(rating, 10), // Convert rating to an integer
      comment,
    };
    try {
      const response = await fetch(reviewSubmitEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });
      if (!response.ok) {
        throw new Error("Failed to submit review");
      }
      const newReview = await response.json();
      setReviews((prevReviews) => [...prevReviews, newReview]); // Update the reviews state with the new review
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const [bookRes, reviewRes] = await Promise.all([
          fetch(endpoint.replace(":id", id)),
          fetch(reviewEndpoint.replace(":id", id)),
        ]);

        if (!bookRes.ok || !reviewRes.ok) {
          throw new Error("Network response was not ok");
        }

        const [bookData, reviewData] = await Promise.all([
          bookRes.json(),
          reviewRes.json(),
        ]);

        console.log("Book data:", bookData);
        setBook(bookData); // Set the book details in state
        setReviews(reviewData);
      } catch (error) {
        console.error("Failed to fetch book details:", error);
      }
    };

    fetchBookDetails();
  }, [id]);

  console.log("Fetching details for book ID:", id);

  return (
    <div className="container mb-5">
      <p className="my-4">
        <Link to="/" className="fs-6">
          Back to Book List
        </Link>
      </p>
      <h1 className="mb-5">Book Details </h1>

      {book ? (
        <div>
          <h2>{book.title}</h2>
          <p>
            <strong>Author:</strong> {book.author}
          </p>
          <p>
            <strong>Genre:</strong> {book.genre}
          </p>
          <p>
            <strong>Published Year:</strong> {book.publishedYear}
          </p>
          <p>
            <strong>Description:</strong> {book.description}
          </p>
          <h3 className="mt-5">Reviews</h3>
          <br />
          {reviews.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            reviews?.map((review, index) => (
              <div
                key={index}
                className="card p-3 my-2"
                style={{ width: "400px" }}
              >
                <p className="card-title">
                  <strong>{review.reviewer}</strong>:{" "}
                  <span
                    style={{
                      color:
                        review.rating >= 4
                          ? "green"
                          : review.rating >= 2
                          ? "orange"
                          : "red",
                    }}
                  >
                    {review.rating}
                  </span>
                </p>

                <p>{review.comment}</p>
              </div>
            ))
          )}
        </div>
      ) : (
        <p>Loading book details...</p>
      )}

      <h3 className="color-gray-100 mt-5">Leave a review</h3>
      <form action="" style={{ width: "400px" }} onSubmit={handleSubmit}>
        <label for="reviewer">Reviewer:</label>
        <input
          className="form-control"
          type="text"
          id="reviewer"
          name="reviewer"
        />
        <label for="rating">Rating: {rating}</label>
        <input
          className="form-range"
          type="range"
          id="rating"
          name="rating"
          min="1"
          max="5"
          step="1"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />
        <textarea
          className="form-control"
          id="comment"
          name="comment"
          rows="3"
        ></textarea>
        <button className="btn btn-primary mt-2" type="submit">
          Submit Review
        </button>
      </form>
    </div>
  );
}
export default BookDetails;
