import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Register.css';

function Register(props) {
    const [showPassword, setShowPassword] = useState(true);
    const navigate = useNavigate();

    document.body.style.height = '0';

    const email = createContext();

    // const verifyAccount = () => {
    //     window.alert("Account Created!");
    //     navigate("/login");
    // }
    const verifyAccount = () => {
        const username = document.getElementById('username-input').value;
        const password = document.getElementById('pswd').value;
        const emailInput = document.getElementById('email-input').value;
    
        fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, email: emailInput}),
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    window.alert("Account Created!");
                    navigate("/login");
                } else {
                    window.alert(data.message);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    return (
        <div>
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
                    <div className="login-label">Register</div>
                    <div className="email-label">Username</div>
                    <input id="username-input" type="text" placeholder="Enter Your Username" name="uname" required />
                    <div className="email-label">Email</div>
                    <input id="email-input" type="text" placeholder="Enter Your Email" name="email" required />
                    <div className="pswd-label">Password</div>
                    <div>
                        <input id="pswd" type={showPassword ? "password" : "text"} placeholder="Enter Your Password" name="psw" required />
                        {showPassword ?
                            <i className="bi bi-eye-slash input-password-eye" onClick={() => { setShowPassword(false) }} /> :
                            <i className="bi bi-eye input-password-eye" onClick={() => { setShowPassword(true) }} />}
                    </div>
                    <div className="pswd-label">Confirm Password</div>
                    <div>
                        <input id="pswd" type={showPassword ? "password" : "text"} placeholder="Enter Your Password" name="psw" required />
                        {showPassword ?
                            <i className="bi bi-eye-slash input-password-eye" onClick={() => { setShowPassword(false) }} /> :
                            <i className="bi bi-eye input-password-eye" onClick={() => { setShowPassword(true) }} />}
                    </div>
                    <button className="login" type="login" onClick={() => {
                        verifyAccount();
                    }}>Register</button>
                    <div>
                        <label>Already a user?&nbsp;</label>
                        <a className="orange-link" onClick={() => { navigate("/login"); }}>Click here to log in!</a>
                    </div>
                    <div className="copy-right">Powered by Group 7</div>
                </div>
            </div>
        </div>
    )
}
export default Register;