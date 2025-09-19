import dotenv from "dotenv";

dotenv.config();

export const config = {
  app: {
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV,
    jwt: process.env.JWT_SECRET,
    expireIn: process.env.JWT_EXPIRE_IN,
  },
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    dialect: "postgres",
  },
  mail: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
  },
};
