const { Schema, model } = require("mongoose");

const bookSchema = new Schema({
        title: {
            type: String,
            required: true,
        },
        description: {
            type:String,
            required: true,
        },
        coverImageURL: {
            type: String,
            required: false,
        },
        borrowedBy: {
            type: Schema.Types.ObjectId,
            ref: "user",
        },
        uploadedBy: {
            type: Schema.Types.ObjectId,
            ref: "user",
        },
    },
    { timestamps: true }
);

const Book = model("book", bookSchema);

module.exports = Book; 