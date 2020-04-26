import knex from '@/database/connection'

export interface DRIndexPolifenols {
  poliphenol: string;
  id_term: number;
  total_ocorrence: number;
  unique_ocorrence: number;
  pmids: string;
  ration: number;
}

export default async function FRIndexPolifenols (data: DRIndexPolifenols[]): Promise<void> {
  const dataFilter: DRIndexPolifenols[] = data.map((dataInfo: DRIndexPolifenols) => ({
    poliphenol: dataInfo.poliphenol,
    id_term: dataInfo.id_term,
    total_ocorrence: dataInfo.total_ocorrence,
    unique_ocorrence: dataInfo.unique_ocorrence,
    pmids: dataInfo.pmids,
    ration: dataInfo.ration
  }))

  await knex
    .batchInsert('indexPolifenols', dataFilter, 1)
    .then((data) => data)
    .catch((err) => console.log(err.stack))
}
