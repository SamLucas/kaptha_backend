import knex from "@/database/connection";
import fs from "fs";
import path from "path";

import { DRArticlesTotal } from "./articlesTotal";
import { handlePagination } from "@/Utils";

interface DRRuleAssociationsExtracted {
  sentence_id: string;
  association_type: string;
  R1: string;
  R2: string;
  R3: string;
  R4: string;
  R5: string;
  R6: string;
  R7: string;
  R8: string;
  R9: string;
  R10: string;
  R11: string;
  R12: string;
  R13: string;
  R14: string;
  R15: string;
  R16: string;
  HM12: string;
  HM3: string;
  HM4: string;
  HM5: string;
  HM6: string;
  HM7: string;
  HM8: string;
  HM9: string;
  HM10: string;
  is_title: string;
  has_entity: string;
  is_association: string;
  start_pos: string;
  end_pos: string;
  sentence: string;
  original_sentence: string;
  pmid: string;
}

export interface DRRuleAssociationsExtractedArray {
  pmid_article: number;
  sentence_id: string;
  association_type: string;
  R1: string;
  R2: string;
  R3: string;
  R4: string;
  R5: string;
  R6: string;
  R7: string;
  R8: string;
  R9: string;
  R10: string;
  R11: string;
  R12: string;
  R13: string;
  R14: string;
  R15: string;
  R16: string;
  HM12: string;
  HM3: string;
  HM4: string;
  HM5: string;
  HM6: string;
  HM7: string;
  HM8: string;
  HM9: string;
  HM10: string;
  is_title: string;
  has_entity: string;
  is_association: string;
  start_pos: string;
  end_pos: string;
  sentence: string;
  original_sentence: string;
}

interface DIds {
  pmid: number;
}

function paginate(array: DRRuleAssociationsExtractedArray[], page_size: number, page_number: number) {
  return array.slice((page_number - 1) * page_size, page_number * page_size);
}


export default async function FRRuleAssociationsExtracted(
  data: DRRuleAssociationsExtracted[]
): Promise<void> {
  const ids: DIds[] = await knex("articlesTotal").select("pmid");

  // const ids: DIds[] = JSON.parse(
  //   fs.readFileSync("./src/Utils/ReadFiles/utils/id_articleTotals.json", "utf8")
  // );

  const dataFilter: DRRuleAssociationsExtractedArray[] = [];

  data.forEach((dataInfo: DRRuleAssociationsExtracted) => {
    if (ids.find((ele: DIds) => ele.pmid === Number(dataInfo.pmid))) {
      dataFilter.push({
        sentence_id: dataInfo.sentence_id,
        association_type: dataInfo.association_type,
        R1: dataInfo.R1,
        R2: dataInfo.R2,
        R3: dataInfo.R3,
        R4: dataInfo.R4,
        R5: dataInfo.R5,
        R6: dataInfo.R6,
        R7: dataInfo.R7,
        R8: dataInfo.R8,
        R9: dataInfo.R9,
        R10: dataInfo.R10,
        R11: dataInfo.R11,
        R12: dataInfo.R12,
        R13: dataInfo.R13,
        R14: dataInfo.R14,
        R15: dataInfo.R15,
        R16: dataInfo.R16,
        HM12: dataInfo.HM12,
        HM3: dataInfo.HM3,
        HM4: dataInfo.HM4,
        HM5: dataInfo.HM5,
        HM6: dataInfo.HM6,
        HM7: dataInfo.HM7,
        HM8: dataInfo.HM8,
        HM9: dataInfo.HM9,
        HM10: dataInfo.HM10,
        is_title: dataInfo.is_title,
        has_entity: dataInfo.has_entity,
        is_association: dataInfo.is_association,
        start_pos: dataInfo.start_pos,
        end_pos: dataInfo.end_pos,
        sentence: dataInfo.sentence,
        original_sentence: dataInfo.original_sentence,
        pmid_article: parseInt(dataInfo.pmid),
      });
    }
  });

  await handlePagination(dataFilter, 20000, "ruleAssociationsExtracted")
}
