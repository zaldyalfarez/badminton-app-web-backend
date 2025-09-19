import joi from "joi";
import authMiddleware from "./authMiddleware.js";

const index = async (req, res, next) => {
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

const store = async (req, res, next) => {
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
    const schema = joi.object({
      coachId: joi.number().integer().required(),
      date: joi.date().required(),
      time: joi.string().required(),
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
    const granted = await authMiddleware.validateRole(req, ["admin", "coach"]);
    if (!granted) {
      return res.status(401).json({
        meta: {
          code: 401,
          message: "Unauthorized",
        },
      });
    }
    const schema = joi.object({
      status: joi.string().required(),
      reason: joi.string().when("status", {
        is: "reject",
        then: joi.required().messages({ "any.required": "Reason is required when status is reject" }),
        otherwise: joi.optional(),
      }),
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

export default { index, store, update, show };
