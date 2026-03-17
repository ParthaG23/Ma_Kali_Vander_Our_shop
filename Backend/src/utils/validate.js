const Joi = require('joi');

const registerSchema = Joi.object({
  name:     Joi.string().trim().min(2).max(60).required(),
  email:    Joi.string().email().lowercase().required(),
  password: Joi.string().min(6).max(128).required(),
  role:     Joi.string().valid('user', 'admin').default('user'),
});

const loginSchema = Joi.object({
  email:    Joi.string().email().lowercase().required(),
  password: Joi.string().min(1).required(),
});

const khataSchema = Joi.object({
  customerName: Joi.string().trim().min(1).max(100).required(),
  phone:        Joi.string().trim().max(20).allow('').default(''),
  address:      Joi.string().trim().max(200).allow('').default(''),
});

const transactionSchema = Joi.object({
  type:   Joi.string().valid('debit', 'credit').required(),
  amount: Joi.number().positive().required(),
  note:   Joi.string().trim().max(200).allow('').default(''),
  date:   Joi.date().default(Date.now),
});

const productSchema = Joi.object({
  name:     Joi.string().trim().min(1).max(100).required(),
  category: Joi.string().trim().max(60).default('General'),
  price:    Joi.number().min(0).required(),
  stock:    Joi.number().integer().min(0).default(0),
  unit:     Joi.string().trim().max(20).default('kg'),
});

/**
 * Express middleware factory — validates req.body against a Joi schema.
 */
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    const messages = error.details.map((d) => d.message).join('; ');
    return res.status(400).json({ success: false, message: messages });
  }
  req.body = value;
  next();
};

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  khataSchema,
  transactionSchema,
  productSchema,
};
