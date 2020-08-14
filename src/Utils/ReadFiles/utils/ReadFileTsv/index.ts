import fs from "fs";
import knex from "@/database/connection";
import { Request, Response } from "express";

const SplitLine = (data: string): string[] =>
  data.split("\t").map((ele) => {
    let newele = ele.replace('"', "");
    newele = newele.replace('"', "");
    newele = newele.replace("\r", "");
    return newele;
  });

// interface ObjetoEntitiesTotal {
//   V1: number;
//   pubtatot_term: string;
//   db_term: string;
//   db_equivalence: string;
//   term_id: string;
//   mesh_id: string;
//   start_pos: number;
//   end_pos: number;
//   entity_type: string;
//   entity_pmid: number;
// }

const ReadFile = async (req: Request, res: Response): Promise<Response> => {
  const { name } = req.body;

  fs.readFile(`./arquivos_tsv/${name}.tsv`, "utf8", async (err, data) => {
    if (err)
      return res
        .status(400)
        .json({ message: "Não foi possivel realizar o cadastro." });

    const lines = data.split("\n");
    const headers = SplitLine(lines[0]);
    const result = [];

    for (let k = 1; k < lines.length - 1; k++) {
      const obj: any = {};
      const currentline = SplitLine(lines[k]);

      for (let j = 0; j < headers.length; j++) {
        if (currentline[j]) {
          obj[headers[j]] = currentline[j];
        } else {
          // console.log(headers[j], j, currentline, k);
        }
      }

      result.push(obj);
    }

    fs.writeFile(
      `./backup/${name}.json`,
      JSON.stringify(result),
      "utf8",
      (data) => {
        return res
          .status(200)
          .json({ message: "Dados cadastrados com sucesso." });
      }
    );
  });
};

export default { ReadFile };
