import {emailAdapter} from "../adapters/email-adapter";

export const emailManager = {
    async sendEmailRecoveryMessage(user: any){
        await emailAdapter.sendEmail(user.email, "password recovery", "")
    },

    async sendEmailConfirmationMessage(user: any){
        const confirmationCode = "https://some-front.com/confirm-registration?code=" + user.confirmationCode
        await emailAdapter.sendEmail(user.email, "confirmation code", confirmationCode)
    },

    async resendEmailConfirmationMessage(refreshConfirmationData: any){
        const confirmationCode = "https://some-front.com/confirm-registration?code=" + refreshConfirmationData.confirmationCode
        await emailAdapter.sendEmail(refreshConfirmationData.email, "resending confirmation code", confirmationCode)
    }
}

// <h1>Thank for your registration</h1>
// <p>To finish registration please follow the link below:
//     <a href='https://somesite.com/confirm-email?code=your_confirmation_code'>complete registration</a>
// </p>
