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

    async getBlogDataByIdAndUserId(blogId: string, userId: string): Promise<IBlog | null | never> {
        try {
            return await Blogs.findOne({ _id: blogId, authorId: userId });
        } catch (err: any) {
            throw err;
        }
    }

    async updateBlogData(blogData: Omit<IBlog, "_id">, userId: string, blogId: string): Promise<void | never> {
        try {
            await Blogs.updateOne({ _id: blogId, authorId: userId }, { $set: blogData });
        } catch (err: any) {
            throw err;
        }
    }
}