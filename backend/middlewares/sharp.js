const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

module.exports = async (req, res, next) => {
    if (req.file) {
        const name = req.file.filename.split(".")[0];

        req.file.filename = name + ".webp";

        await sharp(req.file.path)
            .resize(300)
            .webp({ quality: 80 })
            .toFile(path.resolve(req.file.destination, req.file.filename));

        fs.unlinkSync(req.file.path);

        next();
    }
};
