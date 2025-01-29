const {Router} = require('express');
const userRouter = Router();
const {signupRouter, loginRouter} = require('../controller/userController');


// Routes
// POST /api/user/signup
userRouter.post('/user/signup', signupRouter);

// POST /api/user/login
userRouter.post('/user/login', loginRouter);


module.exports = userRouter;