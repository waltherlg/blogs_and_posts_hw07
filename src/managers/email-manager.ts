import {emailAdapter} from "../adapters/email-adapter";

export const emailManager = {
    async sendEmailRecoveryMessage(user: any){
        await emailAdapter.sendEmail(user.email, "password recovery", "<div>${user.recoveryCode}message</div>div>")
    },

    async sendEmailConfirmationMessage(user: any){
        await emailAdapter.sendEmail(user.email, "confirmation", "<div>${user.confirmationCode}message</div>div>")
    }
}