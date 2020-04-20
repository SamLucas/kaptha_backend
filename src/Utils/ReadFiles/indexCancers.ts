import knex from '@/database/connection'

interface DRIndexCancers {
  cancer: string;
  id_term: number;
  total_ocorrence: number;
  unique_ocorrence: number;
  pmids: string;
  ration: number;
}

export default async function FRIndexCancers (data: DRIndexCancers[]): Promise<void> {
  const dataFilter: DRIndexCancers[] = data.map((dataInfo: DRIndexCancers) => ({
    cancer: dataInfo.cancer,
    id_term: dataInfo.id_term,
    total_ocorrence: dataInfo.total_ocorrence,
    unique_ocorrence: dataInfo.unique_ocorrence,
    pmids: dataInfo.pmids,
    ration: dataInfo.ration

  }))

  await knex
    .batchInsert('indexCancers', dataFilter, 1)
    .then((data) => data)
    .catch((err) => console.log(err.stack))
}
