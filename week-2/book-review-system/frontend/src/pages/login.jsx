import { useNavigate } from "react-router";
export default function Login() {
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Handle login logic here
    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        throw new Error("Failed to login");
      }
      const data = await res.json();
      localStorage.setItem("token", data); // Store token in localStorage
      navigate("/");
      console.log("User logged in:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <div className="container text-center d-flex flex-column align-items-center">
      <h1 className="m-5">Book Review System</h1>
      <h1>Login</h1>
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
          Login
        </button>
      </form>
    </div>
  );
}
