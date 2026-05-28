import { prismaClient } from "../application/database.js"
import { ResponseError } from "../error/response-error.js"

const ShowBanner = async () => {

    const banners = await prismaClient.$queryRaw`
        SELECT banner_name, image_path AS banner_image, description
        FROM banners
        LIMIT 100
    `

    if (banners.length < 1) {
        throw new ResponseError(404, 109, "Banner tidak ditemukan.");
    }

    return banners;
    
}


export default {
    ShowBanner
}