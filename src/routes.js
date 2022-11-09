/* eslint-disable object-curly-newline */
const { addBooks, getBooks, getDetailBooks, editBooksById, deleteBooks } = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBooks,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getBooks,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getDetailBooks,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBooksById,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBooks,
  },
];

module.exports = routes;
