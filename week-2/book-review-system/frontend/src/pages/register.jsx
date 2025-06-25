import { useNavigate } from "react-router";

export default function Register() {
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Handle registration logic here
    const formData = new FormData(event.target);
    const email = formData.get("email");
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const res = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password }),
      });
      if (!res.ok) {
        throw new Error("Failed to register");
      }
      const data = await res.json();
      console.log("User registered:", data);
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <div className="container text-center d-flex flex-column align-items-center">
      <h1 className="m-5">Book Review System</h1>
      <h1>Register</h1>
      <form className="w-50" onSubmit={handleSubmit}>
        <div className="">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="form-control"
          />
        </div>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            required
            className="form-control"
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            className="form-control"
            type="password"
            id="password"
            name="password"
            required
          />
        </div>
        <button className="btn btn-primary w-100 mt-4" type="submit">
          Register
        </button>
      </form>
    </div>
  );
}
