import { DataTypes } from "sequelize";
import db from "../database/database.js";

const evaluasi = db.define(
  "Evaluasi",
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
    jawabanUjianId: {
      type: DataTypes.STRING,
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

export default evaluasi;
