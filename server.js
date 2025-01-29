const express = require('express');
const bookRouter = require('./router/bookRouter');
const userRouter = require('./router/userRouter');
const connectdb = require('./db/dbController');
const error = require('./middlewares/errorhandler');
const cookieParser = require('cookie-parser');



const app = express();
require('dotenv').config();
const port = process.env.PORT;

connectdb(); // Connect to MongoDB 
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser()); // Cookie parser middleware for session management
app.use('/api', bookRouter);
app.use('/api', userRouter); 

app.use(error); // Error handling middleware
app.listen(port, ()=> {console.log("Listening")});
