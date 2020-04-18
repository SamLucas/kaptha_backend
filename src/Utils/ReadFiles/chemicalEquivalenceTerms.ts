import knex from '@/database/connection'

interface DRChemicalEquivalenceTerms {
  idequivalence_relationship: string;
  equivalence_term: string;
  idterm_descritor: string;
}

export default function FRCancerEquivalenceTerms (data: DRChemicalEquivalenceTerms[]): void {
  data.forEach((dataInfo: DRChemicalEquivalenceTerms) => {
    const { idequivalence_relationship, equivalence_term, idterm_descritor } = dataInfo

    knex('chemicalEquivalenceTerms').insert({
      idequivalence_relationship,
      equivalence_term,
      idterm_descritor
    })
      .then(data => data)
      .catch(err => console.log(err))
  })
}
