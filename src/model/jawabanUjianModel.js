import { DataTypes } from "sequelize";
import db from "../database/database.js";

const jawabanUjian = db.define(
  "jawabanUjian",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userUjianId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    soalId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    answer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isTrue: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
  }
);

export default jawabanUjian;
