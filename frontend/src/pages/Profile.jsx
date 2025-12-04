import React, { useContext, useEffect, useState } from 'react'
import Nav from '../components/Nav'
import { userDataContext } from '../context/UserContext'
import logo2 from "../assets/empty2.png"
import { FiCamera, FiPlus } from 'react-icons/fi'
import { HiPencil } from 'react-icons/hi2'
import EditProfile from '../components/EditProfile'


import Post from '../components/Post'
import ConnectionButton from '../components/ConnectionButton'

const Profile = () => {


    let { userData, edit, setEdit, postData, profileData } = useContext(userDataContext)
    let [profilePost, setProfilePost] = useState([])




    useEffect(() => {
        setProfilePost(postData.filter((post) => post.author._id == profileData._id))
    }, [profileData])
    return (
        <div className='w-full min-h-[100vh] bg-[#f0efe7] flex flex-col items-center pt-[100px] pb-[40px]'>
            <Nav />
            {edit && <EditProfile />}

            <div className='w-full max-w-[900px] min-h-[100vh] flex flex-col gap-[10px]'>
                <div className='relative bg-white pb-[40px] rounded-lg shadow-lg'>


                    <div className='w-[100%] h-[110px] bg-gray-400 rounded-lg cursor-pointer' >
                        <img src={profileData.coverImage || ""} className='w-full h-full' />
                        {profileData._id == userData._id && <> <FiCamera className='absolute right-[20px] top-[20px] w-[25px] h-[25px] text-white font-extrabold ' onClick={() => setEdit(true)} /></>}

                    </div>

                    <div className='w-[70px] h-[70px] rounded-full overflow-hidden flex items-center justify-center absolute top-[65px] left-[35px] cursor-pointer' >
                        <img src={profileData.profileImage || logo2} className=' w-full  h-full' />

                    </div>
                    {profileData._id == userData._id && <div className='w-[20px] h-[20px] bg-[#17c1ff] absolute top-[100px] left-[90px] rounded-full flex items-center justify-center cursor-pointer' onClick={() => setEdit(true)}>

                        <FiPlus className='text-white' />
                    </div>}





                    <div className='mt-[30px] pl-[20px]  font-semibold text-gray-700'>
                        <div className='text-[24px] font-semibold'>{profileData.firstName} {userData.lastName}</div>
                        <div className=' text-[18px]  text-gray-600'>{profileData.headline || ""}</div>

                        <div className=' text-[16px]  text-gray-500'>{profileData.location}</div>
                        <div className=' text-[16px]  text-gray-500'>{`${profileData.connection.length} connection`}</div>


                    </div>
                    {profileData._id == userData._id && <button className='min-w-[150px] ml-[20px] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] my-[20px]   flex items-center justify-center gap-[10px]' onClick={() => setEdit(true)}>Edit Profile <HiPencil /> </button>}
                    {profileData._id != userData._id && <div className='ml-[20px] mt-[20px]'> <ConnectionButton userId={profileData._id} /></div>}



                </div>

                <div className="flex flex-col gap-[10px]">
                    <div className='w-full min-h-[100px] flex items-center p-[20px] text-[22px] text-gray-600 font-semibold bg-white shadow-lg '>
                        {`Post (${profilePost.length})`}
                    </div>
                    {profilePost.map((post, index) => (
                        <Post key={index} id={post._id} description={post.description} author={post.author} image={post.image} like={post.like} comment={post.comment} createdAt={post.createdAt} />
                    ))}
                    {userData.skills?.length > 0 && <div className='w-full min-h-[100px] flex flex-col gap-[10px] justify-center p-[20px]  font-semibold bg-white shadow-lg'>
                        <div className='text-[22px] text-gray-600'>
                            Skills
                        </div>
                        <div className='flex flex-wrap justify-start items-center gap-[20px] text-gray-500 p-[20px]'>
                            {profileData.skills.map((skill) => (
                                <div className="text-[20px]">{skill}</div>
                            ))}


                            {profileData._id == userData._id && <button className='min-w-[150px]  h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] ml-[20px]   flex items-center justify-center gap-[10px]' onClick={() => setEdit(true)}>Add Skill</button>}


                        </div>
                    </div>}

                    {userData.education?.length > 0 && <div className='w-full min-h-[100px] flex flex-col gap-[10px] justify-center p-[20px]  font-semibold bg-white shadow-lg'>
                        <div className='text-[22px] text-gray-600'>
                            Education
                        </div>
                        <div className='flex flex-col justify-start items-start gap-[20px] text-gray-500 p-[20px]'>
                            {profileData.education.map((edu) => (
                                <>
                                    <div className="text-[20px]">College: {edu.college}</div>
                                    <div className="text-[20px]">Degree:{edu.degree}</div>
                                    <div className="text-[20px]">Field of Study: {edu.fieldOfStudy}</div>
                                </>

                            ))}
                            {profileData._id == userData._id && <button className='min-w-[150px]  h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff]   flex items-center justify-center gap-[10px]' onClick={() => setEdit(true)}>Add Education</button>}


                        </div>
                    </div>}

                    {userData.experience?.length > 0 && <div className='w-full min-h-[100px] flex flex-col gap-[10px] justify-center p-[20px]  font-semibold bg-white shadow-lg'>
                        <div className='text-[22px] text-gray-600'>
                            ExPerience
                        </div>
                        <div className='flex flex-col justify-start items-start gap-[20px] text-gray-500 p-[20px]'>
                            {profileData.experience.map((exp) => (
                                <>
                                    <div className="text-[20px]">Experience: {exp.title}</div>
                                    <div className="text-[20px]">Company:{exp.company}</div>
                                    <div className="text-[20px]">Role: {exp.description}</div>
                                </>

                            ))}
                            {profileData._id == userData._id && <button className='min-w-[150px]  h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff]   flex items-center justify-center gap-[10px]' onClick={() => setEdit(true)}>Add Experience</button>}


                        </div>
                    </div>}



                </div>

            </div>


        </div>

    )
}

export default Profile