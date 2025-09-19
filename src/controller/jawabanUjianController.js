import { jawabanUjian, userUjian, ujian, soal } from "../model/index.js";

const startUjian = async (req, res) => {
  try {
    const { ujianId } = req.body;
    const userId = req.user.id;
    const exist = await userUjian.findOne({
      where: {
        userId,
        ujianId,
        isCompleted: false,
      },
      order: [["attempt", "DESC"]],
    });
    if (exist) {
      return res.status(400).json({
        meta: {
          code: 400,
          message: "Ujian Already Started and Not Finished Yet",
        },
      });
    }
    const lastAttempt = await userUjian.findOne({
      where: {
        userId,
        ujianId,
      },
      order: [["attempt", "DESC"]],
    });
    const attempt = lastAttempt ? lastAttempt.attempt + 1 : 1;
    const newAttempt = await userUjian.create({
      userId,
      ujianId,
      attempt,
      mulaiAt: new Date(),
    });
    if (!newAttempt) {
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
        message: "Ujian Started Successfully",
      },
      data: newAttempt,
    });
  } catch (error) {
    return res.status(500).json({
      meta: {
        code: 500,
        message: error.message,
        ...(error.errors && { details: error.errors.map((e) => e.message) }),
      },
    });
  }
};

const store = async (req, res) => {
  try {
    const { userUjianId, soalId, answer } = req.body;
    const exist = await jawabanUjian.findOne({
      where: {
        userUjianId,
        soalId,
      },
    });
    const trueAnswer = await soal.findOne({
      where: {
        id: soalId,
      },
    });
    let isTrue = false;
    if (answer === trueAnswer.answer) {
      isTrue = true;
    }
    if (exist) {
      exist.answer = answer;
      exist.true = isTrue;
      await exist.save();
      return res.status(200).json({
        meta: {
          code: 200,
          message: "Answer Updated Successfully",
        },
        data: exist,
      });
    } else {
      const response = await jawabanUjian.create({
        userUjianId,
        soalId,
        answer,
        isTrue,
      });
      if (!response) {
        return res.status(400).json({
          meta: {
            code: 400,
            message: "answer not created",
          },
        });
      }
      return res.status(201).json({
        meta: {
          code: 201,
          message: "Answer Created Successfully",
        },
        data: response,
      });
    }
  } catch (error) {
    return res.status(500).json({
      meta: {
        code: 500,
        message: error.message,
      },
    });
  }
};

const submitUjian = async (req, res) => {
  try {
    const { userUjianId } = req.body;
    const exist = await userUjian.findOne({
      where: {
        id: userUjianId,
      },
      include: { model: ujian, as: "ujian" },
    });
    if (!exist) {
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Ujian not found",
        },
      });
    }
    exist.isCompleted = true;
    exist.selesaiAt = new Date();
    await exist.save();

    return res.status(200).json({
      meta: {
        code: 200,
        message: "Ujian Completed Successfully",
      },
      data: exist,
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
  startUjian,
  store,
  submitUjian,
};
