import React, { useContext, useEffect, useState } from 'react'
import Nav from '../components/Nav'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import logo2 from "../assets/empty2.png"
import { RxCross1 } from "react-icons/rx"

const Notification = () => {
    let { serverUrl } = useContext(authDataContext)
    let [notificationData, setNotificationData] = useState([])

    const handleGetNotification = async () => {
        try {
            let result = await axios.get(serverUrl + "/api/notification/get", { withCredentials: true })
            console.log(result);
            setNotificationData(result.data)
        } catch (error) {
            console.log(error);
        }
    }

    const handleDeleteNotification = async (id) => {
        try {
            let result = await axios.delete(serverUrl + `/api/notification/deleteone/${id}`, { withCredentials: true })
            console.log(result);
            await handleGetNotification()
        } catch (error) {
            console.log(error);
        }
    }

    const handleClearNotification = async () => {
        try {
            let result = await axios.delete(serverUrl + "/api/notification", { withCredentials: true })
            console.log(result);
            await handleGetNotification()
        } catch (error) {
            console.log(error);
        }
    }


    function handleMessage(type) {
        if (type === "like") {
            return "liked your post";
        } else if (type === "comment") {
            return "commented on your post";
        } else if (type === "connectionAccepted") {
            return "accepted your connection";
        } else if (type === "connectionRemoved") {
            return "removed you from connection";
        } else {
            return "sent you a notification";
        }
    }




    useEffect(() => {
        handleGetNotification()
    }, [])
    return (
        <div className='w-screen h-[100vh] bg-[#f0efe7] pt-[100px] px-[20px] flex flex-col items-center gap-[40px]'>
            <Nav />

            <div className='w-full h-[100px] bg-white shadow-lg rounded-lg flex items-center p-[10px] text-[22px] text-gray-600 justify-between'>
                <div>
                    Invitations Notification {notificationData.length}
                </div>
                {notificationData.length > 0 && <button className='min-w-[100px] h-[40px] rounded-full border-2 border-[#ff2d2d] text-[#fd1b1b]' onClick={handleClearNotification}>
                    Clear All
                </button>}

            </div>
            {notificationData.length > 0 && <div className='w-[100%] max-w-[900px] shadow-lg flex flex-col gap-[20px] h-[100vh] overflow-auto  bg-gray-100 p-[10px]'>
                {notificationData.map((notification, index) => (
                    <div key={index} className='w-full min-h-[100px] flex justify-between items-center border-b-2 border-gray-200'>
                        <div className=''>
                            <div className='flex justify-center items-center gap-[10px]'>
                                <div className='  w-[60px] h-[60px] rounded-full overflow-hidden text-gray-600 cursor-pointer' >
                                    <img src={notification?.relatedUser?.profileImage || logo2} alt="" className='w-full h-full' />
                                </div>
                                <div>
                                    <div className='text-[19px] font-semibold text-gray-700'>
                                        <div className='text-[19px] font-semibold text-gray-700'>
                                            {`${notification?.relatedUser?.firstName || "Unknown"} ${notification?.relatedUser?.lastName || ""} : ${handleMessage(notification.type)}`}
                                        </div>

                                    </div>
                                    {notification.relatedPost && <div className={`flex items-center  ${notification.relatedPost.description ? " ml-[-80px]" : " gap-[10px] ml-[80px]"} h-[70px] overflow-hidden`}>
                                        <div className='w-[80px] h-[50px] overflow-hidden'>
                                            <img src={notification.relatedPost} alt="" className='h-full' />
                                        </div>
                                        <div>{notification.relatedPost.description}</div>
                                    </div>}
                                </div>



                            </div>


                        </div>
                        <div className='flex justify-center items-center gap-[10px]'>
                            <div className=' right-[20px] top-[20px]   cursor-pointer ' onClick={() => handleDeleteNotification(notification._id)}>
                                <RxCross1 className='w-[25px] h-[25px] font-bold text-gray-800' />
                            </div>

                        </div>




                    </div>
                ))}
            </div>}
        </div>
    )
}

export default Notification