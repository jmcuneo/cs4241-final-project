import React from 'react'
import CustomButton from '../../components/CustomButton.jsx';

const Login = ({ onSignUpClick }) => {
  return (
    <div className='p-4 h-screen flex items-center justify-center'>

    <div className="flex items-center justify-center h-screen">
      <div>
        <div className="bg-[#262626] w-96 h-36 rounded-xl m-[36px] relative flex items-center justify-center">
          <div className="text-center text-5xl font-inter font-normal text-[#ffffff]">
            Chat App
          </div>
        </div>
        <div className=' bg-[#262626] w-96 h-80 rounded-xl m-[36px] flex flex-col items-center justify-center space-y-8'>
          <div className="space-y-6 mt-4">
            <label className="input input-bordered border-[#A8A8A8] w-80 bg-[#262626] flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
              </svg>
              <input type="text" className="grow" placeholder="Username" />
            </label>
            <label className="input input-bordered border-[#A8A8A8] bg-[#262626] w-80 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" />
              </svg>
              <input type="password" className="grow" placeholder="Password" />
            </label>
          </div>

          <CustomButton text="Log In"></CustomButton>

          <button className='text-cyan-500 hover:text-cyan-700 font-inter ' onClick={onSignUpClick}>Don't Have an Account?</button>
         
          

        </div>


      </div>
    </div>
    </div>
  )
}

export default Login