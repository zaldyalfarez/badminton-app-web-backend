import { ujian, latihan, user, sequelize } from "../model/index.js";
import { Op } from "sequelize";

const index = async (req, res) => {
  try {
    const { name, kategori } = req.query;

    const latihanWhere = {};
    if (name && name !== "null") {
      latihanWhere.name = { [Op.iLike]: `%${name}%` };
    }
    if (kategori && kategori !== "null") {
      latihanWhere.kategori = kategori;
    }

    const latihans = await latihan.findAll({
      where: latihanWhere,
      attributes: {
        include: [
          [
            sequelize.literal(`(
          SELECT 
            CASE 
              WHEN EXISTS (
                SELECT 1 FROM "UserLatihans"
                WHERE "UserLatihans"."latihanId" = "Latihan"."id"
                  AND "UserLatihans"."userId" = '${req.user.id}'
                  AND "UserLatihans"."isCompleted" = true
              )
              THEN true
              ELSE false
            END
        )`),
            "isCompleted",
          ],
        ],
      },
      order: [["id", "ASC"]],
    });

    let ujians = [];
    if (!kategori || kategori === "null") {
      const ujianWhere = {};
      if (name && name !== "null") {
        ujianWhere.name = { [Op.iLike]: `%${name}%` };
      }
      ujians = await ujian.findAll({
        where: ujianWhere,
        attributes: {
          include: [
            [
              sequelize.literal(`(
          SELECT 
            CASE 
              WHEN EXISTS (
                SELECT 1 FROM "UserUjians"
                WHERE "UserUjians"."ujianId" = "Ujian"."id"
                  AND "UserUjians"."userId" = '${req.user.id}'
                  AND "UserUjians"."isCompleted" = true
              )
              THEN true
              ELSE false
            END
        )`),
              "isCompleted",
            ],
          ],
        },
        order: [["id", "ASC"]],
      });
    }

    const response = {
      latihan: latihans,
      ujian: ujians,
    };

    if (latihans.length === 0 && ujians.length === 0) {
      return res.status(404).json({
        meta: {
          code: 404,
          message: "Latihan and Ujian not found",
        },
      });
    }

    return res.status(200).json({
      meta: {
        code: 200,
        message: "Successfully fetched latihan and ujian",
      },
      data: response,
    });
  } catch (error) {
    return res.status(500).json({
      meta: {
        code: 500,
        message: error.message,
      },
    });
  }
};

export default { index };
