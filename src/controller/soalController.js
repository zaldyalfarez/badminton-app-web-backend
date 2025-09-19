import { soal, ujian } from "../model/index.js";
import path from "path"
import fs from "fs";

const index = async (req, res) => {
  try {
    const soals = await soal.findAll();
    if (soals.length == 0) {
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Soal not found",
        },
      });
    }
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Fetch soal success found",
      },
      data: soals,
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
    const { ujianId, video, question, optionA, optionB, optionC, optionD, answer } = req.body;
    let image = null;

    if (req.file) {
      image = req.file.filename;
    }
    const ujianData = await ujian.findOne({ where: { id: ujianId } });
    if (!ujianData) {
      return res.status(404).json({
        meta: {
          code: 404,
          message: `Ujian with Id: ${ujianId} not found`,
        },
      });
    }
    const response = await soal.create({
      ujianId,
      question,
      video,
      image,
      optionA,
      optionB,
      optionC,
      optionD,
      answer,
    });
    if (!response) {
      return res.status(400).json({
        meta: {
          code: 400,
          message: "Soal Failed to Created",
        },
      });
    }
    return res.status(201).json({
      meta: {
        code: 201,
        message: "Soal Created Successfully",
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
    const response = await soal.findOne({ where: { id } });
    if (!response) {
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Soal not found",
        },
      });
    }
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Fetch soal success found",
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
    const { video, question, optionA, optionB, optionC, optionD, answer } = req.body;
    const response = await soal.findOne({ where: { id } });
    if (!response) {
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Soal not found",
        },
      });
    }
    if (req.file) {
      if (response.image) {
        const oldPath = path.resolve("public", "questions", response.image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      response.image = req.file.filename;
    }
    response.video = video || response.video;
    response.question = question || response.question;
    response.optionA = optionA || response.optionA;
    response.optionB = optionB || response.optionB;
    response.optionC = optionC || response.optionC;
    response.optionD = optionD || response.optionD;
    response.answer = answer || response.answer;
    await response.save();
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Soal Data Updated Successfully",
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

const deleteSoal = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await soal.findOne({ where: { id } });
    if (!response) {
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Soal not found",
        },
      });
    }

    await response.destroy();
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Soal Data Deleted Successfully",
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

const getAllSoalByUjianId = async (req, res) => {
  try {
    const { id: ujianId } = req.params;
    const response = await soal.findAll({ where: { ujianId }, order: [["id", "ASC"]] });
    if (response.length == 0) {
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Soal not found",
        },
      });
    }
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Fetch soal success found",
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
  deleteSoal,
  getAllSoalByUjianId,
};
