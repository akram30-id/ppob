import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { TransactionValidation, TransactionHitoryValidation } from "../validation/transaction-validation.js"
import { validate } from "../validation/validation.js"

const HandleTransaction = async (request, userId) => {

    const transaction = validate(TransactionValidation, request);

    const serviceCode = transaction.service_code;

    const [service] = await prismaClient.$queryRaw`
        SELECT service_code, service_name, service_fee FROM services
        WHERE service_code = ${serviceCode}
        LIMIT 1
    `

    if (!service) {
        throw new ResponseError(404, 102, "Service ataus Layanan tidak ditemukan");
    }

    const [balance] = await prismaClient.$queryRaw`
        SELECT amount, is_still_process FROM user_balances
        WHERE user_id = ${userId}
        LIMIT 1
    `

    if (!balance) {
        throw new ResponseError(400, 102, "Saldo tidak cukup");
    }

    const balanceAmount = Number(balance.amount);

    const serviceFee = Number(service.service_fee);

    if (balanceAmount < serviceFee) {
        throw new ResponseError(400, 102, "Saldo tidak cukup");
    }

    const transactionCode = "INV" + Math.floor(Math.random() * 999999999);

    const finalBalance = balanceAmount - serviceFee;

    if (balance.is_still_process == 1) {
        throw new ResponseError(400, 110, "Ada transaksi yang sedang diproses, harap coba lagi nanti.");
    }

    try {
        const result = await prismaClient.$transaction(async (tx) => {

            // LOCK QUERY PROCESS
            // This is purposed for resolving race condition issue
            await tx.$executeRaw`
                UPDATE user_balances SET is_still_process = 1
                WHERE user_id = ${userId}
            `

            // SAVE TRANSACTION HISTORY
            await tx.$executeRaw`
                INSERT INTO transaction_histories (user_id, transaction_code, service_code, transaction_type_code, amount, status)
                VALUES (${userId}, ${transactionCode}, ${service.service_code}, ${"PAYMENT"}, ${serviceFee}, ${"SUCCESS"})
            `

            // UPDATE ACCOUNT BALANCE
            await tx.$executeRaw`
                UPDATE user_balances 
                SET amount = ${finalBalance},
                    updated_at = NOW()
                WHERE user_id = ${userId}
            `

            // RELEASE LOCK QUERY PROCESS
            await tx.$executeRaw`
                UPDATE user_balances SET is_still_process = 0
                WHERE user_id = ${userId}
            `
        })
    } catch (e) {
        throw new ResponseError(500, 109, "Terjadi kesalahan saat menyimpan data transaksi");
    }

    const now = new Date();

    const utcPlus7 = new Date(now.getTime() + (7 * 60 * 60 * 1000));

    return {
        "invoice_number": transactionCode,
        "service_code": serviceCode,
        "service_name": service.service_name,
        "transaction_type": "PAYMENT",
        "total_amount": Number(service.service_fee),
        "created_on": utcPlus7.toISOString()
    }

}


const ShowTransactionHistories = async (request, userId) => {

    const history = validate(TransactionHitoryValidation, request);

    let limit  = Number(request.limit);

    let offset = Number(request.offset);

    if (!limit) {
       limit = 1000 
    }

    if (!offset) {
        offset = 0;
    }

    const showHistories = await prismaClient.$queryRaw`
        SELECT a.transaction_code, a.service_code, a.amount AS total_amount, a.transaction_type_code, a.created_at, b.description AS transaction_type, c.service_name
        FROM transaction_histories AS a
        JOIN transaction_types AS b ON a.transaction_type_code=b.transaction_type_code
        LEFT JOIN services AS c ON a.service_code=c.service_code
        WHERE a.user_id = ${userId}
        ORDER BY a.id DESC
        LIMIT ${limit} 
        OFFSET ${offset}
    `

    if (showHistories.length < 0) {
        throw new ResponseError(404, 109, "Histori transaksi tidak ditemukan");
    }

    let data = [];
    showHistories.map(histories => {

        if (histories.transaction_type_code == "TOPUP") {
            histories.service_name = histories.transaction_type;
        }

        data.push({
            "invoice_number": histories.transaction_code,
            "transaction_type": histories.transaction_type_code,
            "description": histories.service_name,
            "total_amount": Number(histories.total_amount),
            "created_on": histories.created_at
        });
    });

    return {
        "limit": limit,
        "offset": offset,
        "records": data
    };

}

export default {
    HandleTransaction,
    ShowTransactionHistories
}