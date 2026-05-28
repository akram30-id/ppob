import Joi from "joi"

const updateProileValidation = Joi.object({
    first_name: Joi.string().required().max(100),
    last_name: Joi.string().required().max(100)
});


export {
    updateProileValidation
}