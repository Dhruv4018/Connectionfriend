import Nav from '../components/Nav'
import logo2 from "../assets/empty2.png"
import { FiPlus, FiCamera } from "react-icons/fi"
import { useContext, useEffect, useRef, useState } from 'react'
import { HiPencil } from 'react-icons/hi2'
import { userDataContext } from '../context/UserContext'
import EditProfile from '../components/EditProfile'
import { RxCross1 } from 'react-icons/rx'
import { BsImage } from "react-icons/bs"
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import Post from '../components/Post'
import ConnectionButton from '../components/ConnectionButton'
const Home = () => {
  const { userData, edit, setEdit, postData , handleGetProfile } = useContext(userDataContext)
  const { serverUrl } = useContext(authDataContext)
  let uploadimage = useRef()
  let [frontendImage, setFrontendImage] = useState("");
  let [backendImage, setBackendImage] = useState("")
  let [description, setDescription] = useState("")
  let [uploadPost, setUploadPost] = useState(false)
  let [loading, setLoading] = useState(false)
  let [suggestedUser, setSuggestedUsers] = useState([])

  function handleImage(e) {
    let file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }




  const createPost = async () => {
    setLoading(true)
    try {
      let formdata = new FormData()
      formdata.append("description", description)
      if (backendImage) {
        formdata.append("image", backendImage)
      }
      let result = await axios.post(`${serverUrl}/api/post/create`, formdata, { withCredentials: true })


      console.log(result);
      setLoading(false)
      setUploadPost(false)
    } catch (error) {
      setLoading(false)
      console.log(error);
    }
  }

  const handleSuggestedUsers = async () => {
    try {
      let result = await axios.get(`${serverUrl}/api/user/suggestedUsers`, { withCredentials: true })
      setSuggestedUsers(result.data)
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    handleSuggestedUsers()
  }, [])



  return (
    <div className='w-full min-h-[100vh] bg-[#f0efe7] pt-[100px] flex flex-col lg:flex-row items-center lg:items-start justify-center gap-[20px] px-[20px] relative pb-[50px]'>
      {edit && <EditProfile />}

      <Nav />

      <div className='w-full lg:w-[25%] min-h-[200px] bg-[white] shadow-lg rounded-lg p-[10px] relative '>
        <div className='w-[100%] h-[100px] bg-gray-400 rounded-lg cursor-pointer' onClick={() => setEdit(true)}>
          <img src={userData.coverImage || ""} className='w-full h-full' />
          <FiCamera className='absolute right-[20px] top-[20px] w-[25px] text-gray-800 ' />
        </div>

        <div className='w-[70px] h-[70px] rounded-full overflow-hidden flex items-center justify-center absolute top-[65px] left-[35px] cursor-pointer' onClick={() => setEdit(true)}>
          <img src={userData.profileImage || logo2} className=' w-full  h-full' />

        </div>
        <div className='w-[20px] h-[20px] bg-[#17c1ff] absolute top-[100px] left-[90px] rounded-full flex items-center justify-center'>
          <FiPlus className='text-white' />
        </div>


        <div className='mt-[30px] pl-[20px]  font-semibold text-gray-700'>
          <div className='text-[22px]'>{userData.firstName} {userData.lastName}</div>
          <div className=' text-[18px]  text-gray-600'>{userData.headline || ""}</div>

          <div className=' text-[16px]  text-gray-500'>{userData.location}</div>

        </div>
        <button className='w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] my-[20px]   flex items-center justify-center gap-[10px]' onClick={() => setEdit(true)}>Edit Profile <HiPencil /> </button>


      </div>


      {uploadPost && <div className='w-full h-full bg-black  opacity-[0.6] fixed left-0 top-0 z-[100]'>


      </div>}

      {uploadPost && <div className='w-[90%] max-w-[500px] h-[600px] bg-white top-[100px] shadow-lg rounded-lg fixed mb-[110px] z-[200] p-[20px] flex items-start justify-start flex-col gap-[20px]'>
        <div className='absolute right-[20px] top-[20px]   cursor-pointer ' >
          <RxCross1 className='w-[25px] h-[25px] font-bold text-gray-800' onClick={() => setUploadPost(false)} /></div>
        <div className='flex justify-start items-center gap-[10px]'>
          <div className='w-[70px] h-[70px] rounded-full overflow-hidden flex items-center justify-center top-[65px] left-[35px] cursor-pointer' >
            <img src={userData.profileImage || logo2} className=' w-full  h-full' />

          </div>
          <div className='text-[22px]'>{userData.firstName} {userData.lastName}</div>
        </div>
        <textarea className={`w-full ${frontendImage ? "h-[200px]" : "h-[550px]"} outline-none border-none p-[10px] resize-none text-[19px] `} placeholder='What do you want to talk about...?' onChange={(e) => setDescription(e.target.value)} value={description}></textarea>
        <input type="file" hidden ref={uploadimage} onChange={handleImage} />

        <div className='w-full h-[300px] overflow-hidden flex justify-center items-center rounded-lg'>
          <img src={frontendImage || ""} alt="" className='h-full rounded-lg' />
        </div>

        <div className='w-full h-[200px] flex flex-col'>
          <div className='p-[20px] flex items-center justify-start border-b-2 border-gray-500'>
            <BsImage className='w-[24px] h-[24px] text-gray-500 cursor-pointer' onClick={() => uploadimage.current.click()} />
          </div>


          <div className='flex justify-end items-end'>
            <button className='w-[100px] h-[50px] rounded-full  bg-[#2dc0ff] text-white my-[20px] font-semibold   flex items-center justify-center gap-[10px]' disabled={loading} onClick={createPost}>
              {loading ? "Loading..." : "Post"}
            </button>


          </div>

        </div>

      </div>
      }





      <div className='w-full lg:w-[50%] min-h-[200px] bg-[#f0efe7] shadow-lg rounded-lg flex flex-col gap-[20px]  '>
        <div className='w-full h-[120px] bg-white shadow-lg rounded-lg flex items-center justify-center gap-[10px] p-[20px]'>
          <div className='w-[70px] h-[70px] rounded-full overflow-hidden flex items-center justify-center   cursor-pointer'>
            <img src={userData.profileImage || logo2} className=' w-full  h-full' />

          </div>
          <button className='w-[80%] h-[60%] border-2 border-gray-500 rounded-full   flex items-start justify-start px-[20px] py-[12px] font-semibold hover:bg-gray-100 ' onClick={() => setUploadPost(true)}>Start a post</button>
        </div>
        {postData.map((post, index) => (
          <Post key={index} id={post._id} description={post.description} author={post.author} image={post.image} like={post.like} comment={post.comment} createdAt={post.createdAt} />
        ))}

      </div>
      <div className='w-full lg:w-[25%] min-h-[200px] bg-[white] shadow-lg rounded-lg hidden lg:flex flex-col p-[20px]'>
        <h1 className='text-[20px] text-gray-600 font-semibold'>Suggested Users</h1>
        {suggestedUser.length > 0 && <div className='flex flex-col gap-[10px]'>

          {suggestedUser.map((su) => (
            <div className='flex items-center gap-[10px] mt-[10px] cursor-pointer hover:bg-gray-200 rounded-lg p-[5px]' onClick={()=>handleGetProfile(su.userName)}>
              <div className='w-[40px] h-[40px] rounded-full overflow-hidden text-gray-600   '>
                <img src={su.profileImage || logo2} className='w-full h-full' />

              </div>
              <div className='flex flex-col '>
                <div className='text-[19px] font-semibold text-gray-700 '>
                  {`${su.firstName} ${su.lastName}`}
                </div>
                <div className='text-[12px] font-semibold text-gray-700'>
                  {`${su.headline} `}
                </div>
              </div>
            </div>


          ))}

        </div>}
        {suggestedUser.length == 0 && <div>
          No Suggested Users

        </div>}


      </div>



    </div>
  )
}

export default Home