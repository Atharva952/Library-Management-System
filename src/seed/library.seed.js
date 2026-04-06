import AuthorModel from "../models/author.model.js";
import BookModel from "../models/book.model.js";

const authorsSeed = [
  {
    firstname: "George",
    lastname: "Orwell",
    bio: "English novelist, essayist, and critic.",
    birthDate: "1903-06-25",
  },
  {
    firstname: "Jane",
    lastname: "Austen",
    bio: "English novelist known for social commentary.",
    birthDate: "1775-12-16",
  },
  {
    firstname: "Paulo",
    lastname: "Coelho",
    bio: "Brazilian lyricist and novelist.",
    birthDate: "1947-08-24",
  },
];

const booksSeed = [
  {
    title: "1984",
    authorKey: "George-Orwell",
    publishDate: "1949-06-08",
  },
  {
    title: "Animal Farm",
    authorKey: "George-Orwell",
    publishDate: "1945-08-17",
  },
  {
    title: "Pride and Prejudice",
    authorKey: "Jane-Austen",
    publishDate: "1813-01-28",
  },
  {
    title: "The Alchemist",
    authorKey: "Paulo-Coelho",
    publishDate: "1988-01-01",
  },
];

export const seedLibraryData = async () => {
  const authorCount = await AuthorModel.countDocuments();
  const bookCount = await BookModel.countDocuments();

  if (authorCount > 0 || bookCount > 0) {
    return;
  }

  const createdAuthors = await AuthorModel.insertMany(authorsSeed);

  const authorMap = createdAuthors.reduce((acc, author) => {
    const key = `${author.firstname}-${author.lastname}`;
    acc[key] = author._id;
    return acc;
  }, {});

  const bookPayload = booksSeed
    .map((book) => ({
      title: book.title,
      authorID: authorMap[book.authorKey],
      publishDate: book.publishDate,
    }))
    .filter((book) => Boolean(book.authorID));

  if (bookPayload.length > 0) {
    await BookModel.insertMany(bookPayload);
  }

  console.log("Seeded default authors and books");
};
