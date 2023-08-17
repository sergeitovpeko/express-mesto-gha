module.exports = class DuplicateDataError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
};
