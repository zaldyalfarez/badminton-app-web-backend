import joi from "joi";
import authMiddleware from "./authMiddleware.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/profile");
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

const update = async (req, res, next) => {
  try {
    const granted = await authMiddleware.validateRole(req, ["user"]);
    if (!granted) {
      return res.status(401).json({
        meta: {
          code: 401,
          message: "Unauthorized",
        },
      });
    }

    upload(req, res, function (err) {
      if (err instanceof multer.MulterError || err) {
        return res.status(400).json({
          meta: {
            code: 400,
            message: err.message || "Upload error",
          },
        });
      }

      const schema = joi.object({
        name: joi.string().allow(null, ""),
        password: joi.string().allow(null, ""),
      });

      const { error } = schema.validate(req.body);
      if (error) {
        if (req.file) {
          const filePath = `public/profile/${req.file.filename}`;
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
        return res.status(400).json({
          meta: {
            code: 400,
            message: error.message,
          },
        });
      }

      // Jika semua valid, lanjut ke controller
      next();
    });
  } catch (error) {
    return res.status(500).json({
      meta: {
        code: 500,
        message: error.message,
      },
    });
  }
};

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
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError || err) {
        return res.status(400).json({
          meta: {
            code: 400,
            message: err.message || "Upload error",
          },
        });
      }
    });
    const schema = joi.object({
      name: joi.string().required(),
      email: joi.string().required(),
      password: joi.string().required(),
      role: joi.string().required(),
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

const show = async (req, res, next) => {
  try {
    const granted = await authMiddleware.validateRole(req, ["admin", "user", "coach"]);
    if (!granted) {
      return res.status(401).json({
        meta: {
          code: 401,
          message: "Unauthorized",
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

const updateCoach = async (req, res, next) => {
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
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError || err) {
        return res.status(400).json({
          meta: {
            code: 400,
            message: err.message || "Upload error",
          },
        });
      }

      const schema = joi.object({
        name: joi.string(),
        email: joi.string(),
        password: joi.string(),
      });
      const { error } = schema.validate(req.body);
      if (error) {
        if (req.file) {
          const filePath = `public/profile/${req.file.filename}`;
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
        return res.status(400).json({
          meta: {
            code: 400,
            message: error.message,
          },
        });
      }
      next();
    });
  } catch (error) {
    return res.status(500).json({
      meta: {
        code: 500,
        message: error.message,
      },
    });
  }
};

const deleteCoach = async (req, res, next) => {
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

export default { store, update, deleteCoach, updateCoach, show };
