// interfaces
import IBlog, { IBlogCredentials } from "../../entity/IBlog.entity";

export default interface IBlogUseCase {
    handelCreateNewBlog(blogCredentials: IBlogCredentials, userId: string | undefined): Promise<void | never>;
    getBlogData(blogId: string | undefined, userId: string | undefined): Promise<IBlog | never>;
    handelEditBlog(blogCredentials: IBlogCredentials, blogId: string | undefined, userId: string | undefined): Promise<void | never>;
}