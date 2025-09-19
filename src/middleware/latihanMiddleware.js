import joi from "joi";
import authMiddleware from "./authMiddleware.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/3d");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /glb/;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const allowedMimes = ["model/gltf-binary", "application/octet-stream"];
  const mimeType = allowedMimes.includes(file.mimetype.toLowerCase());

  if (extName && mimeType) {
    cb(null, true);
  } else {
    console.log("Ext : ", extName, " Mime : ", mimeType);
    cb(new Error("Hanya file .glb yang diizinkan!"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
}).single("arModel");

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
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          meta: {
            code: 400,
            message: err.message,
          },
        });
      }

      const schema = joi.object({
        name: joi.string().required(),
        durasi: joi.number().integer().required(),
        kategori: joi.string().required(),
        deskripsi: joi.string().required(),
        video: joi.string().required(),
        ar: joi.boolean(),
        isCompleted: joi.boolean(),
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
      if (req.body.ar === "true" || req.body.ar === true) {
        if (!req.file) {
          return res.status(400).json({
            meta: {
              code: 400,
              message: "File .glb wajib diunggah jika AR aktif",
            },
          });
        }
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

    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          meta: {
            code: 400,
            message: err.message,
          },
        });
      }

      const schema = joi.object({
        name: joi.string(),
        durasi: joi.number().integer(),
        kategori: joi.string(),
        deskripsi: joi.string(),
        video: joi.string(),
        ar: joi.boolean(),
        isCompleted: joi.boolean(),
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

const latihanIsCompleted = async (req, res, next) => {
  try {
    const granted = await authMiddleware.validateRole(req, ["admin", "user"]);
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

const deleteLatihan = async (req, res, next) => {
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

export default { store, update, latihanIsCompleted, deleteLatihan };
