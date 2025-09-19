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

const getScore = async (req, res, next) => {
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

export default { index, show, getScore };
