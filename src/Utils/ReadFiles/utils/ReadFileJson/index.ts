import { Request, Response } from "express";
import fs from "fs";

import FRIndexCancers from "@/Utils/ReadFiles/utils/ReadFileJson/indexCancers";
import FRCancerEquivalenceTerms from "@/Utils/ReadFiles/utils/ReadFileJson/cancerEquivalenceTerms";
import FRChemicalEquivalenceTerms from "@/Utils/ReadFiles/utils/ReadFileJson/chemicalEquivalenceTerms";
import FRIndexPolifenols from "@/Utils/ReadFiles/utils/ReadFileJson/indexPolifenols";
import FRArticlesTotal from "@/Utils/ReadFiles/utils/ReadFileJson/articlesTotal";
import FRRuleAssociationsExtracted from "@/Utils/ReadFiles/utils/ReadFileJson/ruleAssociationsExtracted";
import FRCancerTerms from "@/Utils/ReadFiles/utils/ReadFileJson/cancerTerms";
import FRChemicalTerms from "@/Utils/ReadFiles/utils/ReadFileJson/chemicalTerms";
import FREntitiesTotal from "@/Utils/ReadFiles/utils/ReadFileJson/entitiesTotal";

const FuctionsArray = [
  FRIndexCancers,
  FRCancerEquivalenceTerms,
  FRChemicalEquivalenceTerms,
  FRIndexPolifenols,
  FRArticlesTotal,
  FRRuleAssociationsExtracted,
  FRCancerTerms,
  FRChemicalTerms,
  FREntitiesTotal,
];

const IndexFunctions = {
  cancerTerms: 6, // 491 registros
  indexCancers: 0, // 239 registros
  chemicalTerms: 7, // 7.894 registros
  articlesTotal: 4, // 42.548 registros
  indexPolifenols: 3, // 2.006 registros
  entitiesTotal: 8, // 528.500 registros
  cancerEquivalenceTerms: 1, // 6.854 registros
  chemicalEquivalenceTerms: 2, // 6.594 registros
  ruleAssociationsExtracted: 5, // 104.016 registros
};

const store = async (req: Request, res: Response): Promise<Response> => {
  const { name, page } = req.body;

  const nameFile = `${name}${page ? "-" + page : ""}`;

  fs.readFile(`./backup/${nameFile}.json`, "utf8", async (err, data) => {
    if (err) {
      return res
        .status(401)
        .json({ message: "Arquivo não encontrado ou nome invalido." });
    }

    const file = JSON.parse(data);

    const keyIndexFunctions: keyof typeof IndexFunctions = name;
    const index = IndexFunctions[keyIndexFunctions];

    await FuctionsArray[index](file);

    return res.json({
      message: `Dados inseridos com sucesso! (${nameFile} - ${file.length} registros)`,
    });
  });
};

export default { store };
