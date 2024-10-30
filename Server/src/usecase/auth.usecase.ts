import { isObjectIdOrHexString } from "mongoose";

// errors
import RequiredCredentialsNotGiven from "../errors/requiredCredentialsNotGiven.error";
import ValidationError from "../errors/validationErrorDetails.error";
import JWTTokenError from "../errors/jwtTokenError.error";

// constants
import { ErrorMessage } from "../constants/errorMesaage";
import { ErrorCode } from "../constants/customStatusErrorCode";
import { ErrorField } from "../constants/errorField";

// enums
import { StatusCodes } from "../enums/statusCode.enum";

// interfaces
import IUser, { IUserLoginCredentials, IUserRegisterationCredentials } from "../entity/IUser.entity";
import IAuthUseCase from "../interface/usecase/IAuth.usecase.interface";
import IAuthRepository from "../interface/repositories/IAuth.repository.interface";
import IHashingService from "../interface/utils/IHashingService";
import IJWTService, { IPayload } from "../interface/utils/IJWTService";

export default class AuthUseCase implements IAuthUseCase {
    private authRepository: IAuthRepository;
    private hashingService: IHashingService;
    private JWTService: IJWTService;

    constructor(authRepository: IAuthRepository, hashingService: IHashingService, JWTService: IJWTService) {
        this.authRepository = authRepository;
        this.hashingService = hashingService;
        this.JWTService = JWTService;
    }

    async handelUserRegister(data: IUserRegisterationCredentials): Promise<string | never> {
        try {
            if(!data.userName || !data.email || !data.password || !data.confirmPassword) throw new RequiredCredentialsNotGiven(ErrorMessage.REQUIRED_CREDENTIALS_NOT_GIVEN, ErrorCode.CREDENTIALS_NOT_GIVEN_OR_NOT_FOUND);

            if(!(/^[A-Za-z0-9]+@gmail\.com$/).test(data.email)) {
                throw new ValidationError({ statusCode: StatusCodes.BadRequest, errorField: ErrorField.EMAIL, message: ErrorMessage.EMAIL_NOT_VAILD, errorCode: ErrorCode.PROVIDE_VAILD_EMAIL });
            }else if (data.password !== data.confirmPassword) {
                throw new ValidationError({ statusCode: StatusCodes.BadRequest, errorField: ErrorField.PASSWORD_AND_CONFIRM_PASSWORD, message: ErrorMessage.BOTH_PASSWORD_MISS_MATCH, errorCode: ErrorCode.PASSWORD_INVAILD });
            }

            const userData: IUser | null = await this.authRepository.isUserExist(data.email, data.userName);

            if (userData && userData.userName === data.userName) {
                throw new ValidationError({ statusCode: StatusCodes.BadRequest, errorField: ErrorField.USERNAME, message: ErrorMessage.USERNAME_ALREADY_TAKEN, errorCode: ErrorCode.USERNAME_TAKEN });
            }else if(userData && userData.email === data.email) {
                throw new ValidationError({ statusCode: StatusCodes.BadRequest, errorField: ErrorField.EMAIL, message: ErrorMessage.EMAIL_ALREADY_TAKEN, errorCode: ErrorCode.EMAIL_TAKEN });
            }

            const newUserData: Omit<IUser, "_id"> = {
                userName: data.userName,
                email: data.email,
                password: await this.hashingService.hash(data.password)
            }

            const newData: IUser = await this.authRepository.createNewUser(newUserData);

            const payload: IPayload = {
                id: newData._id
            }

            const token: string = this.JWTService.sign(payload, "1d");

            return token;
        } catch (err: any) {
            throw err;
        }
    }

    async handelUserLogin(userLoginCredentials: IUserLoginCredentials): Promise<string | never> {
        try {
            if(!userLoginCredentials.email || !userLoginCredentials.password) throw new RequiredCredentialsNotGiven(ErrorMessage.REQUIRED_CREDENTIALS_NOT_GIVEN, ErrorCode.CREDENTIALS_NOT_GIVEN_OR_NOT_FOUND);

            if(!(/^[A-Za-z0-9]+@gmail\.com$/).test(userLoginCredentials.email)) {
                throw new ValidationError({ statusCode: StatusCodes.BadRequest, errorField: ErrorField.EMAIL, message: ErrorMessage.EMAIL_NOT_VAILD, errorCode: ErrorCode.PROVIDE_VAILD_EMAIL });
            }

            const userData: IUser | null = await this.authRepository.getUserDataByEmail(userLoginCredentials.email);

            if(!userData) {
                throw new ValidationError({ errorField: ErrorField.EMAIL, message: ErrorMessage.USER_NOT_FOUND, statusCode: StatusCodes.NotFound, errorCode: ErrorCode.USER_NOT_FOUND });
            }else if(!await this.hashingService.compare(userLoginCredentials.password, userData.password)) {
                throw new ValidationError({ errorField: ErrorField.PASSWORD, message: ErrorMessage.PASSWORD_INCORRECT, statusCode: StatusCodes.BadRequest, errorCode: ErrorCode.PASSWORD_INCORRECT });
            }

            const payload: IPayload = {
                id: userData._id
            }

            const token: string = this.JWTService.sign(payload, "1d");

            return token;
        } catch (err: any) {
            throw err;
        }
    }

    async isUserAuthenticated(token: string | undefined): Promise<void | never> {
        try {
            if(!token) throw new JWTTokenError({ statusCode: StatusCodes.NotFound, message: ErrorMessage.NOT_AUTHENTICATED, errorCode: ErrorCode.TOKEN_NOT_FOUND });

            try {
                const decoded: IPayload = this.JWTService.verifyToken(token);

                if(!isObjectIdOrHexString(decoded.id)) throw new JWTTokenError({ statusCode: StatusCodes.BadRequest, message: ErrorMessage.NOT_AUTHENTICATED, errorCode: ErrorCode.TOKEN_PAYLOAD_NOT_VALID });
            } catch (err: any) {
                throw new JWTTokenError({ statusCode: StatusCodes.Unauthorized, message: ErrorMessage.TOKEN_EXPIRED, errorCode: ErrorCode.TOKEN_EXPIRED_NEW_TOKEN_NEEDED });
            }
        } catch (err: any) {
            throw err;
        }
    }
}