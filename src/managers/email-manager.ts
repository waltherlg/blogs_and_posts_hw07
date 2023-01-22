import {emailAdapter} from "../adapters/email-adapter";

export const emailManager = {
    async sendEmailRecoveryMessage(user: any){
        await emailAdapter.sendEmail(user.email, "password recovery", "<div>${user.recoveryCode}message</div>div>")
    },

    async sendEmailConfirmationMessage(user: any){
        await emailAdapter.sendEmail(user.email, "confirmation code", user.confirmationCode)
    },

    async resendEmailConfirmationMessage(refreshConfirmationData: any){
        await emailAdapter.sendEmail(refreshConfirmationData.email, "resending confirmation code", refreshConfirmationData.confirmationCode)
    }
}