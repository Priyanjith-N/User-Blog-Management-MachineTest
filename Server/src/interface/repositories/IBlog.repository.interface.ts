// interfaces
import IBlog from "../../entity/IBlog.entity";

export default interface IBlogRepository {
    createBlog(blogData: Omit<IBlog, "_id">): Promise<void | never>;
}