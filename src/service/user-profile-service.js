import { prismaClient } from "../application/database.js"
import { ResponseError } from "../error/response-error.js"
import { updateProileValidation } from "../validation/profile-validation.js";
import { validate } from "../validation/validation.js";

const GetUserProfile = async (email) => {

    const user = await prismaClient.$queryRaw`
        SELECT a.email, b.first_name, b.last_name, b.image_path
        FROM users AS a
        JOIN profiles AS b ON a.id=b.user_id
        WHERE a.email = ${email}
        LIMIT 1
    `

    if (user.length < 1) {
        throw new ResponseError(404, 109, "User tidak ditemukan.");
    }

    return {
        email: user[0].email,
        first_name: user[0].first_name,
        last_name: user[0].last_name,
        profile_image: user[0].image_path
    }

}

const UpdateProfile = async (request, email) => {

    const profile = validate(updateProileValidation, request);

    const userProfile = await prismaClient.$queryRaw`
        SELECT b.first_name, b.last_name, a.id, b.image_path
        FROM users AS a
        JOIN profiles AS b ON a.id=b.user_id
        WHERE a.email = ${email}
        LIMIT 1
    `

    if (userProfile.length < 1) {
        throw new ResponseError(404, 109, "User tidak ditemukan.");
    }

    const userdId = userProfile[0].id;

    let firstNameUpdate = userProfile[0].first_name;

    let lastNameUpdate = userProfile[0].last_name;

    if (firstNameUpdate != profile.first_name) {
        firstNameUpdate = profile.first_name
    }

    if (lastNameUpdate != profile.last_name) {
        lastNameUpdate = profile.last_name
    }

    const updateAffectedRows = await prismaClient.$executeRaw`
        UPDATE profiles 
        SET first_name = ${firstNameUpdate},
            last_name = ${lastNameUpdate}
        WHERE user_id = ${userdId}
    `

    if (updateAffectedRows < 1) {
        throw new ResponseError(500, 110, "Terjadi kesalahan saat update profile");
    }

    return {
        "email": email,
        "first_name": firstNameUpdate,
        "last_name": lastNameUpdate,
        "profile_image": userProfile[0].image_path
    };

}


const UpdateAvatar = async (filename, userId) => {

    const imagePath = `${process.env.APP_URL}/public/images/${filename}`;

    const updateImageAffRows = await prismaClient.$executeRaw`
        UPDATE profiles 
        SET image_path = ${imagePath}
        WHERE user_id = ${userId}
    `

    if (updateImageAffRows < 1) {
        throw new ResponseError(500, 109, "Terjadi kesalahan saat update foto profile");
    }

    const profiles = await prismaClient.$queryRaw`
        SELECT a.email, b.first_name, b.last_name, b.image_path
        FROM users AS a
        JOIN profiles AS b ON a.id=b.user_id
        WHERE a.id = ${userId}
        LIMIT 1
    `

    return {
        "email": profiles[0].email,
        "first_name": profiles[0].first_name,
        "last_name": profiles[0].last_name,
        "profile_image": profiles[0].image_path,
    }

}

export default {
    GetUserProfile,
    UpdateProfile,
    UpdateAvatar
}