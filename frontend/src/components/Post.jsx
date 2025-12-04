import React, { useContext, useEffect } from 'react'
import logo2 from "../assets/empty2.png"
import moment from "moment"
import { BiLike, BiSolidLike } from "react-icons/bi"
import { useState } from 'react'
import { FaRegCommentDots } from 'react-icons/fa'
import axios from 'axios'
import { authDataContext } from '../context/AuthContext'
import { socket, userDataContext } from '../context/UserContext'
import { LuSendHorizontal } from "react-icons/lu"

import ConnectionButton from './ConnectionButton'

const Post = ({ id, author, like, comment, description, image, createdAt }) => {
    const { serverUrl } = useContext(authDataContext)
    let { getPost, userData , profileData ,setProfileData , handleGetProfile} = useContext(userDataContext)
    let [readmore, setReadmore] = useState(false)
    let [likes, setLikes] = useState([])
    let [commentcontent, setCommentContent] = useState("")
    let [comments, setComments] = useState([])
    let [showComment , setShowComment] = useState(false)


    const Like = async () => {
        try {
            let result = await axios.get(`${serverUrl}/api/post/like/${id}`, { withCredentials: true })
            setLikes(result.data.like)

        } catch (error) {
            console.log(error);

        }
    }
    const handleComment = async (e) => {
        e.preventDefault()
        try {
            let result = await axios.post(`${serverUrl}/api/post/comment/${id}`, { content: commentcontent }, { withCredentials: true })
            setComments(result.data.comment)
            setCommentContent("")



        } catch (error) {
            console.log(error);

        }
    }

   

    useEffect(()=>{
        socket.on("likeUpdated", ({postId , likes})=>{
            if(postId == id){
                setLikes(likes)
            }
        })
        socket.on("CommentUpdated", ({postId , comm})=>{
            if(postId == id){
                setComments(comm)
            }
        })


       

        return ()=>{
         socket.off("likeUpdated")
         socket.off("CommentUpdated")      
        }
    } ,[id])


    useEffect(()=>{
    setLikes(like)
    setComments(comment)
    } , [like,comment])
       
    


    return (
        <div className='w-full min-h-[200px] bg-white rounded-lg shadow-lg p-[20px] flex flex-col gap-[10px]'>

            <div className='flex justify-between items-center'>
                <div className='flex justify-center items-start gap-[10px] ' onClick={()=>handleGetProfile(author.userName)}>
                    <div className='w-[70px] h-[70px] rounded-full overflow-hidden flex items-center justify-center   cursor-pointer' >
                        <img src={author.profileImage || logo2} className=' w-full  h-full' />

                    </div>
                    <div>
                        <div className='text-[22px] font-semibold'>{author.firstName} {author.lastName}</div>
                        <div className='text-[16px] font-semibold'> {author.headline}</div>
                        <div className='text-[16px] font-semibold'> {moment(createdAt).fromNow()}</div>
                    </div>
                </div>
                <div>


                   {userData._id!=author._id &&  <ConnectionButton userId={author._id}/> }
                  


                </div>
            </div>
            <div className={`w-full ${!readmore ? "max-h-[100px] overflow-hidden" : "flex"}  pl-[50px] `}>
                {description}
            </div>
            <div className='pl-[50px] cursor-pointer text-[19px] font-semibold ' onClick={() => setReadmore(prev => !prev)}>{readmore ? "read less..." : "readmore..."}</div>
            {image && <div className='w-full h-[300px] overflow-hidden flex justify-center items-center rounded-lg '>
                <img src={image} className='h-full rounded-lg ' />

            </div>}


            <div>
                <div className='w-full flex justify-between items-center p-[20px] border-b-2 border-gray-500'>
                    <div className='flex items-center justify-center gap-[5px] text-[19px]'>
                        <BiLike className='text-[#1ebbff] w-[20px] h-[20px]' /><span>{likes.length}</span></div>
                    <div className='flex items-center justify-center gap-[5px] text-[18px] cursor-pointer' onClick={()=>setShowComment(prev=>!prev)}>{comment.length}<span></span>comment</div>


                </div>
                <div className='flex justify-between items-center w-full p-[20px] '>
                    {!likes.includes(userData._id) && <div className='flex justify-center items-center gap-[5px] cursor-pointer'>

                        <BiLike className='text-[#1ebbff] w-[24px] h-[24px]' onClick={Like} />

                        <span>Like</span>

                    </div>}
                    {likes.includes(userData._id) && <div className='flex justify-center items-center gap-[5px] cursor-pointer'>

                        <BiSolidLike className='text-[#1ebbff] w-[24px] h-[24px]' onClick={Like} />

                        <span className='text-[#07a4ff] font-semibold'>Liked</span>

                    </div>}

                    <div className='flex justify-center items-center gap-[5px] cursor-pointer' onClick={()=>setShowComment(prev=>!prev)}>
                        <FaRegCommentDots className='w-[24px] h-[24px]'  />
                        <span>Comment</span>
                    </div>
                </div>
                {showComment &&  <div>
                    <form className='w-full flex justify-between items-center border-b-2 border-b-gray-300 p-[10px]' onSubmit={handleComment}>
                        <input type="text" placeholder='leave a comment' className='outline-none border-b-gray-500 border-none' value={commentcontent} onChange={(e) => setCommentContent(e.target.value)} />
                        <button><LuSendHorizontal className='text-[#07a4ff] w-[22px] h-[22px]' /></button>
                    </form>

                    <div>
                        {comments.map((com, index) => (
                            <div key={index} className='flex flex-col gap-[10px] border-b-2 border-b-gray-300 p-[20px]'>
                                <div className='w-full flex  justify-start items-center gap-[10px]'>
                                    <div className='w-[40px] h-[40px] rounded-full overflow-hidden flex items-center justify-center   cursor-pointer' >
                                        <img src={com.user.profileImage || logo2} className='  h-full' />

                                    </div>
                                     <div>

                                    <div className='text-[16px] font-semibold'>{com.user.firstName} {com.user.lastName}</div>
                                    
                                    </div>

                                </div>

                                <div className='pl-[50px]'>{com.content}</div>

                            </div>
                        ))}

                    </div>

                </div> }
               

            </div>

        </div>
    )
}

export default Post