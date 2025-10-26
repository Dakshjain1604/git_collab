const { user } = require("../model/db");
const bcrypt = require('bcrypt');
const zod = require('zod');

const signupBody = zod.object({
    username: zod.string().email(),
    firstname: zod.string(),
    lastname: zod.string(),
    password: zod.string().min(6),  
});

exports.signUp = async (req, res) => {
    try {

        const parsed = signupBody.safeParse(req.body);
        console.log(parsed)
        console.log(req.body)
        if (!parsed.success) {
            return res.status(411).json({ message: "Incorrect inputs" });
        }
        const { username, firstname, lastname, password } = req.body;
        const findUser = await user.findOne({ username });
        if (findUser) {
            return res.status(409).json({ message: "User already exists, please login" });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        await user.create({
            username,
            password: hashedPassword,
            firstname,
            lastname
        });

        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string(),
  });
  exports.loginUser = async (req, res) => {
    const parsed = signinBody.safeParse(req.body);
    if (!parsed.success) return res.status(411).json({ message: "Incorrect inputs" });
    try {
      const { username, password } = req.body;
      let findUser;

      if (cachedUser) {
        findUser = JSON.parse(cachedUser);
      } else {
        findUser = await user.findOne({ username });
        if (!findUser) return res.status(401).json({ message: "User not found" });
      }
  
      const isPasswordCorrect = await bcrypt.compare(password, findUser.password);
      if (!isPasswordCorrect) return res.status(401).json({ message: "Invalid credentials" });
  
      const token = jwt.sign({ id: findUser._id }, JWT_SECRET, { expiresIn: "1h" });
      return res.json({ token });
  
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };


  exports.updateUser = async(req, res)=>{
    try{
        const {username} = req.body;
        if(!username){
            return res.status(400).json({message: "username needed for updation"});
        }
        const finduser = await user.findOne({username});
        if(!finduser){
            return res.status(404).json({message: "user not found"});
        }
        const updateData = {};
        const {firstname, lastname, password} = req.body;
        if(firstname) updateData.firstname = firstname;
        if(lastname) updateData.lastname = lastname;
        if(password){
         updateData.password = await bcrypt.hash(password, 10);
        }
        await user.updateOne({username},{$set: updateData});
        return res.status(200).json({message: "user updated successfully"});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message: "server error"});
    }
  };

exports.deleteUser = async (req, res) => {
    try{
        const {username} = req.body;
        if(!username){
            return res.status(400).json({message: "username needen for deletion"});
        }
        const deletedUser = await user.deleteOne({username});
        if(deletedUser.deletedCount === 0){
            return res.status(404).json({message: "user not found"})
        }
        return res.status(200).json({message: "user deleted successfully"});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message: "serverr error"});
    }

};