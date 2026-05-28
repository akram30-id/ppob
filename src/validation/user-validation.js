import Joi from "joi";

const registerUserValidation = Joi.object({
    email: Joi.string().max(50).email().required(),
    first_name: Joi.string().max(100),
    last_name: Joi.string().max(100),
    password: Joi.string().max(16).required()
});

const loginValidation = Joi.object({
    email: Joi.string().max(50).email().required(),
    password: Joi.string().max(16).required()
});

export {
    registerUserValidation,
    loginValidation
}