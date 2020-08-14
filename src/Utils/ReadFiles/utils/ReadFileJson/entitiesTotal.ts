import knex from "@/database/connection";
import fs from "fs";

export interface DREntitiesTotal {
  V1: number;
  pubtatot_term: string;
  db_term: string;
  db_equivalence: string;
  term_id: string;
  mesh_id: string;
  start_pos: number;
  end_pos: number;
  entity_type: string;
  entity_pmid: number;
}

export default async function FREntitiesTotal(
  data: DREntitiesTotal[]
): Promise<void> {
  const dataFilterPmidRepeat: string[] = [];
  const dataFilter: DREntitiesTotal[] = [];

  data.forEach((dataInfo: DREntitiesTotal) => {
    const start = [];
    const end = [];

    if (!dataFilterPmidRepeat.find((ele) => ele === dataInfo.entity_pmid)) {
      data.forEach((element) => {
        if (element.entity_pmid === dataInfo.entity_pmid) {
          start.push(element.start_pos);
          end.push(element.end_pos);
        }
      });

      dataFilterPmidRepeat.push(dataInfo.entity_pmid);

      dataFilter.push({
        V1: dataInfo.V1,
        pubtatot_term: dataInfo.pubtatot_term,
        db_term: dataInfo.db_term,
        db_equivalence: dataInfo.db_equivalence,
        term_id: dataInfo.term_id,
        mesh_id: dataInfo.mesh_id,
        start_pos: start,
        end_pos: end,
        entity_type: dataInfo.entity_type,
        entity_pmid: dataInfo.entity_pmid,
      });
    }
  });

  await knex
    .batchInsert("entitiesTotal", dataFilter, 1)
    .then((data) => data)
    .catch(console.error);
}
