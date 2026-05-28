import balanceService from "../service/balance-service.js";
import userProfileService from "../service/user-profile-service.js";
import user_login_service from "../service/user_login_service.js";
import user_register_service from "../service/user_register_service.js";
import register_service from "../service/user_register_service.js"

const register = async (req, res, next) => {
    try {
        const result = await user_register_service.RegisterUser(req.body);

        res.status(200).json({
            "status": 0,
            "message": "Registrasi berhasil silahkan login",
            "data": null
        })
    } catch (e) {
        next(e)
    }
}


const login = async (req, res, next) => {
    try {
        const token = await user_login_service.loginService(req.body);

        res.status(200).json({
            "status": 0,
            "message": "Login Sukses",
            "data": {
                "token": token
            }
        })
    } catch (e) {
        next(e);
    }
}

const getProfile = async (req, res, next) => {
    try {
        const email = req.user.email;

        const result = await userProfileService.GetUserProfile(email);

        res.status(200).json({
            "status": 0,
            "message": "Sukses",
            "data": result
        });
    } catch (e) {
        next(e)
    }
}


const updateProfile = async (req, res, next) => {
    try {
        const email = req.user.email;

        const result = await userProfileService.UpdateProfile(req.body, email);

        res.status(200).json({
            "status": 0,
            "message": "Update Pofile berhasil",
            "data": result
        })
    } catch (e) {
        next(e)
    }
}

const updateImage = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const filename = req.file.filename;

        const result = await userProfileService.UpdateAvatar(filename, userId);

        res.status(200).json({
            "status": 0,
            "message": "Update Profile Image berhasil",
            "data": result
        });
    } catch (e) {
        next(e)
    }
}

const userBalance = async (req, res, next) => {

    try {
        const userId = req.user.id;

        const result = await balanceService.GetUserBalance(userId);

        res.status(200).json({
            "status": 0,
            "message": "Get Balance Berhasil",
            "data": {
                "balance": result
            }
        })
    } catch (e) {
        next(e)
    }

}

export default {
    register,
    login,
    getProfile,
    updateProfile,
    updateImage,
    userBalance
}