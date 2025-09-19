import { notif } from "../model/index.js";

const index = async (req, res) => {
  try {
    const notifs = await notif.findAll({
      where: { receiverId: req.user.id },
      order: [["id", "DESC"]],
    });
    if (notifs.length == 0) {
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Notif not found",
        },
      });
    }
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Fetch notif success found",
      },
      data: notifs,
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
    const notif = await notif.findOne({ where: { id } });
    if (!notif) {
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Notif not found",
        },
      });
    }
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Fetch notif success found",
      },
      data: notif,
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
    await notif.update({ isRead: true }, { where: { id } });
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Update notif success",
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
export default { index, show, update };
