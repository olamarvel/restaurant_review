const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRestaurant(data) {
  let errors = {};
  data.name = !isEmpty(data.name) ? data.name : "";
  data.image = !isEmpty(data.image) ? data.image : "";
  data.text = !isEmpty(data.text) ? data.text : "";

  if (Validator.isEmpty(data.text)) {
    errors.text = "Text field is required";
  }
  
  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }
  
  if (Validator.isEmpty(data.image)) {
    errors.image = "Image field is required";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
