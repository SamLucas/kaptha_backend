import { Request, Response } from "express";
import knex from "@/database/connection";

const indexPolifenols = ["chemical_entity_p", "chemical_entity_e"];
const indexGene = ["gene_entity", "gene_hgnc_entity"];
const indexCancers = [
  "cancer_type_entity_cell",
  "cancer_type_entity_e",
  "cancer_type_entity_p",
];

const searchTermCancer = async (req: Request, res: Response): Promise<Response> => {
  const { name = "", type = "cancer" } = req.query;

  const TypeConsult = type as String
  const NameEntitie = name as String

  let entity: String[] = []

  if (TypeConsult.toLowerCase() === "cancer") entity = indexCancers
  else if (TypeConsult.toLowerCase() === "gene") entity = indexGene
  else if (TypeConsult.toLowerCase() === "polifenol") entity = indexPolifenols

  return await knex("entitiesTotal")
    .distinct()
    .where(function () {
      this.whereRaw(`LOWER(db_equivalence) LIKE ?`, [
        `%${NameEntitie.toLowerCase()}%`,
      ]);
      this.whereRaw(`LOWER(db_term) LIKE ?`, [
        `%${NameEntitie.toLowerCase()}%`,
      ]);
      this.whereIn("entity_type", entity);
    })
    .select(["db_equivalence as label", "db_term as labelTerm"])
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json([]);
    });
};

export default {
  searchTermCancer,
};
