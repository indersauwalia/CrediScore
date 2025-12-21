import multer from "multer";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only PDF and images allowed"));
        }
    },
});

export default upload;