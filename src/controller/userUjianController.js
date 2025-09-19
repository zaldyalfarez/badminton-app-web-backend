import { userUjian, ujian, jawabanUjian, soal } from "../model/index.js";

const index = async (req, res) => {
  try {
    const { ujianId } = req.query;
    const userId = req.user.id;
    const response = await userUjian.findAll({ where: { userId, ujianId }, include: { model: ujian, as: "ujian" } });
    if (response.length == 0) {
      return res.status(404).json({
        meta: {
          code: 404,
          message: "User Belum Pernah Melakukan Ujian",
        },
      });
    }
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Fetch User Ujian Success",
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
    const { ujianId } = req.query;
    const userId = req.user.id;
    const response = await userUjian.findAll({
      where: { userId, ujianId },
    });
    const totalAttempt = response.length;
    let totalSkor = 0;
    let totalDurasi = 0;
    response.forEach((item) => {
      const mulai = new Date(item.mulaiAt);
      const selesai = new Date(item.selesaiAt);
      if (!isNaN(mulai) && !isNaN(selesai)) {
        const durasi = selesai - mulai;
        if (durasi > 0) {
          totalDurasi += durasi;
        }
      }
      totalSkor += item.skor;
    });
    const averageSkor = Math.round(totalSkor / totalAttempt);
    const averageDurasi = Math.round(totalDurasi / totalAttempt);
    const data = {
      totalAttempt,
      averageSkor,
      averageDurasi,
    };

    if (!response) {
      return res.status(404).json({
        meta: {
          code: 404,
          message: "User Belum Pernah Melakukan Ujian",
        },
      });
    }
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Fetch User Ujian Success",
      },
      data,
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

const getScore = async (req, res) => {
  try {
    const { id: userUjianId } = req.params;
    const response = await userUjian.findOne({
      where: { id: userUjianId },
      include: [
        {
          model: ujian,
          as: "ujian",
        },
        {
          model: jawabanUjian,
          as: "jawabanUjians",
        },
      ],
    });
    const jumlahSoal = await soal.count({ where: { ujianId: response.ujian.id } });
    if (!response) {
      return res.status(404).json({
        meta: {
          code: 404,
          message: "User Belum Pernah Melakukan Ujian",
        },
      });
    }
    if (response.skor == null) {
      response.skor = Math.round((response.jawabanUjians.filter((item) => item.isTrue).length / jumlahSoal) * 100);
      await response.save();
    }
    const data = {
      ...response.toJSON(),
      jumlahSoal,
    };
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Fetch User Ujian Success",
      },
      data: data,
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

export default { index, show, getScore };
