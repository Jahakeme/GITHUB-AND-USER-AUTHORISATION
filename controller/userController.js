const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const generateToken = require('../jwt/tokengeneration');

// Signup route
const signupRouter = async (req, res, next) => {
    const {password, email, username} = req.body;
    if (!password ||!email ||!username) {
        return res.status(400).json({message: 'Please provide all required fields'});
    } 

    try {
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(409).json({message: 'User already exists'});
        }
        const saltRounds = bcrypt.genSaltSync(10); // generate salt
        const hashedPassword = bcrypt.hashSync(password, saltRounds); // hash password
        const newUser = new User({...req.body, password: hashedPassword});
        await newUser.save();
        res.json(newUser);
    } catch (error) {
        next ({status: 500, message: "Something went wrong"});
    }
};

// Login route
const loginRouter = async (req, res) => {
    const {email, password} = req.body;
    try {
       const user = await User.findOne({email});
        if (!user) {
              return res.status(404).json({message: 'User does not exist. Please sign up.' });
         } 
        const comparison = await bcrypt.compare(password, user.password);
        if (!comparison) {
            return res.status(401).json({message: 'Email address or password is incorrect'});
        }
        const token = generateToken(user._id); // generate token
        const {password: _, ...userWithoutPassword} = user.toObject(); // remove password from user object

        // Set the cookie to the client-side browser
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict', 
            maxAge: 3600000
        });
        res.status(200).json({message: 'Logged in successfully', user: userWithoutPassword});
    } catch (error) {
        res.status(500).json({message:'Internal Server Error', error: error.message});
    }
};    

module.exports = {signupRouter, loginRouter};