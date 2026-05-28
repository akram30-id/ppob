import { prismaClient } from "../application/database.js"
import { ResponseError } from "../error/response-error.js"

const ShowServices = async () => {

    const services = await prismaClient.$queryRaw`
        SELECT service_code, service_name, icon_path AS service_icon, service_fee AS service_tariff
        FROM services
        LIMIT 100
    `

    if (services.length < 1) {
        throw new ResponseError(404, 109, "Service tidak ditemukan.");
    }

    return services.map(service => ({
        ...service,
        service_tariff: Number(service.service_tariff)
    }));

}


export default {
    ShowServices
}