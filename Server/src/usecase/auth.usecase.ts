// errors
import RequiredCredentialsNotGiven from "../errors/requiredCredentialsNotGiven.error";
import ValidationError from "../errors/validationErrorDetails.error";

// constants
import { ErrorMessage } from "../constants/errorMesaage";
import { ErrorCode } from "../constants/customStatusErrorCode";
import { ErrorField } from "../constants/errorField";

// enums
import { StatusCodes } from "../enums/statusCode.enum";

// interfaces
import IUser, { IUserRegisterationCredentials } from "../entity/user.entity";
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

            if(userData && userData.email === data.email) {
                throw new ValidationError({ statusCode: StatusCodes.BadRequest, errorField: ErrorField.EMAIL, message: ErrorMessage.EMAIL_ALREADY_TAKEN, errorCode: ErrorCode.EMAIL_TAKEN });
            }else if (userData && userData.userName === data.userName) {
                throw new ValidationError({ statusCode: StatusCodes.BadRequest, errorField: ErrorField.USERNAME, message: ErrorMessage.USERNAME_ALREADY_TAKEN, errorCode: ErrorCode.USERNAME_TAKEN });
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
}