import knex from "@/database/connection";

export interface DRGenesTotal {
  genes: string;
  id_term_hgnc: string;
  id_term: string;
  total_ocorrence: number;
  unique_ocorrence: number;
  pmids: string;
  ration: number;
}

export default async function FREntitiesTotal(
  data: DRGenesTotal[]
): Promise<void> {

  const response = data.map((dataInfo: DRGenesTotal) => ({
    genes: dataInfo.genes,
    id_term_hgnc: dataInfo.id_term_hgnc,
    id_term: dataInfo.id_term,
    total_ocorrence: dataInfo.total_ocorrence,
    unique_ocorrence: dataInfo.unique_ocorrence,
    pmids: dataInfo.pmids,
    ration: dataInfo.ration,
  }));

  await knex
    .batchInsert("genesTotal", response, 1)
    .then((data) => data)
    .catch(console.error);

}
