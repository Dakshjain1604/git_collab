import React, { createContext, useState } from 'react'






export const UserContext = createContext();


 export const UserProvider =({children})=>{
    const [firstName , setFirstName] = useState();
    const [lastName , setLastName] = useState();
    const [email , setEmail] = useState();
    const [password , setPassword] = useState();
 }


const UserProfile = () => {
  return (
    <div>UserProfile</div>
  )
}

export default UserProfile