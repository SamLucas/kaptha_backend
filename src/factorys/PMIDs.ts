import EntitiesInterface from '@/interfaces/Entities'

import { Redirect, ClassificartionGene } from '@/Utils/EntitiesRedirect';

import _ from 'lodash'

function PMIDs() {

  function _getPMIDs(data: EntitiesInterface[]) {

    const termsSearchPmid = [...new Set(data.map((ele) => ele.term_id))];

    const dataTermsCancer: String[] = []
    const dataTermsPolifenols: String[] = []

    const dataTermsGeneHGNC: String[] = []
    const dataTermsGeneEntitie: String[] = []

    data.forEach(ele => {

      const { entity_type, term_id } = ele
      const indexEntite: keyof typeof Redirect = entity_type as ClassificartionGene
      const typeEntitie = Redirect[indexEntite]

      if (typeEntitie === "indexCancers") dataTermsCancer.push(term_id)
      else if (typeEntitie === "indexPolifenols") dataTermsPolifenols.push(term_id)
      else {
        if (entity_type === "gene_hgnc_entity") dataTermsGeneHGNC.push(term_id)
        else dataTermsGeneEntitie.push(term_id)
      }
    })

    return {
      termsSearchPmid,
      dataTermsCancer: [...new Set(dataTermsCancer)],
      dataTermsPolifenols: [...new Set(dataTermsPolifenols)],
      dataTermsGeneHGNC: [...new Set(dataTermsGeneHGNC)],
      dataTermsGeneEntitie: [...new Set(dataTermsGeneEntitie)],
    }
  }

  function _makeInterception(
    articlesPolifenols: { pmids: String; },
    articlesCancer: { pmids: String; },
    articlesGeneEntitie: { pmids: String; },
    articlesGeneHGNC: { pmids: String; }
  ) {

    let termsIdsOne: String[] = [];
    let termsIdsTwo: String[] = [];
    let termsIdsThere: String[] = [];

    if (articlesPolifenols) {
      const pmidsSplit = articlesPolifenols.pmids.split(",");
      termsIdsOne = [...new Set([...pmidsSplit, ...termsIdsOne])];
    }

    if (articlesCancer) {
      const pmidsSplit = articlesCancer.pmids.split(",");
      termsIdsTwo = [...new Set([...pmidsSplit, ...termsIdsTwo])];
    }

    if (articlesGeneEntitie) {
      const pmidsSplit = articlesGeneEntitie.pmids.split(",");
      termsIdsThere = [...new Set([...pmidsSplit, ...termsIdsThere])];
    }

    if (articlesGeneHGNC) {
      const pmidsSplit = articlesGeneHGNC.pmids.split(",");
      termsIdsThere = [...new Set([...pmidsSplit, ...termsIdsThere])];
    }

    if (termsIdsOne.length > 0 && termsIdsTwo.length > 0)
      return _.intersection(termsIdsOne, termsIdsTwo)

    else if (termsIdsOne.length > 0 && termsIdsTwo.length > 0)
      return _.intersection(termsIdsOne, termsIdsThere)

    else return [...termsIdsOne, ...termsIdsTwo, ...termsIdsThere]
  }

  function typeConsult(
    dataSearchPolyphenol: String,
    dataSearchChemical: String,
    dataSearchGene: String
  ) {

    if (dataSearchPolyphenol && dataSearchChemical) return "PC"
    else if (dataSearchPolyphenol && dataSearchGene) return "PG"
    else if (dataSearchPolyphenol) return "P"
    else if (dataSearchChemical) return "C"
    else return "G"
  }

  return {
    _getPMIDs,
    _makeInterception,
    typeConsult
  }
}

export default PMIDs()