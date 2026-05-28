import balanceService from "../service/balance-service.js";
import transactionService from "../service/transaction-service.js";

const topupAccount = async (req, res, next) => {

    try {
        const userId = req.user.id;

        const result = await balanceService.TopUpBalance(req.body, userId);

        res.status(200).json({
            "status": 0,
            "message": "Top Up Balance berhasil",
            "data": {
                "balance": result
            }
        })
    } catch (e) {
        next(e);
    }

}


const transactionAccount = async (req, res, next) => {

    try {
        const userId = req.user.id;

        const result = await transactionService.HandleTransaction(req.body, userId);

        res.status(200).json({
            "status": 0,
            "message": "Transaksi berhasil",
            "data": result
        })
    } catch (e) {
        next(e)
    }

}


const transactionHistories = async (req, res, next) => {

    try {
        const userId = req.user.id;

        const request = req.query;

        const result = await transactionService.ShowTransactionHistories(request, userId);

        res.status(200).json({
            "status": 0,
            "message": "Get History Berhasil",
            "data": result
        });
    } catch (e) {
        next(e)
    }

}

export default {
    topupAccount,
    transactionAccount,
    transactionHistories
}