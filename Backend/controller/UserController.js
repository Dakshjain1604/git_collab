const { User } = require("../model/db");
const bcrypt = require('bcrypt');
const zod = require('zod');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

if (JWT_SECRET === "your-secret-key-change-in-production") {
  console.warn("⚠️  WARNING: Using default JWT_SECRET. Set JWT_SECRET environment variable in production!");
}

const signupBody = zod.object({
    username: zod.string().email().toLowerCase(),
    firstname: zod.string().min(1).max(50).trim(),
    lastname: zod.string().min(1).max(50).trim(),
    password: zod.string().min(6).max(100),  
});

exports.signUp = async (req, res) => {
    try {
        const parsed = signupBody.safeParse(req.body);
        
        if (!parsed.success) {
            const errors = parsed.error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }));
            return res.status(400).json({ 
                success: false,
                message: "Validation failed",
                errors 
            });
        }

        const { username, firstname, lastname, password } = parsed.data;
        
        const findUser = await User.findOne({ username });
        if (findUser) {
            return res.status(409).json({ 
                success: false,
                message: "User already exists, please login" 
            });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username,
            password: hashedPassword,
            firstname,
            lastname
        });

        const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: "7d" });

        res.status(201).json({ 
            success: true,
            message: "User created successfully",
            token
        });
    } catch (err) {
        console.error("Signup error:", err);
        
        if (err.code === 11000) {
            return res.status(409).json({ 
                success: false,
                message: "User already exists" 
            });
        }
        
        res.status(500).json({ 
            success: false,
            message: "Server error during signup" 
        });
    }
};

const signinBody = zod.object({
    username: zod.string().email().toLowerCase(),
    password: zod.string().min(1),
});

exports.loginUser = async (req, res) => {
    const parsed = signinBody.safeParse(req.body);
    
    if (!parsed.success) {
        const errors = parsed.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
        }));
        return res.status(400).json({ 
            success: false,
            message: "Validation failed",
            errors 
        });
    }
    
    try {
        const { username, password } = parsed.data;
        
        const findUser = await User.findOne({ username }).select('+password');
        if (!findUser) {
            return res.status(401).json({ 
                success: false,
                message: "Invalid credentials" 
            });
        }
    
        // FIX: Remove the third parameter (10) from bcrypt.compare
        const isPasswordCorrect = await bcrypt.compare(password, findUser.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ 
                success: false,
                message: "Invalid credentials" 
            });
        }
    
        const token = jwt.sign({ id: findUser._id }, JWT_SECRET, { expiresIn: "7d" });
        
        return res.status(200).json({ 
            success: true,
            token,
            user: {
                id: findUser._id,
                username: findUser.username,
                firstname: findUser.firstname,
                lastname: findUser.lastname
            }
        });
    
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ 
            success: false,
            message: "Internal server error" 
        });
    }
};

const getUserFromToken = (req) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return null;
        }

        const token = authHeader.startsWith("Bearer ") 
            ? authHeader.substring(7) 
            : authHeader;
        
        if (!token || token.trim() === "") {
            return null;
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        
        if (!decoded || !decoded.id) {
            return null;
        }
        
        return decoded.id;
    } catch (err) {
        return null;
    }
};

const updateUserBody = zod.object({
    firstname: zod.string().min(1).max(50).trim().optional(),
    lastname: zod.string().min(1).max(50).trim().optional(),
    password: zod.string().min(6).max(100).optional(),
}).refine(data => data.firstname || data.lastname || data.password, {
    message: "At least one field (firstname, lastname, or password) must be provided"
});

exports.updateUser = async (req, res) => {
    try {
        // Use userId from authenticate middleware if available, otherwise fallback to getUserFromToken
        const userId = req.userId || getUserFromToken(req);
        if (!userId) {
            return res.status(401).json({ 
                success: false,
                message: "Unauthorized. Please login." 
            });
        }

        const parsed = updateUserBody.safeParse(req.body);
        
        if (!parsed.success) {
            const errors = parsed.error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }));
            return res.status(400).json({ 
                success: false,
                message: "Validation failed",
                errors 
            });
        }

        const findUser = await User.findById(userId);
        if (!findUser) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }

        const updateData = {};
        const { firstname, lastname, password } = parsed.data;
        
        if (firstname) updateData.firstname = firstname;
        if (lastname) updateData.lastname = lastname;
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        await User.updateOne({ _id: userId }, { $set: updateData });
        
        return res.status(200).json({ 
            success: true,
            message: "User updated successfully" 
        });
    } catch (err) {
        console.error("Update user error:", err);
        return res.status(500).json({ 
            success: false,
            message: "Server error" 
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.userId || getUserFromToken(req);
        if (!userId) {
            return res.status(401).json({ 
                success: false,
                message: "Unauthorized. Please login." 
            });
        }

        const deletedUser = await User.deleteOne({ _id: userId });
        
        if (deletedUser.deletedCount === 0) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }
        
        return res.status(200).json({ 
            success: true,
            message: "User deleted successfully" 
        });
    } catch (err) {
        console.error("Delete user error:", err);
        return res.status(500).json({ 
            success: false,
            message: "Server error" 
        });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const userId = req.userId || getUserFromToken(req);
        if (!userId) {
            return res.status(401).json({ 
                success: false,
                message: "Unauthorized. Please login." 
            });
        }

        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }

        return res.status(200).json({ 
            success: true,
            user: {
                id: user._id,
                username: user.username,
                firstname: user.firstname,
                lastname: user.lastname,
                createdAt: user.createdAt
            }
        });
    } catch (err) {
        console.error("Get profile error:", err);
        return res.status(500).json({ 
            success: false,
            message: "Server error" 
        });
    }
};

exports.getUserFromToken = getUserFromToken;