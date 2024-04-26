import { useState } from 'react'
import './App.css'
import Login from './pages/login/Login.jsx'
import Signup from "./pages/signup/SignUp.jsx"
import Home from './pages/home/Home.jsx'

function App() {
  const [showLogin, setShowLogin] = useState(true);  // State to toggle views

  return (
    <div>
      <div>
        {/* {showLogin ? <Login onSignUpClick={() => setShowLogin(false)} /> : <Signup onLoginClick={() => setShowLogin(true)} />} */}
      
      
        <Home/> 
        </div>
    </div>

  )
}

export default App
