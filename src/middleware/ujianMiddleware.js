import joi from "joi";
import authMiddleware from "./authMiddleware.js";

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
    const schema = joi.object({
      name: joi.string().required(),
      type: joi.string().required(),
      level: joi.string().valid('Mudah', 'Normal', 'Sulit').required(),
      durasi: joi.number().integer().required(),
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
    const schema = joi.object({
      name: joi.string(),
      type: joi.string(),
      level: joi.string().valid('Mudah', 'Normal', 'Sulit').required(),
      durasi: joi.number().integer(),
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
const ujianIsCompleted = async (req, res, next) => {
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

export default {
  store,
  update,
  ujianIsCompleted,
};
