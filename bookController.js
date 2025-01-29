const Book = require('../models/bookModel');
const userModel = require('../models/userModel');


// Publish a book
const publish_a_book = async (req, res, next) => {
    const userId = req.user;
     
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        const newBook = new Book({
            ...req.body,
            userId
        });
        const book_with_userId = await newBook.save();

        //Push the book ID to the user's publications array and save the user
        user.publications.push(book_with_userId._id);
        await user.save();

        // Populate the userId field to include user details
        //const bookWithUserDetails = await Book.findById(book_with_userId._id).populate('userId');

        // Return the newly created book with user details
        res.status(201).json({book: book_with_userId}); 
    } catch (error) {
        next(error);
    }
};

// Get all books
const get_all_books = async (req, res, next) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error) {
        next(error);
    }
};

// Get a book by id
const get_book = async (req, res) => {
    const {id} = req.params;
    try {
        const book = await Book.findById(id);
        if (!book) {
            res.status(404).json({message: 'Book not found'});
        }
        res.status(200).json(book);
    } catch (error) {
        console.log(error);
    }
};

// Update a book
const update_book = async (req, res, next) => {
    const {id} = req.params;
    const userId = req.user._id;
    if (!userId) {
        return res.status(401).json({message: 'Unauthorized: User not logged in'});
    };

    try {
        // Get the book by id
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({message: 'Book not found'});
        }

        // Check if the user is the owner of the book
        if (book.userId.toString()!== userId.toString()) {
            return res.status(403).json({message: 'You are not authorized to update this book'});
        }

        // Update the book
        const updatedBook = await Book.findByIdAndUpdate(
            id,
            req.body,
            {new: true, runValidators: true}
        );

        if (!updatedBook) {
           return next ({status: 404, message: 'Book not found'});
        }

        res.status(200).json({ message: "Book updated successfully", book: updatedBook });
    } catch (error) {
        return next ({status: 404, message: 'An error occurred while updating the book'});
    }
};

// Delete a book
const delete_book = async (req, res, next) => {
    const {id} = req.params;
    try {
        // Ensure the user is authenticated
        const userId = req.user._id;
        if (!userId) {
            return res.status(401).json({message: 'Unauthorized: User not logged in'});
        };

        // Get the book by id
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({message: 'Book not found'});
        }

        // Check if the authenticated user is the owner of the book
        if (book.userId.toString()!== userId.toString()) {
            return res.status(403).json({message: 'You are not authorized to delete this book'});
        }
        
        // Delete the book
        const deletedBook = await Book.findByIdAndDelete(id);
        if (!deletedBook) {
            res.status(404).json({message: 'Book not found'});
        }
        res.status(200).json({ message: "Book deleted successfully", book: deletedBook });
    } catch (error) {
        next({status: 404, message: "An error occurred while deleting the book"});    
    }
};

module.exports = {publish_a_book, delete_book, get_all_books, get_book, update_book};

