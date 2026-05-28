import Joi from "joi"

const TopupBalanceValidation = Joi.object({
    top_up_amount: Joi.number().integer().min(0).required()
});


export {
    TopupBalanceValidation
}