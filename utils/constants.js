const OK_STATUS = 200;
const CREATED_STATUS = 201;
const BAD_REQUEST_STATUS = 400;
const NOT_FOUND_PAGE_STATUS = 404;
const SERVER_ERROR_STATUS = 500;

const { PORT = 3000 } = process.env;

const regexUrl = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

const SECRET_KEY_DEV = '97875f93d46cc42dc2b1e9c33fe9b053cc0e6724df977c77d712adc104085f22';

module.exports = {
  SECRET_KEY_DEV,
  regexUrl,
  PORT,
  OK_STATUS,
  CREATED_STATUS,
  BAD_REQUEST_STATUS,
  NOT_FOUND_PAGE_STATUS,
  SERVER_ERROR_STATUS,
};
