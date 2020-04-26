import knex from '@/database/connection'

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
  const dataFilter: DRTChemicalEquivalenceTerms[] = data.map((dataInfo: DRChemicalEquivalenceTerms) =>
    ({
      idequivalence_relationship: dataInfo.idequivalence_relationship,
      equivalence_term: dataInfo.equivalence_term,
      id_term: dataInfo.idterm_descritor
    }))

  await knex
    .batchInsert('chemicalEquivalenceTerms', dataFilter, 1)
    .then((data) => data)
    .catch((err) => console.log(err.stack))
}
