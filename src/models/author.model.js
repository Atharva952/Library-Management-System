import mongoose from "mongoose";

const authorSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
    },
    birthDate: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deleteAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const AuthorModel = mongoose.model("Author", authorSchema);
export default AuthorModel;
