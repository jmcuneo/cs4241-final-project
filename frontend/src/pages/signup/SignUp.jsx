import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSignup from '../../hooks/useSignup.js';


const SignUp = () => {
  const navigate = useNavigate();

  // Initialize state for input fields
  const [inputs, setInputs] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: ""
  });

  // Function to handle form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs(prevInputs => ({
      ...prevInputs,
      [name]: value
    }));
  };

  const {loading, signup} = useSignup()

  const handleSubmit =  async (event) => {
    event.preventDefault();

    console.log("Submitted Inputs:", inputs); 
    await signup(inputs)
  };



  // Function to handle navigating back to the login page
  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className='p-4 h-screen flex items-center justify-center'>
      <div>
        <div className="flex items-center justify-center h-screen">
          <div>
            <div className="bg-primary dark:bg-lightprimary w-96 h-36 rounded-xl m-[36px] relative flex items-center justify-center">
              <div className="text-center text-5xl font-inter font-normal text-light dark:text-lightlight ">
                Chat App
              </div>
            </div>

            <form onSubmit={handleSubmit} className='bg-primary dark:bg-lightprimary w-96 rounded-xl m-[36px] flex flex-col items-center justify-center space-y-8' style={{ height: '460px' }}>
              <div className="space-y-6 mt-4">

                <label className="input input-bordered dark:border-lighttertiary border-tertiary w-80 bg-primary dark:bg-lightprimary flex items-center gap-2">

                  <input type="text" name="fullName" className="grow text-lightdark dark:text-dark" placeholder="Display Name" value={inputs.fullName} onChange={handleChange} />
                </label>

                <label className="input input-bordered border-tertiary dark:border-lighttertiary w-80 bg-primary dark:bg-lightprimary flex items-center gap-2">
                  <input type="text" name="username" className="grow text-lightdark dark:text-dark" placeholder="Username" value={inputs.username} onChange={handleChange} />
                </label>

                <label className="input input-bordered border-tertiary dark:border-lighttertiary bg-primary dark:bg-lightprimary w-80 flex items-center gap-2">
                  <input type="password" name="password" className="grow text-lightdark dark:text-dark" placeholder="Password" value={inputs.password} onChange={handleChange} />
                </label>

                <label className="input input-bordered border-tertiary dark:border-lighttertiary bg-primary dark:bg-lightprimary w-80 flex items-center gap-2">
                  <input type="password" name="confirmPassword" className="grow text-lightdark dark:text-dark" placeholder="Confirm Password" value={inputs.confirmPassword} onChange={handleChange} />

                </label>

              </div>
              
              <button type="submit" className="btn btn-wide bg-loginbutton dark:bg-lightloginbutton text-light  dark:text-lightlight dark:hover:bg-lightloginbuttonhover hover:bg-loginbuttonhover border-none text-base font-inter"
              disabled-= {loading}
              > {loading ? <span className="loading loading-spinner"></span>: "Sign Up"}
              </button>
 
              <button className='text-purp hover:text-[#8771eb] font-inter' onClick={handleLoginClick}>Already Have An Account?</button>
              </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
