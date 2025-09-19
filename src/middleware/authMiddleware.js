import joi from "joi";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

const register = async (req, res, next) => {
  try {
    const schema = joi.object({
      name: joi.string().required(),
      email: joi.string().required(),
      password: joi.string().required(),
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

const login = async (req, res, next) => {
  try {
    const schema = joi.object({
      email: joi.string().required(),
      password: joi.string().required(),
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

const validateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token missing or invalid" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, config.app.jwt);
    req.user = decoded;
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

const validateRole = async (req, role, res) => {
  try {
    for (const i in role) {
      if (req.user.role == role[i]) {
        return true;
      }
    }
    return false;
  } catch (error) {
    return res.status(500).json({
      meta: {
        code: 500,
        message: error.message,
      },
    });
  }
};

export default { register, login, validateToken, validateRole };
