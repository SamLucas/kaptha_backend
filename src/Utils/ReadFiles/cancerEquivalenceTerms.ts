import knex from '@/database/connection'

interface DRCancerEquivalenceTerms {
  idequivalence_relationship: string;
  equivalence_term: string;
  idterm_descritor: string;
}

export default async function FRCancerEquivalenceTerms (data: DRCancerEquivalenceTerms[]): Promise<void> {
  const dataFilter: DRCancerEquivalenceTerms[] = data.map((dataInfo: DRCancerEquivalenceTerms) =>
    ({
      idequivalence_relationship: dataInfo.idequivalence_relationship,
      equivalence_term: dataInfo.equivalence_term,
      idterm_descritor: dataInfo.idterm_descritor
    }))

  await knex
    .batchInsert('cancerEquivalenceTerms', dataFilter, 1)
    .then((data) => data)
    .catch((err) => console.log(err.stack))
}
