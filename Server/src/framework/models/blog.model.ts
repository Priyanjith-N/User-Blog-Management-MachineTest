import mongoose, { Schema } from "mongoose";

// interfaces
import IBlog from "../../entity/IBlog.entity";

const blogSchema: Schema = new Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    image: {
        key: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    tags: [
        {
            type: String,
            required: true
        }
    ],
    authorId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    }
});

const Blogs = mongoose.model<IBlog>('Blogs', blogSchema);

export default Blogs;