const {Router} = require("express");
const bookRouter = Router();
const {
    publish_a_book,
    get_all_books, 
    get_book, 
    update_book, 
    delete_book
} = require("../controller/bookController");
const authMiddleware = require("../middlewares/authMiddleware");


//Routes
//  POST /api/book
bookRouter.post("/book", authMiddleware, publish_a_book);

//  GET /api/books
bookRouter.get("/books", authMiddleware, get_all_books);

//  GET /api/book/:id
bookRouter.get("/book/:id", authMiddleware, get_book);

//  PUT /api/book/:id
bookRouter.put("/book/:id", authMiddleware, update_book);

//  DELETE /api/book/:id
bookRouter.delete("/book/:id", authMiddleware, delete_book);

//Exports router
module.exports = bookRouter;