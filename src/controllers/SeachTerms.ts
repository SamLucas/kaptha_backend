import { Request, Response } from "express";
import knex from "@/database/connection";

const indexPolifenols = ["chemical_entity_p", "chemical_entity_e"];
const indexCancers = [
  "cancer_type_entity_cell",
  "cancer_type_entity_e",
  "cancer_type_entity_p",
];

const searchTermCancer = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { name, type = "cancer" } = req.query;

  try {

    if (type === "cancer") {
      return await knex("entitiesTotal")
        .distinct()
        .where(function () {
          this.whereRaw(`LOWER(db_equivalence) LIKE ?`, [
            `%${name.toLowerCase()}%`,
          ]);
          this.whereIn("entity_type", indexCancers);
        })
        .select("db_equivalence as label")
        .then((data) => {
          return res.status(200).json(data);
        })
        .catch((err) => {
          console.log(err);
          return res.status(400).json([]);
        });
    } else {
      return await knex("entitiesTotal")
        .distinct()
        .where(function () {
          this.whereRaw(`LOWER(db_equivalence) LIKE ?`, [
            `%${name.toLowerCase()}%`,
          ]);
          this.whereIn("entity_type", indexPolifenols);
        })
        .select("db_equivalence as label", "entity_type")
        .then((data) => {
          return res.status(200).json(data);
        })
        .catch((err) => {
          console.log(err);
          return res.status(400).json([]);
        });
    }
  } catch (err) {
    console.log(err)
    return res.status(400).json([]);
  }
};

export default {
  searchTermCancer,
};
