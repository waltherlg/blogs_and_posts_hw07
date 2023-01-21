import {ObjectId} from "mongodb";
import {userType, userTypeOutput} from "../models/types";
import {usersRepository} from "../repositories/users-repository";
import * as bcrypt from 'bcrypt'
import {v4 as uuid4} from 'uuid'
import add from 'date-fns/add'
import {emailManager} from "../managers/email-manager";
import {usersService} from "./users-service";

export const authService = {

    async registerUser(login: string, password: string, email: string): Promise<userTypeOutput | null> {

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)

        const newUser: userType = {
            "_id": new ObjectId(),
            "login": login,
            passwordHash,
            passwordSalt,
            "email": email,
            "createdAt": new Date().toISOString(),
            "confirmationCode": uuid4(),
            "expirationDate": add(new Date(),{
                hours: 1
                //minutes: 3
            }),
            "isConfirmed": false
        }
        const createdUser = await usersRepository.createUser(newUser)
        try {
            await emailManager.sendEmailConfirmationMessage(newUser)
        }
        catch (e) {
            await usersService.deleteUser(newUser._id.toString())
            return null
        }
        return createdUser


    },

    async confirmEmail(code: string){
        let user = await usersRepository.getUserByConfirmationCode(code)
        if (!user) return false
        if (user.expirationDate > new Date()){
            let result = await usersRepository.updateConfirmation(user._id)
            return result
        }
        return false

    },
    async _generateHash(password: string, salt: string){
        const hash = await bcrypt.hash(password, salt)
        return hash
    },
}

