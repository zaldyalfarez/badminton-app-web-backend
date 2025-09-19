import { Router } from "express";
import authController from "../controller/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import ujianController from "../controller/ujianController.js";
import ujianMiddleware from "../middleware/ujianMiddleware.js";
import soalController from "../controller/soalController.js";
import soalMiddleware from "../middleware/soalMiddleware.js";
import jawabanUjianController from "../controller/jawabanUjianController.js";
import jawabanUjianMiddleware from "../middleware/jawabanUjianMiddleware.js";
import latihanController from "../controller/latihanController.js";
import latihanMiddleware from "../middleware/latihanMiddleware.js";
import bookCoachController from "../controller/bookCoachController.js";
import bookCoachMiddleware from "../middleware/bookCoachMiddleware.js";
import userController from "../controller/userController.js";
import userMiddleware from "../middleware/userMiddleware.js";
import notifController from "../controller/notifController.js";
import userUjianController from "../controller/userUjianController.js";
import userUjianMiddleware from "../middleware/userUjianMiddleware.js";
import searchController from "../controller/searchController.js";
import searchMiddleware from "../middleware/searchMiddleware.js";

const router = Router();

router.use((req, res, next) => {
  if (req.path === "/login" || req.path === "/register" || req.path === "/verification" || req.path === "/resend-verification" || req.path === "/reset-password" || req.path === "/forgot-password") return next();
  authMiddleware.validateToken(req, res, next);
});

router.post("/register", authMiddleware.register, authController.register);
router.post("/verification", authController.verification);
router.post("/resend-verification", authController.resendVerification);
router.post("/login", authMiddleware.login, authController.login);
router.post("/forgot-password", authController.sendResetPassword);
router.post("/reset-password", authController.resetPassword);

router.get("/user", userController.index);
router.post("/user", userMiddleware.store, userController.store);
router.get("/user/:id", userMiddleware.show, userController.show);
router.put("/user/coach/update/:id", userMiddleware.updateCoach, userController.updateCoach);
router.delete("/user/coach/delete/:id", userMiddleware.deleteCoach, userController.deleteCoach);

router.put("/profile/update/:id", userMiddleware.update, userController.update);

router.get("/user/notif", notifController.index);
router.get("/user/notif/:id", notifController.show);
router.put("/user/notif/update/:id", notifController.update);

router.get("/ujian", ujianController.index);
router.post("/ujian", ujianMiddleware.store, ujianController.store);
router.get("/ujian/:id", ujianController.show);
router.put("/ujian/update/:id", ujianMiddleware.update, ujianController.update);
router.delete("/ujian/delete/:id", ujianController.deleteUjian);
router.post("/ujian/iscompleted", ujianMiddleware.ujianIsCompleted, ujianController.ujianIsCompleted);

router.get("/soal", soalController.index);
router.post("/soal", soalMiddleware.store, soalController.store);
router.get("/soal/ujian/:id", soalController.getAllSoalByUjianId); //ujianid
router.get("/soal/:id", soalController.show);
router.put("/soal/update/:id", soalMiddleware.update, soalController.update);
router.delete("/soal/delete/:id", soalController.deleteSoal);

router.get("/latihan", latihanController.index);
router.post("/latihan", latihanMiddleware.store, latihanController.store);
router.put("/latihan/update/:id", latihanMiddleware.update, latihanController.update);
router.get("/latihan/:id", latihanController.show);
router.post("/latihan/iscompleted", latihanMiddleware.latihanIsCompleted, latihanController.latihanIsCompleted);
router.get("/latihan/get/kategori", latihanController.getKategori);
router.delete("/latihan/delete/:id", latihanMiddleware.deleteLatihan, latihanController.deleteLatihan);

router.get("/Booking", bookCoachMiddleware.index, bookCoachController.index);
router.get("/Booking/:id", bookCoachMiddleware.show, bookCoachController.show);
router.post("/Booking", bookCoachMiddleware.store, bookCoachController.store);
router.put("/Booking/update/:id", bookCoachMiddleware.update, bookCoachController.update);

router.post("/start-ujian", jawabanUjianMiddleware.startUjian, jawabanUjianController.startUjian);
router.post("/answer", jawabanUjianMiddleware.store, jawabanUjianController.store);
router.post("/submit-ujian", jawabanUjianMiddleware.submitUjian, jawabanUjianController.submitUjian);

router.get("/history", userUjianMiddleware.index, userUjianController.index);
router.get("/statistik", userUjianMiddleware.show, userUjianController.show);
router.get("/score/:id", userUjianMiddleware.getScore, userUjianController.getScore);

router.get("/latihan-ujian", searchMiddleware.index, searchController.index);

export default router;
