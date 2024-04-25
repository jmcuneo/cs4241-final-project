import  { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

/**
 * @author Jack Weinstein
 */

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("Logging in...");

    try {
      const response = await fetch("//localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameRef.current.value,
          password: passwordRef.current.value,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Handle 401 Unauthorized error
          const errorMessage = await response.text(); // Read response as text
          setMessage(errorMessage); // Display the specific error message
          throw new Error(errorMessage); // Throw custom error with message
        } else {
          // Handle other errors (e.g., 500 Internal Server Error)
          const data = await response.json();
          setMessage(data.message); // Display the error message
          throw new Error(data.message); // Throw custom error with message
        }
      }

      const data = await response.json();
      setMessage("Logging In...");
      onLogin(data.token);
      navigate("/main");
    } catch (error) {
      console.error("Login error:", error.message);
      setMessage("Login failed: " + error.message);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    navigate("/register");
  };

  return (
    <div className="relative flex min-h-screen flex-col justify-center mx-auto items-center prose">
      <h1>Event List Sign-In</h1>
      <form id="loginForm" onSubmit={handleSubmit}>
        <div>
          <div className="">
            <div>
              <label className="text-lg text-slate-50" htmlFor="username">
                Username
              </label>
            </div>
            <input
              className="validate input input-bordered w-full max-w-xs max-h-9 input-primary focus:outline-accent"
              type="text"
              id="username"
              name="username"
              autoComplete="username"
              data-length="10"
              required
              ref={usernameRef}
            />
          </div>
          <div className="mb-2  ">
            <div>
              <label className="text-lg text-slate-50" htmlFor="password">
                Password
              </label>
            </div>
            <input
              className="validate input input-bordered w-full max-w-xs max-h-9 input-primary focus:outline-accent"
              type="password"
              id="password"
              autoComplete="current-password"
              name="password"
              required
              ref={passwordRef}
            />
          </div>
          <div className="flex justify-between w-full">
            <button className="btn btn-primary" type="submit" id="loginButton">
              Login
            </button>
            <div className="divider divider-horizontal">OR</div>
            <button
              className="btn btn-accent"
              type="button"
              id="registerButton"
              onClick={handleRegister}
            >
              Register
            </button>
          </div>
        </div>
      </form>
      <div>
        <p>{message}</p>
      </div>
    </div>
  );
}

LoginPage.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default LoginPage;
