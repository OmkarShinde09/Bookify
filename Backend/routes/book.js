const { Router } = require("express");
const multer = require('multer');
const path = require('path');

const Book = require('../models/book');

const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./publics/uploads/`));
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    },
});

const upload = multer({ storage: storage });

router.get('/add-new', (req, res) => {
    return res.render("addBook", {
        user: req.user,
    });
});

router.post('/', upload.single("coverImage"), async (req, res) => {   
    const { title, description} = req.body;
    const book = await Book.create({
        description,
        title,
        uploadedBy: req.user._id,
        coverImageURL: `/uploads/${req.file.filename}`,
    });
    return res.redirect(`/book/${book._id}`);
});

module.exports = router;