import joi from "joi";
import authMiddleware from "./authMiddleware.js";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/questions");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Hanya file gambar (jpeg/jpg/png) yang diizinkan!"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
}).single("image");

const store = async (req, res, next) => {
  try {
    const granted = await authMiddleware.validateRole(req, ["admin"]);
    if (!granted) {
      return res.status(401).json({
        meta: {
          code: 401,
          message: "Unauthorized",
        },
      });
    }
    await new Promise((resolve, reject) => {
      upload(req, res, function (err) {
        if (err instanceof multer.MulterError || err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    const schema = joi.object({
      ujianId: joi.number().integer().required(),
      video: joi.string(),
      question: joi.string().required(),
      optionA: joi.string().required(),
      optionB: joi.string().required(),
      optionC: joi.string().required(),
      optionD: joi.string().required(),
      answer: joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        meta: {
          code: 400,
          message: error.message,
        },
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      meta: {
        code: 500,
        message: error.message,
      },
    });
  }
};

const update = async (req, res, next) => {
  try {
    const granted = await authMiddleware.validateRole(req, ["admin"]);
    if (!granted) {
      return res.status(401).json({
        meta: {
          code: 401,
          message: "Unauthorized",
        },
      });
    }
    await new Promise((resolve, reject) => {
      upload(req, res, function (err) {
        if (err instanceof multer.MulterError || err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    const schema = joi.object({
      video: joi.string(),
      question: joi.string(),
      optionA: joi.string(),
      optionB: joi.string(),
      optionC: joi.string(),
      optionD: joi.string(),
      answer: joi.string(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        meta: {
          code: 400,
          message: error.message,
        },
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      meta: {
        code: 500,
        message: error.message,
      },
    });
  }
};

export default {
  store,
  update,
};
