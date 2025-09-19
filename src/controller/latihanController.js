import { latihan, user, userLatihan } from "../model/index.js";
import path from "path";
import fs from "fs";
import { Op } from "sequelize";

const index = async (req, res) => {
  try {
    const { kategori, name } = req.query;

    const whereClause = {};
    if (kategori && kategori !== "null") {
      whereClause.kategori = kategori;
    }
    if (name && name !== "null") {
      whereClause.name = { [Op.iLike]: `%${name}%` };
    }
    const latihans = await latihan.findAll({
      where: whereClause,
      include: {
        model: user,
        as: "users",
        where: { id: req.user.id },
        required: false,
      },
      order: [["id", "ASC"]],
    });
    if (latihans.length == 0) {
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Latihan not found",
        },
      });
    }
    const result = latihans.map((latihan) => {
      const userLatihan = latihan.users[0]?.UserLatihan;
      return {
        id: latihan.id,
        name: latihan.name,
        thumbnail: latihan.thumbnail,
        kategori: latihan.kategori,
        durasi: latihan.durasi,
        deskripsi: latihan.deskripsi,
        video: latihan.video,
        ar: latihan.ar,
        arModel: latihan.arModel,
        isCompleted: userLatihan ? userLatihan.isCompleted : false,
      };
    });

    return res.status(200).json({
      meta: {
        code: 200,
        message: "Fetch latihan success found",
      },
      data: result,
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
    const { name, durasi, deskripsi, video, kategori, ar } = req.body;
    let arModel = null;

    const thumbnailFolder = path.join("public", "thumbnails", "practice");
    const files = fs.readdirSync(thumbnailFolder);

    const randomThumbnail = files[Math.floor(Math.random() * files.length)];
    const thumbnail = randomThumbnail;
    if (req.file) {
      arModel = req.file.filename;
    }

    const response = await latihan.create({
      name,
      thumbnail,
      durasi,
      deskripsi,
      kategori,
      video,
      ar,
      arModel,
    });
    if (!response) {
      return res.status(400).json({
        meta: {
          code: 400,
          message: "Latihan not created",
        },
      });
    }
    return res.status(201).json({
      meta: {
        code: 201,
        message: "Latihan Created Successfully",
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
    const { name, durasi, deskripsi, video, kategori, ar } = req.body;
    const response = await latihan.findOne({ where: { id } });
    if (!response) {
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Latihan not found",
        },
      });
    }
    const isAr = ar === "true" || ar === true;

    if (isAr && !req.file && !response.arModel) {
      return res.status(400).json({
        meta: {
          code: 400,
          message: "File .glb wajib diunggah jika AR aktif",
        },
      });
    }
    if (req.file) {
      if (response.arModel) {
        const oldPath = path.resolve("public", "3d", response.arModel);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      response.arModel = req.file.filename;
    }

    response.name = name;
    response.durasi = durasi;
    response.kategori = kategori;
    response.deskripsi = deskripsi;
    response.ar = ar;
    response.video = video;
    await response.save();
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Latihan Data Updated Successfully",
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
    const response = await latihan.findOne({ where: { id } });
    if (!response) {
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Latihan not found",
        },
      });
    }
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Fetch latihan success found",
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

const latihanIsCompleted = async (req, res) => {
  try {
    const { latihanId } = req.body;
    const userId = req.user.id;
    const exist = await userLatihan.findOne({ where: { userId, latihanId } });
    if (exist) {
      return res.status(400).json({
        meta: {
          code: 400,
          message: "Latihan already completed",
        },
      });
    }
    const response = await userLatihan.create({ userId, latihanId, isCompleted: true });
    if (!response) {
      return res.status(400).json({
        meta: {
          code: 400,
          message: "Latihan not created",
        },
      });
    }
    return res.status(201).json({
      meta: {
        code: 201,
        message: "Latihan Created Successfully",
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

const getKategori = async (req, res) => {
  try {
    const response = await latihan.findAll({ attributes: ["kategori"], group: ["kategori"] });
    if (response.length === 0) {
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Kategori not found",
        },
      });
    }
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Fetch Kategori success found",
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

const deleteLatihan = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await latihan.findOne({ where: { id } });
    if (!response) {
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Latihan not found",
        },
      });
    }
    if (response.thumbnail) {
      const thumbnailPath = path.join("public/thumbnails", response.thumbnail);
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }
    }
    await response.destroy();
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Latihan Data Deleted Successfully",
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

export default { index, store, update, show, latihanIsCompleted, getKategori, deleteLatihan };
