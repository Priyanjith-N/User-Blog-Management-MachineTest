// interfaces
import { IUserLoginCredentials, IUserRegisterationCredentials } from "../../entity/IUser.entity";

export default interface IAuthUseCase {
    handelUserRegister(data: IUserRegisterationCredentials): Promise<string | never>;
    handelUserLogin(userLoginCredentials: IUserLoginCredentials): Promise<string | never>;
    isUserAuthenticated(token: string | undefined): Promise<void | never>;
}