import { user } from "../model/index.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { Op } from "sequelize";

const index = async (req, res) => {
  try {
    const { role, search } = req.query;

    const users = await user.findAll({
      where: {
        ...(role && { role }),
        ...(search && {
          name: {
            [Op.iLike]: `%${search}%`,
          },
        }),
      },
      attributes: {
        exclude: ["password"],
      },
      order: [["name", "ASC"]],
    });

    if (users.length === 0) {
      return res.status(404).json({
        meta: {
          code: 404,
          message: "No users found",
        },
      });
    }

    return res.status(200).json({
      meta: {
        code: 200,
        message: `Users fetched successfully${role ? ` for role '${role}'` : ""}${search ? ` with keyword '${search}'` : ""}`,
      },
      data: users,
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

const store = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await user.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        meta: {
          code: 400,
          message: "Email already exists",
        },
      });
    }

    const image = "https://avatar.iran.liara.run/username?username=" + name.replace(/\s+/g, "");
    const newUser = await user.create({
      name,
      email,
      password,
      role,
      image,
    });
    const { password: _, ...userData } = newUser.get({ plain: true });

    return res.status(201).json({
      meta: {
        code: 201,
        message: "User created successfully",
      },
      data: userData,
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

const show = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id !== id && req.user.role !== "admin") {
      return res.status(403).json({
        meta: {
          code: 403,
          message: "Forbidden",
        },
      });
    }
    const response = await user.findOne({ where: { id } });
    if (!response) {
      return res.status(404).json({
        meta: {
          code: 404,
          message: "User not found",
        },
      });
    }

    return res.status(200).json({
      meta: {
        code: 200,
        message: "Fetch user success found",
      },
      data: response,
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

const update = async (req, res) => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const { id } = req.params;
    const { name, password } = req.body;
    if (req.user.id != id) {
      console.log(req.user.id);
      return res.status(403).json({
        meta: {
          code: 403,
          message: "Forbidden",
        },
      });
    }
    const response = await user.findOne({ where: { id } });
    if (!response) {
      return res.status(404).json({
        meta: {
          code: 404,
          message: "User not found",
        },
      });
    }
    if (req.file) {
      if (response.image) {
        const oldPath = path.resolve("public", "profile", response.image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      response.image = req.file.filename;
    }

    response.name = name || response.name;
    response.password = password || response.password;
    await response.save();
    return res.status(200).json({
      meta: {
        code: 200,
        message: "User Data Updated Successfully",
      },
      data: response,
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

const updateCoach = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, name, password } = req.body;
    console.log("email", email, "name", name, "password", password);
    if (req.user.role != "admin") {
      console.log(req.user.id);
      return res.status(403).json({
        meta: {
          code: 403,
          message: "Forbidden",
        },
      });
    }
    const response = await user.findOne({ where: { id } });
    if (!response) {
      return res.status(404).json({
        meta: {
          code: 404,
          message: "User not found",
        },
      });
    }
    if (response.role !== "coach") {
      return res.status(403).json({
        meta: {
          code: 403,
          message: "Forbidden: Only coaches can be updated",
        },
      });
    }
    if (req.file) {
      if (response.image) {
        const oldPath = path.resolve("public", "profile", response.image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      response.image = req.file.filename;
    }
    response.email = email || response.email;
    response.name = name || response.name;
    response.password = password || response.password;
    await response.save();
    return res.status(200).json({
      meta: {
        code: 200,
        message: "User Data Updated Successfully",
      },
      data: response,
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

const deleteCoach = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await user.findOne({ where: { id } });
    if (!response) {
      return res.status(404).json({
        meta: {
          code: 404,
          message: "User not found",
        },
      });
    }
    if (response.role !== "coach") {
      return res.status(403).json({
        meta: {
          code: 403,
          message: "Forbidden: Only coaches can be deleted",
        },
      });
    }
    if (response.image) {
      const oldPath = path.resolve("public", "profile", response.image);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }
    await response.destroy();
    return res.status(200).json({
      meta: {
        code: 200,
        message: "User deleted successfully",
      },
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

export default { show, store, update, index, deleteCoach, updateCoach };
