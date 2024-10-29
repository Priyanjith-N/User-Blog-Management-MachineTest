// interfaces
import IUser from "../../entity/user.entity";

export default interface IAuthRepository {
    isUserExist(email: string, userName: string): Promise<IUser | null | never>;
    createNewUser(newUserData: Omit<IUser, "_id">): Promise<IUser | never>;
}