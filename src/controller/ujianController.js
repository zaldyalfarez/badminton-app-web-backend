import { ujian, user, userUjian, soal } from "../model/index.js";
import { Op } from "sequelize";
import path from "path";
import fs from "fs";

const index = async (req, res) => {
  const { name } = req.query;

  const whereClause = {};
  if (name && name !== "null") {
    whereClause.name = { [Op.iLike]: `%${name}%` };
  }

  const ujians = await ujian.findAll({
    where: whereClause,
    include: {
      model: userUjian,
      as: "userUjians",
      where: { userId: req.user.id },
      required: false,
    },
    order: [["id", "ASC"]],
  });

  if (ujians.length == 0) {
    return res.status(404).json({
      meta: {
        code: 404,
        message: "Ujian not found",
      },
    });
  }
  const result = ujians.map((ujian) => {
    const userUjian = ujian.userUjians[0];
    return {
      id: ujian.id,
      name: ujian.name,
      type: ujian.type,
      level: ujian.level,
      durasi: ujian.durasi,
      thumbnail: ujian.thumbnail,
      isCompleted: userUjian ? userUjian.isCompleted : false,
    };
  });

  return res.status(200).json({
    meta: {
      code: 200,
      message: "Fetch ujian success found",
    },
    data: result,
  });
};

const store = async (req, res) => {
  try {
    const { name, type, level, durasi } = req.body;
    const thumbnailFolder = path.join("public", "thumbnails", "exam");
    const files = fs.readdirSync(thumbnailFolder);

    const randomThumbnail = files[Math.floor(Math.random() * files.length)];
    const thumbnail = randomThumbnail;
    const response = await ujian.create({
      name,
      thumbnail,
      type,
      level,
      durasi,
    });
    if (!response) {
      return res.status(400).json({
        meta: {
          code: 400,
          message: "Ujian not created",
        },
      });
    }
    return res.status(201).json({
      meta: {
        code: 201,
        message: "Ujian Created Successfully",
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

const show = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await ujian.findOne({ where: { id }, include: ["soals"] });
    if (!response) {
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Ujian not found",
        },
      });
    }
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Fetch ujian success found",
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
    const { id } = req.params;
    const { name, type, level, durasi } = req.body;
    const response = await ujian.findOne({ where: { id } });
    if (!response) {
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Ujian not found",
        },
      });
    }
    response.name = name;
    response.type = type;
    response.level = level;
    response.durasi = durasi;
    await response.save();
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Ujian Data Updated Successfully",
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

const deleteUjian = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await ujian.findOne({ where: { id } });
    if (!response) {
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Ujian not found",
        },
      });
    }
    await soal.destroy({ where: { ujianId: id } });
    await response.destroy();
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Ujian Data Deleted Successfully",
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

const ujianIsCompleted = async (req, res) => {
  try {
    const { ujianId } = req.body;
    const userId = req.user.id;
    const exist = await userUjian.findOne({ where: { userId, ujianId } });
    if (exist) {
      return res.status(400).json({
        meta: {
          code: 400,
          message: "Ujian already completed",
        },
      });
    }
    const response = await userUjian.create({ userId, ujianId, isCompleted: true });
    if (!response) {
      return res.status(400).json({
        meta: {
          code: 400,
          message: "Ujian not created",
        },
      });
    }
    return res.status(201).json({
      meta: {
        code: 201,
        message: "Ujian Created Successfully",
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

export default {
  index,
  store,
  show,
  update,
  deleteUjian,
  ujianIsCompleted,
};
