import { DataTypes } from "sequelize";
import db from "../database/database.js";

const hasilUjian = db.define(
  "HasilUjian",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ujianId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    skor: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

export default hasilUjian;
