const mongoose = require('mongoose');


const bookModel = new mongoose.Schema(
    {
        bookName:{
            type: String,
            required: true
        },
        author:{
            type: String,
            required: true
        },
        price:{
            type: Number,
            required: true
        },
        YearOfPublication:{
            type: String,
            required: true
        },
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    }, 
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Book', bookModel);