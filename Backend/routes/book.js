const { Router } = require("express");
const multer = require('multer');
const path = require('path');

const Book = require('../models/book');
const Comment = require('../models/comment');

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

router.get("/:id", async (req, res) => {
    const book = await Book.findById(req.params.id).populate("uploadedBy");
    const comments = await Comment.find({ bookId: req.params.id }).populate(
      "createdBy"
    );
    return res.render("book", {
      user: req.user,
      book,
      comments,
    });
});

router.post("/comment/:bookId", async (req, res) => {
    await Comment.create({
      content: req.body.content,
      bookId: req.params.bookId,
      createdBy: req.user._id,
    });
    return res.redirect(`/book/${req.params.bookId}`);
  });


router.get('/borrow/:id', async(req, res) => {
    const book = await Book.findById(req.params.id);
        return res.render('borrow', {
            book,
        });
});

router.get('/return/:id', async(req, res) => {
    const book = await Book.findById(req.params.id);
    return res.render('return', {
        book,
    });
});
router.post('/borrow/:id', async (req, res) => {
    const book = await Book.findById(req.params.id);

    if(book.borrowedBy !== null) {
        req.flash('message', 'Book already Borrowed. Please wait for it to be returned');
        return res.redirect('/');
    } 
    else{
        await Book.findByIdAndUpdate(book._id, { borrowedBy: req.user._id });

        return res.redirect('/');
    }
});

router.post('/return/:id', async (req, res) => {
    const book = await Book.findById(req.params.id);
    await Book.findByIdAndUpdate(book._id, { borrowedBy: null});

    return res.redirect('/');
})

router.post('/', upload.single("coverImage"), async (req, res) => {   
    const { title, description} = req.body;
    const book = await Book.create({
        description,
        title,
        uploadedBy: req.user._id,
        borrowedBy: null,
        coverImageURL: `/uploads/${req.file.filename}`,
    });
    return res.redirect(`/book/${book._id}`);
});

module.exports = router;