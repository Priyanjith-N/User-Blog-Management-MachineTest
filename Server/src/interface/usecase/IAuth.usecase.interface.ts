// interfaces
import { IUserLoginCredentials, IUserRegisterationCredentials } from "../../entity/user.entity";

export default interface IAuthUseCase {
    handelUserRegister(data: IUserRegisterationCredentials): Promise<string | never>;
    handelUserLogin(userLoginCredentials: IUserLoginCredentials): Promise<string | never>;
}