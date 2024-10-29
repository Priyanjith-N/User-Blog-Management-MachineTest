import { NextFunction, Request, Response } from "express";

// enms
import { StatusCodes } from "../../enums/statusCode.enum";

// constants
import { ResponseMessage } from "../../constants/sucessMessage";

// interfaces
import IAuthController from "../../interface/controllers/IAuth.controller.interface";
import { IUserRegisterationCredentials } from "../../entity/user.entity";
import IAuthUseCase from "../../interface/usecase/IAuth.usecase.interface";

export default class AuthController implements IAuthController {
    private authUseCase: IAuthUseCase;

    constructor(authUseCase: IAuthUseCase) {
        this.authUseCase = authUseCase;
    }

    async registerUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userRegisterationCredentials: IUserRegisterationCredentials = {
                userName: req.body.userName,
                email: req.body.email,
                password: req.body.password,
                confirmPassword: req.body.confirmPassword
            }

            const token: string = await this.authUseCase.handelUserRegister(userRegisterationCredentials);

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 1 * 24 * 60 * 60 * 1000
            });

            res.status(StatusCodes.Success).json({
                message: ResponseMessage.REGISTERTATION_SUCCESS
            });
        } catch (err: any) {
            next(err);
        }
    }
}