import React, { createContext, useContext, useEffect, useState } from 'react'
import { authDataContext } from './AuthContext'
import axios, { Axios } from 'axios'
import { useNavigate } from 'react-router-dom'
import {io} from "socket.io-client"

export let socket = io("http://localhost:2000")

export const userDataContext = createContext()

const UserContext = ({ children }) => {
    let navigate = useNavigate()
    const [userData, setUserData] = useState(null)
    const { serverUrl } = useContext(authDataContext)
    let [edit ,setEdit] = useState(false)
    let [postData , setPostData] = useState([])
     
    let [profileData ,setProfileData] = useState([])
    const getCurrentUser = async () => {
        try {
            let result = await axios.get(`${serverUrl}/api/user/currentuser`, { withCredentials: true })
           
            setUserData(result.data)
        } catch (error) {
            console.log(error)
            setUserData(null)
        }
    }


    const getPost = async()=>{
        try {
            let result = await axios.get(serverUrl+"/api/post/getpost", {withCredentials:true})

            setPostData(result.data)
            
        } catch (error) {
            console.log(error);
            
        }
    }

     const handleGetProfile = async(userName)=>{
        try {
            let result = await axios.get(serverUrl+`/api/user/getprofile/${userName}`, {withCredentials:true})
            setProfileData(result.data)
            navigate("/profile")
        } catch (error) {
            console.log(error);
        }
     }

    useEffect(() => {
        getCurrentUser()
        getPost()
    }, [])

    const value = {
        userData,
        
        setUserData,
        edit ,setEdit,
        postData , setPostData,
        getPost,
        handleGetProfile,
        profileData ,setProfileData
    }



   

    return (
        <userDataContext.Provider value={value}>
            {children}
        </userDataContext.Provider>
    )
}

export default UserContext
