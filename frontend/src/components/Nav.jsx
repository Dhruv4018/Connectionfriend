import React, { useContext, useState } from 'react'
import logo1 from "../assets/logo1.png"
import logo2 from "../assets/empty2.png"
import { IoSearchSharp } from "react-icons/io5"
import { TiHome } from "react-icons/ti"
import { FaUserGroup } from "react-icons/fa6"
import { IoNotificationsSharp } from 'react-icons/io5'
import { userDataContext } from '../context/UserContext'
import axios from 'axios'
import { authDataContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
const Nav = () => {
  let navigate = useNavigate()
  let { userData, setUserData, handleGetProfile } = useContext(userDataContext)
  let [active, setActive] = useState(false)
  let { serverUrl } = useContext(authDataContext)
  let [showPop, setShowPop] = useState(false)
  let [searchInput, setSerachInput] = useState("")
  let [searchData, setSearchData] = useState([])
  let handleSignOut = async () => {
    try {
      let result = await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
      navigate("/login")
      setUserData(null)
      console.log(result);


    } catch (error) {
      console.log(error);

    }
  }

  const handleSearch = async () => {
    try {
      let result = await axios.get(`${serverUrl}/api/user/search?query=${searchInput}`, { withCredentials: true })

      setSearchData(result.data)
    } catch (error) {
      setSearchData([])
      console.log(error);
    }
  }

  useEffect(() => {

    handleSearch()

  }, [searchInput])

  return (
    <div className='w-full h-[80px] bg-[white] fixed top-0 shadow-xl flex justify-between md:justify-around  item-center px-[10px] left-0 z-[80] '>
      <div className='flex justify-center items-center gap-[10px] cursor-pointer '>
        <div onClick={() => {
          setActive(false)

          navigate("/")
        }}

        >
          <img src={logo1} alt="" className='w-[70px]' />
        </div>


        <div>
          {!active && <IoSearchSharp className='w-[23px] h-[23px] text-gray-700 lg:hidden' onClick={() => setActive(true)} />}

        </div>
        {searchData.length > 0 && <div className='absolute min-h-[100px] top-[90px] h-[500px] lg:left-[20px] shadow-lg left-[0px] w-[100%] lg:w-[700px]  max-w-[500px] bg-white flex flex-col gap-[20px] p-[20px] overflow-auto'>

          {searchData.map((sea) => (
            <div className='flex gap-[20px] items-center border-b-2 border-b-gray-500 p-[10px] hover:bg-gray-200  cursor-pointer rounded-lg' onClick={() => handleGetProfile(sea.userName)}>
              <div className='w-[50px] h-[50px] rounded-full overflow-hidden text-gray-600   '>
                <img src={sea.profileImage || logo2} className='w-full h-full' />

              </div>
              <div className='flex flex-col'>
                <div className='text-[19px] font-semibold text-gray-700 '>
                  {`${sea.firstName} ${sea.lastName}`}
                </div>
                <div className='text-[15px] font-semibold text-gray-700'>
                  {`${sea.headline} `}
                </div>
              </div>
            </div>
          ))}


        </div>}



        <form className={`w-[190px] lg:w-[350px] h-[40px] bg-[#f0efe7] lg:flex items-center gap-[10px] px-[10px] py-[5px] rounded-md ${!active ? "hidden" : "flex"} `}>
          <div>
            <IoSearchSharp className='w-[23px] h-[23px] text-gray-700' />
          </div>
          <input type="text" className='w-[80%] h-full bg-transparent outline-none border-0' placeholder='search user....' onChange={(e) => setSerachInput(e.target.value)} value={searchInput} />
        </form>
      </div>







      <div className='flex justify-center items-center gap-[20px] '>
        {showPop && <div className='w-[300px] min-h-[300px] bg-white shadow-lg absolute top-[83px] rounded-lg flex flex-col items-center p-[20px] gap-[20px] right-[20px] lg:right-[100px]'>
          <div className='w-[70px] h-[70px] rounded-full overflow-hidden text-gray-600 '>
            <img src={userData.profileImage || logo2} className='w-full h-full' />

          </div>
          <div className='text-[19px] font-semibold text-gray-700'>
            {`${userData.firstName} ${userData.lastName}`}
          </div>
          <button className='w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff]' onClick={() => handleGetProfile(userData.userName)}>View Profile</button>
          <div className='w-full h-[1px] bg-gray-700'></div>

          <div className='flex w-full items-center justify-start text-gray-600 gap-[10px] cursor-pointer' onClick={() => navigate("/network")}>
            <FaUserGroup className='w-[23px] h-[23px] text-gray-600' />
            <div>My Network</div>


          </div>
          <button className='w-[100%] h-[40px] rounded-full border-2 border-[#ff2d2d] text-[#fd1b1b]' onClick={handleSignOut}>Sign Out</button>

        </div>}


        <div className='lg:flex flex-col items-center justify-center text-gray-600 hidden cursor-pointer' onClick={() => navigate("/")}>
          <TiHome className='w-[23px] h-[23px] text-gray-600' />
          <div>Home</div>
        </div>
        <div className='md:flex flex-col items-center justify-center text-gray-600 hidden cursor-pointer' onClick={() => navigate("/network")}>
          <FaUserGroup className='w-[23px] h-[23px] text-gray-600' />
          <div>My Network</div>
        </div>
        <div className='flex flex-col items-center justify-center text-gray-600 cursor-pointer ' onClick={() => navigate("/notification")}>
          <IoNotificationsSharp className='w-[23px] h-[23px] text-gray-600' />
          <div className='hidden md:block'>Notifications</div>
        </div>
        <div className='w-[50px] h-[50px] rounded-full overflow-hidden text-gray-600 cursor-pointer' onClick={() => setShowPop(prev => !prev)}>
          <img src={userData.profileImage || logo2} alt="" className='w-full h-full' />
        </div>
      </div>
    </div>
  )
}

export default Nav