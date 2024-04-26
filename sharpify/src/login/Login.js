import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';

function Login(props) {
    const [showPassword, setShowPassword] = useState(true);
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    
    document.body.style.height = '0';

    const email = createContext();

    const verifyAccount = () => {
        const email = document.getElementById('email-input').value;
        const password = document.getElementById('pswd').value;

        if (!email || !password) {
            alert('Username or password cannot be empty');
            return;
        }
    
        fetch('/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, password: password }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                navigate("/dashboard");
            } else {
                alert(data.message); // Show error message
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
    
    return (
        <div>
            {props.setEmail("")}
            <div className="split left">
                <div className="color-orange-red"></div>
                <div className="flex">
                    <div className="dropdown login-dropdown">
                        <div className="logo-title">SHARPIFY</div>
                        <a className="dropdown-text" href="#">From Blurry to Brilliant!</a>
                    </div>
                    <div className="message-container">
                        <div className="welcome-back">Welcome Back!</div>
                        <div className="custom-message">Do you have photos in need of a quick fix? We've got you covered!</div>
                    </div>
                </div>
            </div>
            <div className="split right">
                <div className="login-container">
                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css"></link>
                    <div className="login-label">Login</div>
                    <div className="email-label">Email</div>
                    <input id="email-input" type="text" placeholder="Enter Your Email" name="uname" required />
                    <div className="pswd-label">Password</div>
                    <div>
                        <input id="pswd" type={showPassword ? "password" : "text"} placeholder="Enter Your Password" name="psw" required />
                        {showPassword ?
                            <i className="bi bi-eye-slash input-password-eye" onClick={() => { setShowPassword(false) }} /> :
                            <i className="bi bi-eye input-password-eye" onClick={() => { setShowPassword(true) }} />}
                    </div>
                    <button className="login" type="login" onClick={() => {
                        verifyAccount();
                    }}>Login</button>
                    <div>
                        <label>New to your fitness journey?&nbsp;</label>
                        <a className="orange-link" onClick={() => { navigate("/register"); }}>Click here to register!</a>
                    </div>
                    <div className="copy-right">Powered by Group 7</div>
                </div>
            </div>
        </div>
    )
}
export default Login;