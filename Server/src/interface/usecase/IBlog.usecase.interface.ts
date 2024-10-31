// interfaces
import IBlog, { IBlogCredentials, IBlogWithUserDetails } from "../../entity/IBlog.entity";

export default interface IBlogUseCase {
    handelCreateNewBlog(blogCredentials: IBlogCredentials, userId: string | undefined): Promise<void | never>;
    getBlogData(blogId: string | undefined, userId: string | undefined): Promise<IBlog | never>;
    handelEditBlog(blogCredentials: IBlogCredentials, blogId: string | undefined, userId: string | undefined): Promise<void | never>;
    deleteBlog(blogId: string | undefined, userId: string | undefined): Promise<void | never>;
    getAllBolgs(): Promise<IBlogWithUserDetails[] | never>;
    getAllBolgsOfCurrentUser(userId: string | undefined): Promise<IBlogWithUserDetails[] | never>;
}