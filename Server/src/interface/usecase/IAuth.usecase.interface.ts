// interfaces
import { IUserRegisterationCredentials } from "../../entity/user.entity";

export default interface IAuthUseCase {
    handelUserRegister(data: IUserRegisterationCredentials): Promise<string | never>;
}