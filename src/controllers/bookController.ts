import { Request, Response } from "express";
import { HTTP_STATUS } from "../constants/httpConstants";
import * as bookService from "../services/bookService";

export const getAllBooks = (req: Request, res: Response): void => {
    try {
        const books = bookService.getAllBooks();
        res.status(HTTP_STATUS.OK).json({
            message: "Books retrieved",
            data: books,
        });
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Error retrieving books",
        });
    }
};

export const addBook = (req: Request, res: Response): void => {
    try {
        const newBook = req.body;
        const createdBook = bookService.addBook(newBook);
        res.status(HTTP_STATUS.CREATED).json({
            message: "Book added",
            data: createdBook,
        });
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Error adding book",
        });
    }
};

export const updateBook = (req: Request, res: Response): void => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const updatedBook = bookService.updateBook(id, updatedData);
        if (updatedBook) {
            res.status(HTTP_STATUS.OK).json({
                message: "Book updated",
                data: updatedBook,
            });
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                message: "Book not found",
            });
        }
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Error updating book",
        });
    }
};

export const deleteBook = (req: Request, res: Response): void => {
    try {
        const { id } = req.params;
        const success = bookService.deleteBook(id);
        if (success) {
            res.status(HTTP_STATUS.OK).json({ message: "Book deleted" });
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                message: "Book not found",
            });
        }
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Error deleting book",
        });
    }
};

export const borrowBook = (req: Request, res: Response): void => {
    try {
        const { id } = req.params;
        const borrowerId = req.body.borrowerId;
        const result = bookService.borrowBook(id, borrowerId);
        if (result) {
            res.status(HTTP_STATUS.OK).json({
                message: "Book borrowed",
                data: result,
            });
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                message: "Book not found or already borrowed",
            });
        }
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Error borrowing book",
        });
    }
};

export const returnBook = (req: Request, res: Response): void => {
    try {
        const { id } = req.params;
        const result = bookService.returnBook(id);
        if (result) {
            res.status(HTTP_STATUS.OK).json({ message: "Book returned" });
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                message: "Book not found or not currently borrowed",
            });
        }
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Error returning book",
        });
    }
};

export const getRecommendations = (req: Request, res: Response): void => {
    try {
        const recommendations = bookService.getRecommendations();
        res.status(HTTP_STATUS.OK).json({
            message: "Recommendations retrieved",
            data: recommendations,
        });
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Error fetching recommendations",
        });
    }
};

export const getAvailableBooks = (req: Request, res: Response): void => {
    try {
        const availableBooks = bookService.getAllBooks().filter(book => !book.isBorrowed);

        res.status(HTTP_STATUS.OK).json({
            message: availableBooks.length > 0
                ? "Available books retrieved"
                : "No available books",
            data: availableBooks,
            count: availableBooks.length,
        });
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Error retrieving available books",
        });
    }
};

export const getBookStats = (req: Request, res: Response): void => {
    try {
        const books = bookService.getAllBooks();

        const totalBooks = books.length;
        const availableBooks = books.filter(b => !b.isBorrowed).length;
        const borrowedBooks = books.filter(b => b.isBorrowed).length;

        // Breakdown by genre
        const genreBreakdown: Record<string, number> = {};
        books.forEach(book => {
            if (book.genre) {
                genreBreakdown[book.genre] = (genreBreakdown[book.genre] || 0) + 1;
            }
        });

        res.status(HTTP_STATUS.OK).json({
            message: "Library statistics retrieved successfully",
            data: {
                totalBooks,
                availableBooks,
                borrowedBooks,
                genreBreakdown,
            },
        });
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Error retrieving library statistics",
        });
    }
};
