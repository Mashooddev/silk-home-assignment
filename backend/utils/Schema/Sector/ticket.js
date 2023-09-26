const Joi = require("joi");

const ticket_schema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  source: Joi.string().required(),
  status: Joi.string(),
  priority: Joi.string().required(),
});

module.exports = ticket_schema;
