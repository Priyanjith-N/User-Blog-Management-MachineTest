// importing collections
import Blogs from "../../framework/models/blog.model";

// interfaces
import IBlog, { IBlogWithUserDetails } from "../../entity/IBlog.entity";
import IBlogRepository from "../../interface/repositories/IBlog.repository.interface";
import mongoose from "mongoose";

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

    async deleteBlog(blogId: string, userId: string): Promise<void | never> {
        try {
            await Blogs.deleteOne({ _id: blogId, authorId: userId });
        } catch (err: any) {
            throw err;
        }
    }

    async getAllBlogs(): Promise<IBlogWithUserDetails[] | never> {
        try {
            return await Blogs.aggregate(
                [
                    {
                      $lookup: {
                        from: 'users', 
                        localField: 'authorId', 
                        foreignField: '_id', 
                        as: 'userData'
                      }
                    }, 
                    {
                      $unwind: {
                        path: '$userData'
                      }
                    },
                    {
                        $project: {
                            "userData.password": 0
                        }
                    }, 
                    {
                      $sort: {
                        createdAt: -1
                      }
                    }
                  ]
            );
        } catch (err: any) {
            throw err;
        }
    }

    async getBlogsOfCurrentUser(userId: string): Promise<IBlogWithUserDetails[] | never> {
        try {
            return await Blogs.aggregate(
                [
                    {
                        $match: {
                            authorId: new mongoose.Types.ObjectId(userId)
                        }
                    },
                    {
                      $lookup: {
                        from: 'users', 
                        localField: 'authorId', 
                        foreignField: '_id', 
                        as: 'userData'
                      }
                    }, 
                    {
                      $unwind: {
                        path: '$userData'
                      }
                    },
                    {
                        $project: {
                            "userData.password": 0
                        }
                    }, 
                    {
                      $sort: {
                        createdAt: -1
                      }
                    }
                  ]
            );
        } catch (err: any) {
            throw err;
        }
    }

    async getBlogWithUserDetailsById(blogId: string): Promise<IBlogWithUserDetails | never> {
        try {
            return (await Blogs.aggregate(
                [
                    {
                        $match: {
                            _id: new mongoose.Types.ObjectId(blogId)
                        }
                    },
                    {
                      $lookup: {
                        from: 'users', 
                        localField: 'authorId', 
                        foreignField: '_id', 
                        as: 'userData'
                      }
                    }, 
                    {
                      $unwind: {
                        path: '$userData'
                      }
                    },
                    {
                        $project: {
                            "userData.password": 0
                        }
                    }
                  ]
            ))[0];
        } catch (err: any) {
            throw err;
        }
    }
}