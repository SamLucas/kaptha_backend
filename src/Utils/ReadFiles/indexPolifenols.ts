import knex from '@/database/connection'

interface DRIndexPolifenols {
  poliphenol: string;
  id_term: number;
  total_ocorrence: number;
  unique_ocorrence: number;
  pmids: string;
  ration: number;
}

export default function FRIndexPolifenols (data: DRIndexPolifenols[]): void {
  data.forEach((dataInfo: DRIndexPolifenols) => {
    const {
      poliphenol,
      id_term,
      total_ocorrence,
      unique_ocorrence,
      pmids,
      ration
    } = dataInfo

    knex('indexPolifenols').insert({
      poliphenol,
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
