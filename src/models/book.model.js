import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    coverImage: {
      localPath: { type: String },
      cloudinary: {
        public_id: { type: String },
        url: { type: String },
      },
    },
    authorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
    },
    publishDate: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deleteAt: {
      type: Date,
      default: null,
      index: {
        expireAfterSeconds: 30 * 24 * 60 * 60,
        partialFilterExpression: { isDeleted: true },
      },
    },
  },
  {
    timestamps: true,
  },
);

const BookModel = mongoose.model("Book", bookSchema);
export default BookModel;

