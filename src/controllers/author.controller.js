import AuthorModel from "../models/author.model.js";
import BookModel from "../models/book.model.js";

export const createAuthor = async (req, res) => {
  try {
    const { firstname, lastname, bio, birthDate } = req.body;

    const newAuthor = await AuthorModel.create({
      firstname,
      lastname,
      bio,
      birthDate,
    });

    return res.status(201).json({
      data: newAuthor,
      message: "All good",
      success: true,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "api error",
      success: false,
    });
  }
};

export const getAllAuthor = async (req, res) => {
  try {
    const { limit = 10, page = 1, search, sort } = req.query;
    const skipval = Number(limit) * (Number(page) - 1);
    let filter = { isDeleted: false };

    if (search) {
      const searchRegex = new RegExp(`.*${search}.*`, "i");
      filter = {
        ...filter,
        $or: [
          { firstname: searchRegex },
          { lastname: searchRegex },
          { bio: searchRegex },
        ],
      };
    }

    let sortValue = { createdAt: -1 };
    if (sort === "az") {
      sortValue = { firstname: 1 };
    }
    const author = await AuthorModel.find(filter)
      .limit(Number(limit))
      .skip(skipval)
      .sort(sortValue);

    return res.status(200).json({
      data: author,
      message: "Author",
      success: true,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "api error",
      success: false,
    });
  }
};

export const getSingleAuthor = async (req, res) => {
  try {
    const { id } = req.params;

    const author = await AuthorModel.findOne({ _id: id, isDeleted: false });

    if (!author) {
      return res.status(404).json({
        message: "author not found",
        success: false,
      });
    }

    const books = await BookModel.find({
      authorID: author._id,
      isDeleted: false,
    });

    return res.status(200).json({
      data: books,
      success: true,
      message: "Books by this author",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "api error",
      success: false,
    });
  }
};

export const updateAuthor = async (req, res) => {
  try {
    const { id } = req.params;

    const author = await AuthorModel.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!author) {
      return res.status(404).json({
        message: "author not found",
        success: false,
      });
    }
    return res.status(200).json({
      success: true,
      data: author,
      message: "Updated data",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "api error",
      success: false,
    });
  }
};

export const softDeleteAuthor = async (req, res) => {
  try {
    const { id } = req.params;

    const author = await AuthorModel.findOneAndUpdate(
      { _id: id },
      {
        isDeleted: true,
        deleteAt: new Date(),
      },
      { new: true, runValidators: true },
    );

    if (!author) {
      return res.status(404).json({
        message: "author not found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Author is deactivated",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "api error",
      success: false,
    });
  }
};

export const restoreAuthor = async (req, res) => {
  try {
    const { id } = req.params;

    const author = await AuthorModel.findByIdAndUpdate(
      id,
      {
        isDeleted: false,
        deleteAt: null,
      },
      { new: true, runValidators: true },
    );

    if (!author) {
      return res.status(404).json({
        message: "author not found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Author restored successfully!",
      data: author,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "api error",
      success: false,
    });
  }
};
