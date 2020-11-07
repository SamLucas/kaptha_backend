import knex from "@/database/connection";

export interface DRIndexGene {
  id_polifenol: string;
  polifenol: string;
  id_gene: string;
  gene: string;
  quant: string;
  pmids: string;
}

export default async function FREntitiesTotal(
  data: DRIndexGene[]
): Promise<void> {

  const response = data.map((dataInfo: DRIndexGene) => ({
    id_polifenol: dataInfo.id_polifenol,
    polifenol: dataInfo.polifenol,
    id_gene: dataInfo.id_gene,
    gene: dataInfo.gene,
    quant: dataInfo.quant,
    pmids: dataInfo.pmids,
  }));

  await knex
    .batchInsert("indexGene", response, 1)
    .then((data) => data)
    .catch(console.error);

}
