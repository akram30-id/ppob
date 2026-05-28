import Joi from "joi"

const TransactionValidation = Joi.object({
    service_code: Joi.string().max(50).required()
});


const TransactionHitoryValidation = Joi.object({
    limit: Joi.optional(),
    offset: Joi.optional(),
})

export { 
    TransactionValidation,
    TransactionHitoryValidation
}