// src/components/EmailPasswordAuth.tsx (You can rename it if it only handles this)
import React, { useState } from "react";
import { signInWithEmailAndPassword, type AuthError } from "firebase/auth"; // Import AuthError for better typing
import { auth } from "../firebase"; // Your initialized Firebase auth instance

export const EmailPasswordAuth: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission to handle it with React
    setError(null); // Clear any previous errors
    setLoading(true); // Show loading indicator

    try {
      // The core function for email/password sign-in
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User signed in successfully!", userCredential.user.uid);
      // You can now redirect the user, update your UI, or navigate to a protected route
      // The `userCredential.user` object contains the authenticated user's details.
    } catch (err) {
      // Type assertion for Firebase AuthError
      const firebaseError = err as AuthError;
      console.error(
        "Error signing in:",
        firebaseError.code,
        firebaseError.message
      );

      // Provide user-friendly error messages based on Firebase error codes
      switch (firebaseError.code) {
        case "auth/user-not-found":
          setError(
            "No user found with this email. Please check your email or sign up."
          );
          break;
        case "auth/wrong-password":
          setError("Incorrect password. Please try again.");
          break;
        case "auth/invalid-email":
          setError("The email address is not valid.");
          break;
        case "auth/too-many-requests":
          setError("Too many failed login attempts. Please try again later.");
          break;
        default:
          setError("Failed to sign in. Please try again.");
          break;
      }
    } finally {
      setLoading(false); // Hide loading indicator regardless of success or failure
    }
  };

  return (
    <div>
      <h2>Login with Email & Password</h2>
      <form onSubmit={handleSignIn}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            required
            aria-label="Email address"
            autoComplete="email" // Helps browsers suggest previous emails
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            required
            aria-label="Password"
            autoComplete="current-password" // Helps browsers suggest passwords
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logging In..." : "Log In"}
        </button>
      </form>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      {/* Optionally add a link for password reset or sign-up */}
      <p style={{ marginTop: "15px" }}>
        Don't have an account? <a href="/signup">Sign Up Here</a>
      </p>
    </div>
  );
};

export default EmailPasswordAuth;
