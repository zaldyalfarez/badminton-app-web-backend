import { DataTypes } from "sequelize";
import db from "../database/database.js";

const soal = db.define(
  "Soal",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ujianId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    question: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    video: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    optionA: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    optionB: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    optionC: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    optionD: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    answer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

export default soal;
