import { latihan, user, ujian } from "../../model/index.js";
import db from "../database.js";

const seeder = async () => {
  try {
    await db.sync({ force: true });

    console.log("Seeder Akun Admin");
    const adminSeed = await user.create({
      name: "Admin",
      email: "admin@gmail.com",
      password: "admin",
      role: "admin",
      verified: true,
    });
    if (adminSeed) console.log("Seeder Admin Account Success");

    console.log("Seeder Akun User");
    const userSeed = await user.create({
      name: "User",
      email: "user@gmail.com",
      password: "user",
      role: "user",
      verified: true,
    });
    if (userSeed) console.log("Seeder User Account Success");

    console.log("Seeder Akun Coach");
    const coachSeed = await user.create({
      name: "Coach",
      email: "coach@gmail.com",
      password: "coach",
      role: "coach",
      verified: true,
    });
    if (coachSeed) console.log("Seeder Coach Account Success");

    const latihanSeed = await latihan.bulkCreate([
      {
        name: "Latihan 1",
        durasi: 60,
        kategori: "Pegangan Raket",
        deskripsi: "Latihan 1 Deskripsi",
        video: "https://www.youtube.com/watch?v=wuEzAX0N2mg",
        ar: true,
      },
      {
        name: "Latihan 2",
        durasi: 60,
        kategori: "Pegangan Raket",
        deskripsi: "Latihan 2 Deskripsi",
        video: "https://www.youtube.com/watch?v=wuEzAX0N2mg",
        ar: false,
      },
      {
        name: "Latihan 3",
        durasi: 60,
        kategori: "Kaki",
        deskripsi: "Latihan 3 Deskripsi",
        video: "https://www.youtube.com/watch?v=wuEzAX0N2mg",
        ar: true,
      },
      {
        name: "Latihan 4",
        durasi: 60,
        kategori: "Kaki",
        deskripsi: "Latihan 4 Deskripsi",
        video: "https://www.youtube.com/watch?v=wuEzAX0N2mg",
        ar: false,
      },
    ]);
    if (latihanSeed) console.log("Seeder Latihan Success");

    const ujianSeed = await ujian.bulkCreate([
      {
        name: "Ujian 1",
        level: "Mudah",
        durasi: 300,
      },
      {
        name: "Ujian 2",
        level: "Normal",
        durasi: 600,
      },
      {
        name: "Ujian 3",
        level: "Sulit",
        durasi: 900,
      },
    ]);
    if (ujianSeed) console.log("Seeder Ujian Success");
  } catch (error) {
    console.error("Seeder Error:", error);
  } finally {
    await db.close();
  }
};

seeder();
