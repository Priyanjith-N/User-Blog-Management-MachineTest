// interfaces
import IBlog from "../../entity/IBlog.entity";

export default interface IBlogRepository {
    createBlog(blogData: Omit<IBlog, "_id">): Promise<void | never>;
    getBlogDataByIdAndUserId(blogId: string, userId: string): Promise<IBlog | null | never>;
    updateBlogData(blogData: Omit<IBlog, "_id">, userId: string, blogId: string): Promise<void | never>;
    deleteBlog(blogId: string, userId: string): Promise<void | never>;
}