import React, { useState } from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import { useContext } from 'react'
import { authDataContext } from '../context/AuthContext'
const ForgotPassword = () => {
  const [step, setStep] = useState(1)
  const [otp, setOtp] = useState("")
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const { serverUrl } = useContext(authDataContext)

  const handleSendOtp = async () => {
    try {
      const result = await axios.post(`${serverUrl}/api/auth/send-otp`, { email }, { withCredentials: true })

      console.log(result);
      setStep(2)
    } catch (error) {
      console.log(error);

    }
  }

  const handleverifyOtp = async () => {
    try {
      const result = await axios.post(`${serverUrl}/api/auth/verify-otp`, { email, otp }, { withCredentials: true })

      console.log(result);
      setStep(3)
    } catch (error) {
      console.log(error);

    }
  }

  const handleResetPassword = async () => {

    if (newPassword != confirmPassword) {
      return null
    }
    try {
      const result = await axios.post(`${serverUrl}/api/auth/reset-password`, { email, newPassword }, { withCredentials: true })

      console.log(result);
      navigate("/login")
    } catch (error) {
      console.log(error);

    }
  }



  return (


    <>


      <div className='flex items-center justify-center min-h-screen p-4 bg-[#dad1cd]'>

        <div className='bg-white rounded-xl w-full max-w-md p-8'>
          <div className='flex items-center gap-4 mb-4'>
            <IoIosArrowRoundBack onClick={() => navigate("/login")} className='w-[35px] h-[35px] cursor-pointer' />

            <h1 className='text-2xl font-bold text-center'>Forgot Password</h1>
          </div >
          {step == 1 && (
            <div>
              <div className="mb-6">
                <input
                  type="email"
                  placeholder='email'
                  required
                  className='w-[100%] h-[50px] border-2 border-blue-700 bg-gray-100 text-[20px] outline-none py-[10px] px-[20px] rounded-lg'
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>
              <button className='w-[100%] h-[50px] rounded-full bg-[#1dc9fd] text-white text-[20px] font-semibold cursor-pointer mt-[40px]' onClick={handleSendOtp}>
                Send OTP
              </button>
            </div>
          )}

          {step == 2 && (
            <div>
              <div className="mb-6">
                <input
                  type='text'
                  placeholder='Enter OTP'
                  required
                  className='w-[100%] h-[50px] border-2 border-blue-700 bg-gray-100 text-[20px] outline-none py-[10px] px-[20px] rounded-lg'
                  onChange={(e) => setOtp(e.target.value)}
                  value={otp}
                />
              </div>
              <button className='w-[100%] h-[50px] rounded-full bg-[#1dc9fd] text-white text-[20px] font-semibold cursor-pointer mt-[40px]' onClick={handleverifyOtp}>
                Verify
              </button>
            </div>
          )}

          {step == 3 && (
            <div>
              <div className="mb-6 flex flex-col gap-[40px]">
                <input
                  type='text'
                  placeholder=' Enter New Password'
                  required
                  className='w-[100%] h-[50px] border-2 border-blue-700 bg-gray-100 text-[20px] outline-none py-[10px] px-[20px] rounded-lg'
                  onChange={(e) => setNewPassword(e.target.value)}
                  value={newPassword}
                />

                <input
                  type='text'
                  placeholder=' Enter Confirm Password'
                  required
                  className='w-[100%] h-[50px] border-2 border-blue-700 bg-gray-100 text-[20px] outline-none py-[10px] px-[20px] rounded-lg'
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                />
              </div>
              <button className='w-[100%] h-[50px] rounded-full bg-[#1dc9fd] text-white text-[20px] font-semibold cursor-pointer mt-[40px]' onClick={handleResetPassword}>
                Reset Password
              </button>
            </div>
          )}

        </div>

      </div>
    </>
  )
}

export default ForgotPassword