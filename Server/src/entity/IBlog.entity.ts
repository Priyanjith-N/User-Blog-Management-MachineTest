export default interface IBlog {
    _id: string;
    title: string;
    category: string;
    image: {
        key: string;
        url: string;
    },
    content: string;
    tags: string[];
    authorId: string;
    createdAt: Date;
}

export interface IBlogCredentials {
    title: string | undefined;
    category: string | undefined;
    content: string | undefined;
    image: Express.MulterS3.File | undefined;
    tags: string[] | undefined;
}