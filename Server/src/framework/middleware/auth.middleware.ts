import { Response, NextFunction } from "express";
import { isObjectIdOrHexString } from "mongoose";

// interfaces
import IAuthMiddleware from "../../interface/middlewares/authMiddleware.interface";
import IJWTService, { IPayload } from "../../interface/utils/IJWTService";
import IAuthRequest from "../../interface/common/IAuthRequest.interface";

// errors
import JWTTokenError from "../../errors/jwtTokenError.error";

// enums
import { StatusCodes } from "../../enums/statusCode.enum";

// constants
import { ErrorMessage } from "../../constants/errorMesaage";
import { ErrorCode } from "../../constants/customStatusErrorCode";


export default class AuthMiddleware implements IAuthMiddleware {
    private jwtService: IJWTService;

    constructor(jwtService: IJWTService) {
        this.jwtService = jwtService;
    }

    async isAuthenticate(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { token } = req.cookies;
            

            if(!token) throw new JWTTokenError({ statusCode: StatusCodes.NotFound, message: ErrorMessage.NOT_AUTHENTICATED, errorCode: ErrorCode.TOKEN_NOT_FOUND });

            try {
                const decoded: IPayload = this.jwtService.verifyToken(token);

                if(!isObjectIdOrHexString(decoded.id)) throw new JWTTokenError({ statusCode: StatusCodes.BadRequest, message: ErrorMessage.NOT_AUTHENTICATED, errorCode: ErrorCode.TOKEN_PAYLOAD_NOT_VALID });
                
                req.id = decoded.id;
            } catch (err: any) {
                throw new JWTTokenError({ statusCode: StatusCodes.Unauthorized, message: ErrorMessage.TOKEN_EXPIRED, errorCode: ErrorCode.TOKEN_EXPIRED_NEW_TOKEN_NEEDED });
            }

            next(); // user is authenticated procced with the actual request
        } catch (err: any) {
            next(err);
        }
    }
}