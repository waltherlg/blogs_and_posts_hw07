import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-service";
import {RequestWithBody} from "../models/types";
import {userAuthModel} from "../models/users-models";
import {jwtService} from "../application/jwt-service";
import {authMiddleware} from "../middlewares/basic-auth.middleware";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware/input-validation-middleware";

export const authRouter = Router({})

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