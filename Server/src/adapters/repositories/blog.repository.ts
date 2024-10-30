// importing collections
import Blogs from "../../framework/models/blog.model";

// interfaces
import IBlog from "../../entity/IBlog.entity";
import IBlogRepository from "../../interface/repositories/IBlog.repository.interface";

export default class BlogRepository implements IBlogRepository {
    async createBlog(blogData: Omit<IBlog, "_id">): Promise<void | never> {
        try {
            const newBlog = new Blogs(blogData);

            await newBlog.save();
        } catch (err: any) {
            throw err;
        }
    }
}