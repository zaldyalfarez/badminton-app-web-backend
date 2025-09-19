import { DataTypes } from "sequelize";
import db from "../database/database.js";

const notif = db.define(
  "Notif",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bookingCoachId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
  }
);

export default notif;
