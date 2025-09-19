import joi from "joi";
import authMiddleware from "./authMiddleware.js";

const startUjian = async (req, res, next) => {
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
    const schema = joi.object({
      ujianId: joi.number().integer().required(),
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

const store = async (req, res, next) => {
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
    const schema = joi.object({
      userUjianId: joi.number().integer().required(),
      soalId: joi.number().integer().required(),
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

const submitUjian = async (req, res, next) => {
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
    const schema = joi.object({
      userUjianId: joi.number().integer().required(),
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

export default { startUjian, store, submitUjian };
