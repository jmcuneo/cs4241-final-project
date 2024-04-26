import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
/**
 * @author Jack Weinstein
 */

function RegisterPage() {
  const [message, setMessage] = useState("");
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);

  const navigate = useNavigate();
  const handleLogin = async (event) => {
    event.preventDefault();
    navigate("/");
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("Registering");

    try {
      const response = await fetch("//localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameRef.current.value,
          password: passwordRef.current.value,
          firstName: firstNameRef.current.value,
          lastName: lastNameRef.current.value,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Registration successful! You can now log in.");
      } else {
        setMessage("Registration failed: " + data.message);
      }
    } catch (error) {
      console.error("Registration error:", error.message);
      setMessage("An error occurred during registration: " + error.message);
    }
  };

  return (
    <motion.div
      className="center-page-container relative flex min-h-screen flex-col justify-center mx-auto items-center prose"
      initial={{ scale: 0, x: "-50%", y: "-50%" }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
    >
      <h1>Register</h1>
      <form className="" id="registerForm" onSubmit={handleSubmit}>
        <div className="">
          <div className="">
            <div>
              <label className="text-lg text-slate-50" htmlFor="username">
                First Name
              </label>
            </div>
            <input
              className="validate input input-bordered w-full max-w-xs max-h-9 input-primary focus:outline-accent"
              type="text"
              id="firstName"
              name="firstName"
              data-length="10"
              required
              ref={firstNameRef}
            />
          </div>
          <div className="">
            <div>
              <label className="text-lg text-slate-50" htmlFor="username">
                Last Name
              </label>
            </div>
            <input
              className="validate input input-bordered w-full max-w-xs max-h-9 input-primary focus:outline-accent"
              type="text"
              id="lastName"
              name="lastName"
              data-length="10"
              required
              ref={lastNameRef}
            />
          </div>
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
              data-length="10"
              required
              ref={usernameRef}
            />
          </div>
          <div className="mb-2">
            <div>
              <label className="text-lg text-slate-50" htmlFor="password">
                Password
              </label>
            </div>
            <input
              className="validate input input-bordered w-full max-w-xs max-h-9 input-primary focus:outline-accent"
              type="password"
              id="password"
              name="password"
              required
              ref={passwordRef}
            />
          </div>
          <div className="flex justify-between w-full">
            <button
              className="btn btn-ghost"
              type="button"
              id="logoutButton"
              onClick={handleLogin}
            >
              Back
            </button>
            <button
              className="btn btn-primary"
              type="submit"
              id="registerButton"
            >
              Register
            </button>
          </div>
        </div>
      </form>
      <div
        style={{
          fontSize: "20px",
          marginLeft: "30px",
          marginTop: "10px",
          color: "white",
        }}
      >
        {message}
      </div>
    </motion.div>
  );
}

export default RegisterPage;
