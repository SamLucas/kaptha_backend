import knex from '@/database/connection'

interface DRCancerEquivalenceTerms {
  idequivalence_relationship: string;
  equivalence_term: string;
  idterm_descritor: string;
}

export default function FRCancerEquivalenceTerms (data: DRCancerEquivalenceTerms[]): void {
  data.forEach((dataInfo: DRCancerEquivalenceTerms) => {
    const { idequivalence_relationship, equivalence_term, idterm_descritor } = dataInfo

    knex('cancerEquivalenceTerms').insert({
      idequivalence_relationship,
      equivalence_term,
      idterm_descritor
    })
      .then(data => data)
      .catch(err => console.log(err))
  })
}
