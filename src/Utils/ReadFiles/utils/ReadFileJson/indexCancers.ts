import knex from "@/database/connection";

export interface DRIndexCancers {
  cancer: string;
  id_term: number;
  total_ocorrence: number;
  unique_ocorrence: string;
  pmids: string;
  ration: number;
}

export default async function FRIndexCancers(
  data: DRIndexCancers[]
): Promise<void> {
  const dataFilter: DRIndexCancers[] = [];
  data.forEach(
    (dataInfo: DRIndexCancers) =>
      dataInfo.id_term &&
      dataInfo.ration &&
      dataFilter.push({
        cancer: dataInfo.cancer,
        id_term: dataInfo.id_term,
        total_ocorrence: dataInfo.total_ocorrence,
        unique_ocorrence: dataInfo.unique_ocorrence,
        pmids: dataInfo.pmids,
        ration: dataInfo.ration,
      })
  );

  await knex
    .batchInsert("indexCancers", dataFilter, 1)
    .then((data) => data)
    .catch((err) => console.log(err.stack));
}
