/* eslint-disable indent */
/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
const { nanoid } = require('nanoid');
const bookData = require('./books');

const addBooks = (req, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading } = req.payload;

  if (name === undefined) {
    const response = h
    .response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    })
    .code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h
    .response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    })
    .code(400);
    return response;
  }

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = { name, year, author, summary, publisher, pageCount, readPage, reading, id, finished, insertedAt, updatedAt,
  };

  bookData.push(newBook);

  const isSuccess = bookData.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    const response = h
      .response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      })
      .code(201);
    return response;
  }

  const response = h
    .response({
      status: 'fail',
      message: 'Buku gagal ditambahkan',
    })
    .code(500);
  return response;
};

const getBooks = (request, h) => {
  const { name, reading, finished } = request.query;

  let filteringBook = bookData;

  if (name) {
    filteringBook = bookData.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  } if (reading) {
    filteringBook = bookData.filter((book) => book.reading === (reading === '1'));
  } if (finished) {
    filteringBook = bookData.filter((book) => book.finished === (finished === '1'));
  }

  const response = h
  .response({
    status: 'success',
    data: {
      books: filteringBook.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  })
  .code(200);
  return response;
};

const getDetailBooks = (req, h) => {
  const { bookId } = req.params;

  const book = bookData.filter((n) => n.id === bookId)[0];
  if (book) {
    const response = h
      .response({
        status: 'success',
        data: {
          book,
        },
      })
      .code(200);
    return response;
  }

  const response = h
    .response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    })
    .code(404);
  return response;
};

const editBooksById = (req, h) => {
  const { bookId } = req.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.payload;
  const updatedAt = new Date().toISOString();
  const index = bookData.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    if (name === undefined) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }

    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }

    const finished = (pageCount === readPage);
    bookData[index].name = name;
    bookData[index].year = year;
    bookData[index].author = author;
    bookData[index].summary = summary;
    bookData[index].publisher = publisher;
    bookData[index].pageCount = pageCount;
    bookData[index].readPage = readPage;
    bookData[index].finished = finished;
    bookData[index].reading = reading;
    bookData[index].updatedAt = updatedAt;

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBooks = (req, h) => {
  const { bookId } = req.params;

  const index = bookData.findIndex((note) => note.id === bookId);

  if (index !== -1) {
    bookData.splice(index, 1);
    const response = h
      .response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      })
      .code(200);
    return response;
  }

  const response = h
    .response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    })
    .code(404);
  return response;
};

module.exports = { addBooks, getBooks, getDetailBooks, editBooksById, deleteBooks };
