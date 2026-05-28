import multer from "multer";
import path from "path"
import { fileURLToPath } from 'url'
import { ResponseError } from "../error/response-error.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../public/images'));
    },

    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + file.originalname;

        cb(null, uniqueName);
    },
});

export const upload = multer({

    storage: storage,

    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'image/jpeg',
            'image/png'
        ];

        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new ResponseError(400, 102, "Format Image tidak sesuai"));
        }

        cb(null, true);
    }
})