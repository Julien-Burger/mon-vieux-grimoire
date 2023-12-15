const multer = require("multer");

const MIME_TYPE = {
    "image/jpeg": "jpg",
    "image/jpg": "png",
    "image/png": "png",
    "image/webp": "webp",
};
const MAX_SIZE = 1 * 1024 * 1024;

const multerFilter = (req, file, callback) => {
    if (file.mimetype.startsWith("image")) {
        callback(null, true);
    } else {
        callback({ message: "Ton fichier est moisi." }, false);
    }
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "images/");
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(" ").join("_");
        const namePop = name.split(".")[0];
        const extension = MIME_TYPE[file.mimetype];

        callback(null, `${namePop}${Date.now()}.${extension}`);
    },
});

const upload = multer({
    storage: storage,
    fileFilter: multerFilter,
    limits: {
        files: 1,
        fileSize: MAX_SIZE,
    },
});

module.exports = (req, res, next) => {
    upload.single("image")(req, res, error => {
        if (error) return res.status(400).send({ error });

        next();
    });
};
