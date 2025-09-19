import db from "../database/database.js";
import user from "./userModel.js";
import soal from "./soalModel.js";
import ujian from "./ujianModel.js";
import jawabanUjian from "./jawabanUjianModel.js";
import latihan from "./latihanModel.js";
import evaluasi from "./evaluasiModel.js";
import hasilUjian from "./hasilUjianModel.js";
import bookingCoach from "./bookingCoachModel.js";
import notif from "./notifModel.js";
import userLatihan from "./userLatihanModel.js";
import userUjian from "./userUjianModel.js";

ujian.hasMany(soal, { foreignKey: "ujianId", as: "soals", onDelete: "CASCADE" });
soal.belongsTo(ujian, { foreignKey: "ujianId", as: "ujian" });

user.hasMany(jawabanUjian, { foreignKey: "userId" });
jawabanUjian.belongsTo(user, { foreignKey: "userId" });

bookingCoach.belongsTo(user, { foreignKey: "userId", as: "user" });
user.hasMany(bookingCoach, { foreignKey: "userId", as: "userBookings" });

bookingCoach.belongsTo(user, { foreignKey: "coachId", as: "coach" });
user.hasMany(bookingCoach, { foreignKey: "coachId", as: "coachBookings" });

jawabanUjian.belongsTo(soal, { foreignKey: "soalId" });
soal.hasMany(jawabanUjian, { foreignKey: "soalId" });

user.hasMany(hasilUjian, { foreignKey: "userId" });
hasilUjian.belongsTo(user, { foreignKey: "userId" });

ujian.hasMany(hasilUjian, { foreignKey: "ujianId" });
hasilUjian.belongsTo(ujian, { foreignKey: "ujianId" });

user.belongsToMany(latihan, { through: userLatihan, foreignKey: "userId", as: "latihans" });
latihan.belongsToMany(user, { through: userLatihan, foreignKey: "latihanId", as: "users" });

userUjian.hasMany(jawabanUjian, { foreignKey: "userUjianId" });
jawabanUjian.belongsTo(userUjian, { foreignKey: "userUjianId" });

userUjian.belongsTo(ujian, { foreignKey: "ujianId", as: "ujian" });
ujian.hasMany(userUjian, { foreignKey: "ujianId", as: "userUjians" });

user.hasMany(userUjian, { foreignKey: "userId", as: "userUjians" });
userUjian.belongsTo(user, { foreignKey: "userId", as: "user" });

export { db, db as sequelize, ujian, soal, jawabanUjian, latihan, evaluasi, hasilUjian, user, bookingCoach, notif, userLatihan, userUjian };
