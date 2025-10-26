const express=require('express')
const router=express.Router();
const {signUp, loginUser, updateUser, deleteUser}=require('../controller/UserController')

router.post('/signup',signUp)
router.post('/login',loginUser)
router.post('/update',updateUser)
router.post('/delete',deleteUser)




module.exports=router;