import React, { useState, useContext } from 'react'
import logo from "../assets/logo.svg"
import { useNavigate } from "react-router-dom"
import { FcGoogle } from "react-icons/fc"
import { authDataContext } from '../context/AuthContext'
import axios from "axios"
import { userDataContext } from '../context/UserContext'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '../../firebase'
const Signup = () => {
  const { serverUrl } = useContext(authDataContext)
  const navigate = useNavigate()
  let [show, setShow] = useState(false)
  let [firstName, setFirstName] = useState("")
  let [lastName, setLastName] = useState("")
  let [userName, setUserName] = useState("")
  let [email, setEmail] = useState("")
  let [password, setPassword] = useState("")
  let [loading, setLoading] = useState(false)
  let [err, setErr] = useState("")
  let { setUserData } = useContext(userDataContext)
  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      let result = await axios.post(`${serverUrl}/api/auth/signup`, { firstName, lastName, userName, email, password }, { withCredentials: true })
      setUserData(result.data)
      navigate("/")
      setErr("")
      setLoading(false)
      setFirstName("")
      setLastName("")
      setUserName("")
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

    const fullName = result.user.displayName || "";
    const email = result.user.email || "";
    
    const [firstName, ...rest] = fullName.split(" ");
    const lastName = rest.join(" ");
    const photoURL = result.user.photoURL || "";
    const userName = email.split("@")[0]; // unique username

    const { data } = await axios.post(
      `${serverUrl}/api/auth/google-auth`,
      {
        firstName,
        lastName,
        email,
        userName,
         profileImage: photoURL
      },
      { withCredentials: true }
    );

    
    setUserData(data);
    navigate("/");

  } catch (error) {
    console.log("Google Auth Error:", error);
  }
};



  return (
    <div className='w-full h-screen bg-[white] flex flex-col items-center justify-start gap-[10px]'>
      <div className='p-[30px] lg:p-[35px] w-full h-[80px] flex items-center  '>
        <img src={logo} />
      </div>
      <form className='w-[90%] max-w-[400px] h-[700px] md:shadow-xl flex flex-col justify-center p-[15px]  gap-[10px] pb-[20px] bg-[#dcd6d6da] rounded-lg mt-[-10px]' onSubmit={handleSignUp}>
        <h1 className='text-[30px] font-bold mb-[30px] text-[#1dc9fd] text-center'>Sign Up</h1>
        <input type="text" placeholder='firstName' required className='w-[100%] h-[50px] border-2 border-blue-700 bg-gray-100 text-[20px] outline-none py-[10px] px-[20px] rounded-lg' onChange={(e) => setFirstName(e.target.value)} value={firstName} />
        <input type="text" placeholder='lastName' required className='w-[100%] h-[50px] border-2 border-blue-500 bg-gray-100 text-[20px] outline-none py-[10px] px-[20px] rounded-lg' onChange={(e) => setLastName(e.target.value)} value={lastName} />
        <input type="text" placeholder='userName' required className='w-[100%] h-[50px] border-2 border-blue-700 bg-gray-100 text-[20px] outline-none py-[10px] px-[20px] rounded-lg' onChange={(e) => setUserName(e.target.value)} value={userName} />
        <input type="email" placeholder='email' required className='w-[100%] h-[50px] border-2 border-blue-700 bg-gray-100 text-[20px] outline-none py-[10px] px-[20px] rounded-lg' onChange={(e) => setEmail(e.target.value)} value={email} />



        <div className='w-[100%] h-[50px] border-2 border-blue-500 bg-gray-100 text-[20px] outline-none  rounded-md relative '>
          <input type={show ? "text" : "password"} placeholder='password' required className='w-full h-full  bg-gray-100 border-none text-[20px] outline-none py-[10px] px-[20px] rounded-md overflow-hidden ' onChange={(e) => setPassword(e.target.value)} value={password} />
          <span className='absolute right-[20px] top-[7px] text-[#1dc9fd] cursor-pointer' onClick={() => setShow(prev => !prev)}>{show ? "hidden" : "show"}</span>
        </div>

        {err && <p className='text-red-500 text-center'>*{err}</p>}



        <button className='w-[100%] h-[50px] rounded-full bg-[#1dc9fd] text-white text-[20px] font-semibold cursor-pointer mt-[40px] hover:bg-blue-500' disabled={loading}>{loading ? "Loading..." : "Sign Up"}</button>
        <h1 className='text-center'>OR</h1>
        <button className='w-[100%]  h-[50px] rounded-full bg-[#1dc9fd] text-white text-[20px] font-semibold cursor-pointer mt-[10px] flex items-center justify-center gap-2 border  px-4 py-2 transition duration-200 boder-gray-400 hover:bg-blue-500 ' onClick={handleGoogleAuth}> <FcGoogle size={20} /> Sign up with Google</button>

        <p className='text-center' onClick={() => navigate("/login")}>Already have an account? <span className='text-[#1dc9fd] font-extrabold text-[18px] cursor-pointer ' >SignIn</span></p>
      </form>

    </div>
  )
}

export default Signup