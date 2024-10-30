// interfaces
import { IBlogCredentials } from "../../entity/IBlog.entity";

export default interface IBlogUseCase {
    handelCreateNewBlog(blogCredentials: IBlogCredentials, userId: string | undefined): Promise<void | never>;
}