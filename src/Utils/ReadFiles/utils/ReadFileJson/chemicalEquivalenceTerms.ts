import knex from '@/database/connection'
import fs from 'fs'

import { DRIndexPolifenols } from './indexPolifenols'

interface DRChemicalEquivalenceTerms {
  idequivalence_relationship: string;
  equivalence_term: string;
  idterm_descritor: number;
}

interface DRTChemicalEquivalenceTerms {
  idequivalence_relationship: string;
  equivalence_term: string;
  id_term: number;
}

export default async function FRChemicalEquivalenceTerms (data: DRChemicalEquivalenceTerms[]): Promise<void> {
  const file: DRIndexPolifenols[] = JSON
    .parse(fs.readFileSync('./backup/indexPolifenols.json', 'utf8'))

  const dataFilter: DRTChemicalEquivalenceTerms[] = []
  const dataInvalid: DRTChemicalEquivalenceTerms[] = []
  data.forEach((dataInfo: DRChemicalEquivalenceTerms) => {
    if (file.find((ele: DRIndexPolifenols) => ele.id_term === dataInfo.idterm_descritor)) {
      dataFilter.push({
        idequivalence_relationship: dataInfo.idequivalence_relationship,
        equivalence_term: dataInfo.equivalence_term,
        id_term: dataInfo.idterm_descritor
      })
    } else {
      dataInvalid.push({
        idequivalence_relationship: dataInfo.idequivalence_relationship,
        equivalence_term: dataInfo.equivalence_term,
        id_term: dataInfo.idterm_descritor
      })
    }
  })

  // fs.writeFileSync('./chemicalEquivalenceTerms.json', JSON.stringify(dataInvalid))

  await knex
    .batchInsert('chemicalEquivalenceTerms', dataFilter, 1)
    .then((data) => data)
    .catch((err) => console.log(err.stack))
}
