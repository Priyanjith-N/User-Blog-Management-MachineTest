import { S3Client } from "@aws-sdk/client-s3";
import multer, { MulterError } from "multer";
import multerS3 from "multer-s3";

const s3 = new S3Client({
    region: process.env.AWS_REGION || "",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME || "",
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, `blogCoverImages/${uniqueSuffix}-${file.originalname}`); // make the file name unique
        },
    }),
    fileFilter: (req, file, cb) => {
        const allowedTypes: Set<string> = new Set(["image/png", "image/jpeg", "image/gif", "image/bmp", "image/svg+xml", "image/webp"]);
        if (allowedTypes.has(file.mimetype)) {
          cb(null, true); // accepet file
        } else {
            cb(null, false);
        }
    },
});

export default upload;