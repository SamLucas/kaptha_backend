import knex from '@/database/connection'

interface DRChemicalTerms {
  Name: string;
  DrugBankID: string;
  PubChemCompoundID: string;
  WikipediaID: string;
  DrugscomLink: string;
  ChemSpiderID: string;
  MeshID: string;
  idterm_descritor: string;
  term_type_idterm_type: number;
  term_type_mesh: number;
  tree: string;
}

export default async function FRChemicalTerms (data: DRChemicalTerms[]): Promise<void> {
  const dataFilter: DRChemicalTerms[] = data.map((dataInfo: DRChemicalTerms) => ({
    Name: dataInfo.Name,
    DrugBankID: dataInfo.DrugBankID,
    PubChemCompoundID: dataInfo.PubChemCompoundID,
    WikipediaID: dataInfo.WikipediaID,
    DrugscomLink: dataInfo.DrugscomLink,
    ChemSpiderID: dataInfo.ChemSpiderID,
    MeshID: dataInfo.MeshID,
    idterm_descritor: dataInfo.idterm_descritor,
    term_type_idterm_type: dataInfo.term_type_idterm_type,
    term_type_mesh: dataInfo.term_type_mesh,
    tree: dataInfo.tree
  }))

  await knex
    .batchInsert('chemicalTerms', dataFilter, 1)
    .then((data) => data)
    .catch((err) => console.log(err.stack))
}
