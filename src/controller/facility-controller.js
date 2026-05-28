import facilityService from "../service/facility-service.js"

const showServices = async (req, res, next) => {

    try {
        const result = await facilityService.ShowServices();

        res.status(200).json({
            "status": 0,
            "message": "Sukses",
            "data": result
        });
    } catch (e) {
        next(e)
    }

}


export default {
    showServices
}