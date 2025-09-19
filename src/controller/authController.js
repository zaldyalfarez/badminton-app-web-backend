import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { user } from "../model/index.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import { config } from "../config/config.js";
import { Op } from "sequelize";

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exist = await user.findOne({ where: { email } });
    if (exist) {
      return res.status(400).json({
        meta: {
          code: 400,
          message: "Email already exist",
        },
      });
    }
    const image = "https://avatar.iran.liara.run/username?username=" + name.replace(/\s+/g, "");

    const userRegister = await user.create({
      name,
      email,
      password,
      image,
      role: "user",
    });
    const { password: _, ...userWithoutPassword } = userRegister.get({ plain: true });

    const token = jwt.sign({ id: userRegister.id, name: userRegister.name, email: userRegister.email, role: userRegister.role }, process.env.JWT_SECRET, {
      expiresIn: config.app.expireIn,
    });

    return res.status(200).json({
      meta: {
        code: 200,
        message: "Register Success.",
      },
      data: {
        userWithoutPassword,
        token,
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

const verification = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const response = await user.findOne({ where: { email } });

    if (!response) {
      return res.status(404).json({
        meta: {
          code: 404,
          message: "User not found",
        },
      });
    }

    if (response.verified) {
      return res.status(400).json({
        meta: {
          code: 400,
          message: "User already verified",
        },
      });
    }

    if (response.otp !== otp) {
      return res.status(400).json({
        meta: {
          code: 400,
          message: "OTP is invalid",
        },
      });
    }

    if (response.otpExpiredAt < new Date()) {
      return res.status(400).json({
        meta: {
          code: 400,
          message: "OTP is expired",
        },
      });
    }

    response.verified = true;
    response.otp = null;
    response.otpExpiredAt = null;
    await response.save();

    return res.status(200).json({
      meta: {
        code: 200,
        message: "Verification Success",
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

const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const response = await user.findOne({ where: { email } });

    if (!response) {
      return res.status(404).json({
        meta: {
          code: 404,
          message: "User not found",
        },
      });
    }

    if (response.verified) {
      return res.status(400).json({
        meta: {
          code: 400,
          message: "User already verified",
        },
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiredAt = new Date(Date.now() + 3 * 60 * 1000);

    response.otp = otp;
    response.otpExpiredAt = otpExpiredAt;
    await response.save();

    const emailHtml = `<p>Hai ${email},</p>
    <p>OTP baru kamu adalah: <strong>${otp}</strong></p>
    <p>OTP berlaku selama 1 menit.</p>`;

    await sendEmail(email, "Verifikasi Ulang Email", emailHtml);

    return res.status(200).json({
      meta: {
        code: 200,
        message: "Resend OTP Success",
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

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userLogin = await user.findOne({ where: { email } });
    if (!userLogin) {
      return res.status(404).json({
        meta: {
          code: 404,
          message: "User not found",
        },
      });
    }
    const isMatch = await bcrypt.compare(password, userLogin.password);
    if (!isMatch) {
      return res.status(401).json({
        meta: {
          code: 401,
          message: "email or password is invalid ",
        },
      });
    }
    const { id, name, role } = userLogin;
    const token = jwt.sign({ id, name, email: userLogin.email, role }, process.env.JWT_SECRET, {
      expiresIn: config.app.expireIn,
    });
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Login Success",
      },
      data: { userLogin, token },
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

const resetPassword = async (req, res) => {
  try {
    const { forgotToken, password } = req.body;
    const userReset = await user.findOne({ where: { forgotToken, forgotTokenExpiredAt: { [Op.gt]: new Date() } } });

    if (!userReset) {
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Token Invalid or Expired",
        },
      });
    }

    userReset.password = password;
    userReset.forgotToken = null;
    userReset.forgotTokenExpiredAt = null;
    await userReset.save();

    return res.status(200).json({
      meta: {
        code: 200,
        message: "Reset Password Success",
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

const sendResetPassword = async (req, res) => {
  try {
    console.log("Body : ", req.body);
    const { email } = req.body;
    const userReset = await user.findOne({ where: { email } });
    if (!userReset) {
      return res.status(404).json({
        meta: {
          code: 404,
          message: "User not found",
        },
      });
    }
    const forgotToken = crypto.randomBytes(20).toString("hex");
    const forgotTokenExpiredAt = new Date(Date.now() + 10 * 60 * 1000);
    userReset.forgotToken = forgotToken;
    userReset.forgotTokenExpiredAt = forgotTokenExpiredAt;
    await userReset.save();
    const resetLink = `http://${process.env.CLIENT_URL}?token=${forgotToken}`;
    const emailHtml = `<p>Hai ${email},</p>
    <p>Klik link ini untuk mereset password kamu: <a href="${resetLink}">Reset Password</a></p>
    <p>Link ini berlaku selama 10 menit.</p>`;
    await sendEmail(email, "Reset Password", emailHtml);
    return res.status(200).json({
      meta: {
        code: 200,
        message: "Link Reset Password Telah dikirim ke Email Anda",
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

export default {
  register,
  verification,
  resendVerification,
  login,
  resetPassword,
  sendResetPassword,
};
