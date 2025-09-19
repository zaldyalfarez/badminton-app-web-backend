import { where } from "sequelize";
import { bookingCoach, notif, user } from "../model/index.js";

const index = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await bookingCoach.findAll({
      where: req.user.role === "user" ? { userId } : { coachId: userId },
      include: [
        { model: user, as: "coach" },
        { model: user, as: "user" },
      ],
      order: [["id", "DESC"]],
    });
    if (bookings.length == 0) {
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Booking not found",
        },
      });
    }
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Fetch booking success found",
      },
      data: bookings,
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
    const { coachId, date, time } = req.body;
    const userId = req.user.id;
    const status = "Diajukan";
    const response = await bookingCoach.create({
      userId,
      coachId,
      date,
      time,
      status,
    });
    const coach = await user.findOne({ where: { id: coachId } });
    const users = await user.findOne({ where: { id: userId } });
    if (!response) {
      return res.status(400).json({
        meta: {
          code: 400,
          message: "Booking not created",
        },
      });
    }
    await notif.create({
      receiverId: userId,
      bookingCoachId: response.id,
      message: `Permintaan jadwal latihan Anda pada tanggal ${date} pukul ${time} telah berhasil diajukan kepada coach ${coach.name}. Mohon tunggu konfirmasi dari Coach. Anda akan diberi tahu setelah jadwal disetujui atau ditolak.`,
    });
    await notif.create({
      receiverId: coachId,
      bookingCoachId: response.id,
      message: `Pengguna ${users.name} telah mengajukan jadwal latihan pada tanggal ${date} pukul ${time}. Silahkan tinjau dan konfirmasi ketersediaan Anda.`,
    });
    return res.status(201).json({
      meta: {
        code: 201,
        message: "Booking Created Successfully",
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
    const { status, reason } = req.body;
    const booking = await bookingCoach.findOne({
      where: { id },
      include: [
        { model: user, as: "coach" },
        { model: user, as: "user" },
      ],
    });
    if (req.user.id != booking.coachId) {
      return res.status(401).json({
        meta: {
          code: 401,
          message: "Unauthorized",
        },
      });
    }
    if (!booking) {
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Booking not found",
        },
      });
    }
    if (booking.status != "Diajukan") {
      return res.status(400).json({
        meta: {
          code: 400,
          message: `Booking is Already ${booking.status}`,
        },
      });
    }

    let title, message, messageCoach;

    if (status == "approve") {
      message = `Permintaan jadwal latihan Anda telah disetujui oleh Coach ${booking.coach.name}. Latihan dijadwalkan pada tanggal ${new Date(booking.date).toLocaleDateString("id-ID")} pukul ${booking.time.slice(
        0,
        5
      )}. Silahkan datang pada waktu yang telah disetujui.`;
      messageCoach = `Anda telah menyetujui jadwal latihan dengan ${booking.user.name} pada tanggal ${new Date(booking.date).toLocaleDateString("id-ID")} pukul ${booking.time.slice(0, 5)}. Silahkan datang pada waktu yang telah disetujui.`;
    } else if (status == "reject") {
      message = `Permintaan jadwal latihan Anda pada tanggal ${new Date(booking.date).toLocaleDateString("id-ID")} pukul ${booking.time.slice(0, 5)} telah ditolak oleh Coach ${booking.coach.name} dengan alasan: ${reason}`;
      messageCoach = `Anda telah menolak jadwal latihan dengan ${booking.user.name} pada tanggal ${new Date(booking.date).toLocaleDateString("id-ID")} pukul ${booking.time.slice(0, 5)} dengan alasan: ${reason}`;
    } else {
      return res.status(400).json({
        meta: {
          code: 400,
          message: "Status not valid",
        },
      });
    }
    reason ? await booking.update({ status, reason }) : await booking.update({ status });
    await notif.create({
      receiverId: booking.userId,
      bookingCoachId: booking.id,
      message,
    });
    await notif.create({
      receiverId: booking.coachId,
      bookingCoachId: booking.id,
      messageCoach,
    });

    return res.status(200).json({
      meta: {
        code: 200,
        message: "Update booking success",
      },
      data: booking,
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
    const response = await bookingCoach.findOne({
      where: { id },
      include: [
        { model: user, as: "coach" },
        { model: user, as: "user" },
      ],
    });
    if (!response) {
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Booking not found",
        },
      });
    }
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Fetch booking success found",
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

export default { index, store, update, show };
