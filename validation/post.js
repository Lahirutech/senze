const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validatePostInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : '';

  if (!Validator.isLength(data.content, { min: 10, max: 300 })) {
    errors.content = 'content must be between 10 and 300 characters';
  }

  if (Validator.isEmpty(data.title)) {
    errors.title = 'Text field is required';
  }
  if (Validator.isEmpty(data.content)) {
    errors.content = 'content field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
