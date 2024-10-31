export default interface IUser {
    _id: string;
    userName: string;
    email: string;
    password: string;
}

export interface IUserProfile extends Omit<IUser, "password"> {}