import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-service";
import {RequestWithBody} from "../models/types";
import {userAuthModel, userInputModel} from "../models/users-models";
import {jwtService} from "../application/jwt-service";
import {authMiddleware} from "../middlewares/basic-auth.middleware";
import {
    emailResendingValidation,
    emailValidation,
    inputValidationMiddleware,
    loginValidation, passwordValidation
} from "../middlewares/input-validation-middleware/input-validation-middleware";
import {authService} from "../domain/auth-service";


export const authRouter = Router({})

authRouter.post('/registration',
    loginValidation,
    passwordValidation,
    emailValidation,
    inputValidationMiddleware,
    async (req: RequestWithBody<userInputModel>, res: Response) => {
        const newUser = await authService.registerUser(
            req.body.login,
            req.body.password,
            req.body.email)
        if (newUser) {
            res.status(204).send(newUser)
        }
        else {
            res.sendStatus(400)
        }
    })

authRouter.post('/registration-email-resending',
    emailResendingValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const result = await authService.registrationEmailResending(req.body.email)
        if (result) {
            res.sendStatus(204)
        }
        else res.sendStatus(400)
    })

authRouter.post('/registration-confirmation',

    async (req: Request, res: Response) => {
    const result = await authService.confirmEmail(req.body.code)
        if (result) {
            res.sendStatus(204)
        }
        else res.sendStatus(400)
    })

authRouter.post('/login',
    async (req: RequestWithBody<userAuthModel>, res: Response) => {
    const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if(user){
            const accessToken = await jwtService.createJWT(user)
            res.status(200).send({accessToken})
        }
        else res.sendStatus(401)
    })

authRouter.get('/me',
    authMiddleware,
    async (req: Request, res: Response) => {
    const currentUserInfo = {
        "email": req.user!.email,
        "login": req.user!.login,
        "userId": req.user!._id
    }
        res.status(200).send(currentUserInfo)

    })