import knex from '@/database/connection'

interface DRIndexCancers {
  cancer: string;
  id_term: number;
  total_ocorrence: number;
  unique_ocorrence: number;
  pmids: string;
  ration: number;
}

export default function FRIndexCancers (data: DRIndexCancers[]): void {
  data.forEach((dataInfo: DRIndexCancers) => {
    const {
      cancer,
      id_term,
      total_ocorrence,
      unique_ocorrence,
      pmids,
      ration
    } = dataInfo

    knex('indexCancers').insert({
      cancer,
      id_term,
      total_ocorrence,
      unique_ocorrence,
      pmids,
      ration
    })
      .then(data => data)
      .catch(err => console.log(err))
  })
}
