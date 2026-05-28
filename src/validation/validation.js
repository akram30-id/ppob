import { ResponseError } from "../error/response-error.js";

const validate = (schema, request) => {
    const result = schema.validate(request, {
        abortEarly: false,
        allowUnknown: false,
        convert: false
    });

    if (result.error) {

        const errors = result.error.details;

        // invalid email format
        for (const error of errors) {
            if (error.type === 'string.email') {
                throw new ResponseError(400, 102, `Parameter ${error.path[0]} tidak sesuai format.`);
            }

            // required field
            if (error.type === 'any.required') {
                throw new ResponseError(400, 104, `Parameter ${error.path[0]} wajib diisi.`);
            }

            if (error.type === 'string.empty') {
                throw new ResponseError(400, 104, `Parameter ${error.path[0]} tidak boleh kosong.`);
            }

            if (error.type === 'string.max') {
                throw new ResponseError(400, 104, `Parameter ${error.path[0]} melebihi batas maksimum.`);
            }

            if (error.type === 'number.base' || error.type === 'number.min') {
                throw new ResponseError(400, 104, `Parameter ${error.path[0]} hanya boleh angka dan tidak boleh lebih kecil dari 0`);
            }
        }

        throw new ResponseError(400, 105, result.error.message)
    } else {
        return result.value
    }
}

export {
    validate
}