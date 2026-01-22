const express=require('express')
const router=express.Router();
const {signUp, loginUser, updateUser, deleteUser, getProfile}=require('../controller/UserController')
const {authenticate} = require('../middleware/authMiddleware')

router.post('/signup',signUp)
router.post('/signin',loginUser)
router.post('/update',authenticate, updateUser)
router.post('/delete',authenticate, deleteUser)
router.get('/profile',authenticate, getProfile)




module.exports=router;