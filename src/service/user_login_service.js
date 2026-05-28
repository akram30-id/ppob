import { prismaClient } from "../application/database.js";
import { generateToken } from "../application/jwt.js";
import { ResponseError } from "../error/response-error.js";
import { loginValidation } from "../validation/user-validation.js"
import { validate } from "../validation/validation.js"
import bcrypt from "bcrypt";

const loginService = async (request) => {

    const user = validate(loginValidation, request);

    const email = user.email;

    const getUser = await prismaClient.$queryRaw`
        SELECT id, password FROM users
        WHERE email = ${email}
        LIMIT 1
    `

    if (getUser.length < 1) {
        throw new ResponseError(404, 101, "User tidak ditemukan.");
    }

    const isPasswordValid = await bcrypt.compare(user.password, getUser[0].password);
    if (!isPasswordValid) {
        throw new ResponseError(401, 103, "Username atau password salah");
    }

    // GENERATE JWT TOKEN
    const token = generateToken({
        id: getUser[0].id,
        email: email
    });
    // END OF GENERATE JWT TOKEN

    return token;

}

export default {
    loginService
}