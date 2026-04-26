import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const allowedMimeTypes = [
  "application/javascript",
  "text/javascript",
  "application/x-javascript",
  "text/plain",
  "application/json",
  "application/typescript",
  "text/typescript",
  "application/octet-stream",
];

const allowedExtensions = [".js", ".jsx", ".ts", ".tsx", ".json"];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  const isValidMime = allowedMimeTypes.includes(file.mimetype);
  const isValidExt = allowedExtensions.includes(ext);

  if (isValidExt && isValidMime) {
    cb(null, true);
  } else if (isValidExt) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only .js, .jsx, .ts, .tsx, .json files are allowed."), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});