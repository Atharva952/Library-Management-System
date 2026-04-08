import BookModel from "../models/book.model.js";
import AuthorModel from "../models/author.model.js";
import { processImageUpload, replaceImage } from "../utils/imageUpload.js";

export const createBook = async (req, res) => {
  try {
    const { title, authorID, publishedDate, publishDate, coverImage } = req.body;

    if (!title || !authorID) {
      return res.status(400).json({
        message: "Title and authorID are required",
        success: false,
      });
    }

    const author = await AuthorModel.findOne({ _id: authorID, isDeleted: false });
    if (!author) {
      return res.status(404).json({
        message: "Author not found",
        success: false,
      });
    }

    let coverImageData;
    if (req.file) {
      coverImageData = await processImageUpload(req, "coverImage");
    } else if (coverImage) {
      coverImageData = { cloudinary: { url: coverImage } };
    } else {
      coverImageData = null;
    }

    const newBook = await BookModel.create({
      title,
      coverImage: coverImageData,
      authorID,
      publishDate: publishDate || publishedDate || null,
    });

    const populatedBook = await BookModel.findById(newBook._id).populate(
      "authorID",
      "firstname lastname avatar",
    );
    return res.status(201).json({
      data: populatedBook,
      message: "Book created successfully",
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

export const getAllBooks = async (req, res) => {
  try {
    const {
      limit = 10,
      page = 1,
      search,
      sort,
      authorID,
      category,
    } = req.query;

    const skipval = Number(limit) * (Number(page) - 1);
    let filter = { isDeleted: false };

    if (search) {
      const searchRegex = new RegExp(`.*${search}.*`, "i");

      const matchingAuthors = await AuthorModel.find({
        $or: [{ firstname: searchRegex }, { lastname: searchRegex }],
      }).select("_id");

      filter = {
        ...filter,
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { authorID: { $in: matchingAuthors.map((a) => a._id) } },
        ],
      };
    }

    if (authorID) filter.authorID = authorID;
    if (category) filter.categoryId = category;

    let sortValue = { createdAt: -1 };
    if (sort === "newest") sortValue = { publishDate: -1 };
    if (sort === "oldest") sortValue = { publishDate: 1 };
    if (sort === "az") sortValue = { title: 1 };

    const book = await BookModel.find(filter)
      .populate("authorID", "firstname lastname avatar")
      .limit(Number(limit))
      .skip(skipval)
      .sort(sortValue);

    if (!book || book.length === 0) {
      return res.status(404).json({
        message: "No Book Found",
        success: false,
      });
    }
    return res.status(200).json({
      data: book,
      message: "Book",
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

export const getSingleBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await BookModel.findOne({ _id: id, isDeleted: false }).populate(
      "authorID",
      "firstname lastname bio birthDate avatar",
    );

    if (!book) {
      return res.status(401).json({
        message: "Book not found",
        success: false,
      });
    }

    return res.status(200).json({
      data: book,
      success: true,
      message: "All data",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "api error",
      success: false,
    });
  }
};

export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await BookModel.findById(id);
    if (!book) {
      return res.status(404).json({
        message: "Book not found",
        success: false,
      });
    }
    const updates = { ...req.body };
    if (updates.publishedDate && !updates.publishDate) {
      updates.publishDate = updates.publishedDate;
      delete updates.publishedDate;
    }

    if (req.file) {
      updates.coverImage = await replaceImage(
        req,
        book.coverImage,
        "coverImage",
      );
    }
    const newbook = await BookModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: updates },
      { new: true, runValidators: true },
    );

    await newbook.populate("authorID");

    return res.status(200).json({
      success: true,
      data: newbook,
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

export const softDeleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await BookModel.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        deleteAt: new Date(),
      },
      { new: true, runValidators: true },
    );

    if (!book) {
      return res.status(401).json({
        message: "book not found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Book deactivated. It will be permanently deleted in 30 days.",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "api error",
      success: false,
    });
  }
};

export const restoreBook = async (req, res) => {
  try {
    const { id } = req.body;

    const book = await BookModel.findOneAndUpdate(
      { _id: id, isDeleted: true },
      {
        isDeleted: false,
        deletedAt: null,
      },
      { new: true },
    );

    if (!book) {
      return res.status(401).json({
        message: "book not found",
        success: false,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Book restored successfully!",
      data: book,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "api error",
      success: false,
    });
  }
};
