const mongoose = require('mongoose');

const userModel = new mongoose.Schema(
    {
        username:{
            type: String,
            required: true,
            unique: true,
        },
        email:{
            type: String,
            required: true,
            unique: true,
        },
        password:{
            type: String,
            required: true,
        },
        publications: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Book'
            }],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('User', userModel);