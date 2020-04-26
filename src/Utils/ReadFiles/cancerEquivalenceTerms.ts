import knex from '@/database/connection'

import { DRIndexCancers } from './indexCancers'
import fs from 'fs'

interface DRCancerEquivalenceTerms {
  idequivalence_relationship: string;
  equivalence_term: string;
  idterm_descritor: number;
}

interface DRTCancerEquivalenceTerms {
  idequivalence_relationship: string;
  equivalence_term: string;
  id_term: number;
}

export default async function FRCancerEquivalenceTerms (data: DRCancerEquivalenceTerms[]): Promise<void> {
  const file: DRIndexCancers[] = JSON.parse(fs.readFileSync('./backup/indexCancers.json', 'utf8'))

  const dataFilter: DRTCancerEquivalenceTerms[] = []
  data.forEach((dataInfo: DRCancerEquivalenceTerms) => {
    if (file.find((ele: DRIndexCancers) => ele.id_term === dataInfo.idterm_descritor)) {
      dataFilter.push({
        idequivalence_relationship: dataInfo.idequivalence_relationship || '',
        equivalence_term: dataInfo.equivalence_term || '',
        id_term: dataInfo.idterm_descritor
      })
      console.log(dataInfo)
    } else {
    }
  })

  await knex
    .batchInsert('cancerEquivalenceTerms', dataFilter, 1)
    .then((data) => data)
    .catch((err) => console.log(err))
}
