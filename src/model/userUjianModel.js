import { DataTypes } from "sequelize";
import db from "../database/database.js";

const userUjian = db.define(
  "UserUjian",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false,
    },
    ujianId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false,
    },
    skor: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    attempt: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    mulaiAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    selesaiAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

export default userUjian;
