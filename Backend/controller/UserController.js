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

// const signinBody = zod.object({
//     username: zod.string().email(),
//     password: zod.string(),
//   });
//   exports.loginUser = async (req, res) => {
//     const parsed = signinBody.safeParse(req.body);
//     if (!parsed.success) return res.status(411).json({ message: "Incorrect inputs" });
//     try {
//       const { username, password } = req.body;
//       let findUser;

//       if (cachedUser) {
//         findUser = JSON.parse(cachedUser);
//       } else {
//         findUser = await user.findOne({ username });
//         if (!findUser) return res.status(401).json({ message: "User not found" });
//       }
  
//       const isPasswordCorrect = await bcrypt.compare(password, findUser.password);
//       if (!isPasswordCorrect) return res.status(401).json({ message: "Invalid credentials" });
  
//       const token = jwt.sign({ id: findUser._id }, JWT_SECRET, { expiresIn: "1h" });
//       return res.json({ token });
  
//     } catch (err) {
//       console.error(err);
//       return res.status(500).json({ message: "Internal server error" });
//     }
//   };


