import { prismaClient } from "../application/database.js";
import { registerUserValidation } from "../validation/user-validation.js"
import { validate } from "../validation/validation.js"
import { ResponseError } from "../error/response-error.js";
import bcrypt from "bcrypt";

const RegisterUser = async (request) => {

    const user = validate(registerUserValidation, request);

    // check is user exist
    const isUserExist = await prismaClient.$queryRaw`
        SELECT id FROM users
        WHERE email = ${user.email}
        LIMIT 1
    `

    if (isUserExist.length > 0) {
        throw new ResponseError(400, "Email ini sudah terdaftar.");
    }

    const email = user.email;
    const password = await bcrypt.hash(user.password, 10);

    try {
        const save = await prismaClient.$transaction(async (tx) => {

            // SAVE USER DATA
            await tx.$executeRaw`
                INSERT INTO users (email, password) 
                VALUES (${email}, ${password})
            `
            // END OF SAVE USER DATA


            const lastId = await tx.$queryRaw`
                SELECT LAST_INSERT_ID() as id
            `

            const userId = lastId[0].id;

            const profileImgPath = `${process.env.APP_URL}/public/images/profile.jpg`;

            // SAVE USER PROFILE
            await tx.$queryRaw`
                INSERT INTO profiles (user_id, first_name, last_name, is_active, image_path)
                VALUES (${userId}, ${user.first_name}, ${user.last_name}, 1, ${profileImgPath})
            `
            // END OF SAVE USER PROFILE

            
            // SET DEFAULT USER BALANCE
            await tx.$executeRaw`
                INSERT INTO user_balances (user_id, amount, is_still_process)
                VALUES (${userId}, 0, 0)
            `
            // END OF SET DEFAULT USER BALANCE

            return {
                success: true
            };

        })
    } catch (error) {
        throw new ResponseError(500, 100, save.message || "Terjadi kesalahan saat menyimpan data.");
    }

}

export default {
    RegisterUser
}