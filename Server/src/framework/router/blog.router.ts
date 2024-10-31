import { Router } from "express";

const blogRouter: Router = Router();

//interfaces
import IJWTService from "../../interface/utils/IJWTService";
import IBlogRepository from "../../interface/repositories/IBlog.repository.interface";
import IBlogUseCase from "../../interface/usecase/IBlog.usecase.interface";
import IBlogController from "../../interface/controllers/IBlog.controller.interface";
import IAuthMiddleware from "../../interface/middlewares/authMiddleware.interface";

// classes importing
import BlogRepository from "../../adapters/repositories/blog.repository";
import BlogUseCase from "../../usecase/blog.usecase";
import BlogController from "../../adapters/controllers/blog.controller";
import AuthMiddleware from "../middleware/auth.middleware";

// importing util services
import JWTService from "../utils/jwtService.utils";

// util services
const jwtService: IJWTService = new JWTService();

// auth middleware
const authMiddleware: IAuthMiddleware = new AuthMiddleware(jwtService);

// for uploading images to s3 bucket
import upload from "../../interface/utils/s3ConfigurationAndMulterSetup.utils";

const blogRepository: IBlogRepository = new BlogRepository();
const blogUseCase: IBlogUseCase = new BlogUseCase(blogRepository);
const blogController: IBlogController = new BlogController(blogUseCase);

blogRouter.use(authMiddleware.isAuthenticate.bind(authMiddleware));

blogRouter.route("/blog")
.get(blogController.getAllBlogs.bind(blogController))
.post(upload.single("image"), blogController.createBlog.bind(blogController));

blogRouter.route("/blog/:blogId")
.get(blogController.getBlogData.bind(blogController))
.put(upload.single("image"), blogController.editBlog.bind(blogController))
.delete(blogController.deleteBlog.bind(blogController));

export default blogRouter;