import { prismaClient } from "../application/database.js"
import { ResponseError } from "../error/response-error.js"
import { TopupBalanceValidation } from "../validation/balance-validation.js";
import { validate } from "../validation/validation.js";

const GetUserBalance = async (userId) => {

    const [userBalance] = await prismaClient.$queryRaw`
        SELECT amount
        FROM user_balances
        WHERE user_id = ${userId}
    `

    let amount = !userBalance ? 0 : Number(userBalance.amount);

    return amount;

}


const TopUpBalance = async (request, userId) => {

    const topup = validate(TopupBalanceValidation, request);

    let currentBalance = 0;

    const [balance] = await prismaClient.$queryRaw`
        SELECT amount FROM user_balances
        WHERE user_id = ${userId}
        LIMIT 1
    `

    if (balance) {
        currentBalance = Number(balance.amount);
    }

    const finalAmount = currentBalance + topup.top_up_amount;

    try {


        const result = await prismaClient.$transaction(async (tx) => {
            await tx.$executeRaw`
                UPDATE user_balances 
                SET amount = ${finalAmount},
                    updated_at = NOW()
                WHERE user_id = ${userId}
            `

            const transactionCode = "TRX" + Math.floor(Math.random() * 999999999);

            await tx.$executeRaw`
                INSERT INTO transaction_histories (user_id, transaction_code, service_code, transaction_type_code, amount, status)
                VALUES (${userId}, ${transactionCode}, ${"TOPUP"}, ${"TOPUP"}, ${topup.top_up_amount}, ${"SUCCESS"})
            `
        });

    } catch (error) {
        throw new ResponseError(500, 109, "Terjadi kesalahan saat menyimpan data topup");
    }

    return finalAmount;

}

export default {
    GetUserBalance,
    TopUpBalance
}