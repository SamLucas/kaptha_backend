import knex from '@/database/connection'

interface DRcancerTerms {
  idterm_descritor: number;
  term_type_idterm_type: number;
  term_description: string;
  term_definition: string;
  link_wiki: string;
  term_type_mesh: number;
}

export default async function FRCancerTerms (data: DRcancerTerms[]): Promise<void> {
  const dataFilter: DRcancerTerms[] = data.map((dataInfo: DRcancerTerms) => ({
    idterm_descritor: dataInfo.idterm_descritor || 0,
    term_type_idterm_type: dataInfo.term_type_idterm_type || 0,
    term_description: dataInfo.term_description || '',
    term_definition: dataInfo.term_definition || '',
    link_wiki: dataInfo.link_wiki || '',
    term_type_mesh: dataInfo.term_type_mesh || 0

  }))

  await knex
    .batchInsert('cancerTerms', dataFilter, 1)
    .then((data) => data)
    .catch((err) => console.log(err.stack))
}
