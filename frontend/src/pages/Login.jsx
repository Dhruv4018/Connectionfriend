import React, { useState, useContext } from 'react'
import logo from "../assets/logo.svg"
import { useNavigate } from "react-router-dom"
import { authDataContext } from '../context/AuthContext'
import axios from "axios"
import { FcGoogle } from "react-icons/fc"
import { userDataContext } from '../context/UserContext'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '../../firebase'
const Login = () => {
  const { serverUrl } = useContext(authDataContext)
  const navigate = useNavigate()
  let [show, setShow] = useState(false)

  let [email, setEmail] = useState("")
  let [password, setPassword] = useState("")
  let [loading, setLoading] = useState(false)
  let [err, setErr] = useState("")
  let { setUserData } = useContext(userDataContext)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      let result = await axios.post(`${serverUrl}/api/auth/login`, { email, password }, { withCredentials: true })
      setUserData(result.data)
      navigate("/")
      setErr("")
      setLoading(false)

      setEmail("")
      setPassword("")

    } catch (error) {
      setLoading(false)
      setErr(error.response.data.message)


    }
  }

  const handleGoogleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);


      const email = result.user.email || "";






      const { data } = await axios.post(
        `${serverUrl}/api/auth/google-auth`,
        {

          email

        },
        { withCredentials: true }
      );

      console.log("Google Login Success:", data);
      setUserData(data);
      navigate("/");

    } catch (error) {
      console.log("Google Auth Error:", error);
    }
  };



  return (
    <div className='w-full h-screen bg-[white] flex flex-col items-center justify-start gap-[10px]'>
      <div className='p-[30px] lg:p-[35px] w-full h-[100px] flex items-center  '>
        <img src={logo} />
      </div>
      <form className='w-[90%] max-w-[400px] h-[500px] md:shadow-xl flex flex-col justify-center p-[15px]  gap-[10px] bg-[#dcd6d6da] rounded-lg' onSubmit={handleLogin}>
        <h1 className='text-[30px] font-bold mb-[30px] text-[#1dc9fd] text-center'>Sign Up</h1>

        <input type="email" placeholder='email' required className='w-[100%] h-[50px] border-2 border-blue-700 bg-gray-100 text-[20px] outline-none py-[10px] px-[20px] rounded-lg' onChange={(e) => setEmail(e.target.value)} value={email} />



        <div className='w-[100%] h-[50px] border-2 border-blue-500 bg-gray-100 text-[20px] outline-none  rounded-md relative '>
          <input type={show ? "text" : "password"} placeholder='password' required className='w-full h-full  bg-gray-100 border-none text-[20px] outline-none py-[10px] px-[20px] rounded-md overflow-hidden ' onChange={(e) => setPassword(e.target.value)} value={password} />
          <span className='absolute right-[20px] top-[7px] text-[#1dc9fd] cursor-pointer' onClick={() => setShow(prev => !prev)}>{show ? "hidden" : "show"}</span>
        </div>
        <div className="text-right mb-2 cursor-pointer text-[#07bcf3] font-medium" onClick={() => navigate("/forgot-password")}>
          Forget Password
        </div>

        {err && <p className='text-red-500 text-center'>*{err}</p>}



        <button className='w-[100%] h-[50px] rounded-full bg-[#1dc9fd] text-white text-[20px] font-semibold cursor-pointer mt-[40px]' disabled={loading}>{loading ? "Loading..." : "Login"}</button>
        <h1 className='text-center'>OR</h1>
        <button className='w-[100%]  h-[50px] rounded-full bg-[#1dc9fd] text-white text-[20px] font-semibold cursor-pointer mt-[10px] flex items-center justify-center gap-2 border  px-4 py-2 transition duration-200 boder-gray-400 hover:bg-blue-500 ' onClick={handleGoogleAuth}> <FcGoogle size={20} /> Sign up with Google</button>
        <p className='text-center' onClick={() => navigate("/signup")}> want a new Account? <span className='text-[#1dc9fd] font-extrabold text-[18px] cursor-pointer ' >SignIn</span></p>
      </form>

    </div>
  )
}

export default Login