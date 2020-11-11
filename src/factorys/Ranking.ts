import RuleInterface from "@/interfaces/Rules"
import EntitiesInterface from "@/interfaces/Entities"

import {
  calc_peso_gene,
  calc_peso_polifenol,
  calc_peso_polifenol_cancer,
  calc_peso_polifenol_gene
} from '@/Utils/CalcPesoRules'

import { ClassificartionGene, Redirect } from '@/Utils/EntitiesRedirect'

function Rakend() {

  function filterSearchEntities(
    entities: EntitiesInterface[],
    rule: RuleInterface,
    termsSearchPmid: String[] = []
  ) {

    const startRule = parseInt(rule.start_pos)
    const endRule = parseInt(rule.end_pos)

    const entity_sentence_other_cancers = entities.filter(
      (eleEnites) => {
        const nameEntitie: keyof typeof Redirect = eleEnites.entity_type as ClassificartionGene
        return eleEnites.term_id === "10007" &&
          eleEnites.entity_pmid == rule.pmid_article &&
          eleEnites.start_pos >= startRule && eleEnites.end_pos <= endRule &&
          Redirect[nameEntitie] === "indexCancers"
      }
    );

    const entity_sentence_cancer = entities.filter(
      (eleEnites) => {
        const nameEntitie: keyof typeof Redirect = eleEnites.entity_type as ClassificartionGene
        return eleEnites.entity_pmid == rule.pmid_article &&
          eleEnites.start_pos >= startRule && eleEnites.end_pos <= endRule &&
          Redirect[nameEntitie] === "indexCancers"
      }
    );

    const entity_sentence_polifenol = entities.filter(
      (eleEnites) => {

        const nameEntitie: keyof typeof Redirect = eleEnites.entity_type as ClassificartionGene
        const response = termsSearchPmid.find((term) => eleEnites.term_id === term)

        return response && parseInt(response as string) > 0 &&
          eleEnites.entity_pmid == rule.pmid_article &&
          eleEnites.start_pos >= startRule && eleEnites.end_pos <= endRule &&
          Redirect[nameEntitie] === "indexPolifenols"
      }
    );

    const entity_sentence_genes = entities.filter(
      (eleEnites) => {
        const nameEntitie: keyof typeof Redirect = eleEnites.entity_type as ClassificartionGene
        return eleEnites.entity_pmid == rule.pmid_article &&
          eleEnites.start_pos >= startRule && eleEnites.end_pos <= endRule &&
          Redirect[nameEntitie] === "indexGene"
      }
    );

    const ArrayEttiesAux = [
      ...entity_sentence_other_cancers,
      ...entity_sentence_cancer,
      ...entity_sentence_polifenol,
      ...entity_sentence_genes
    ]

    const entitiesRules = ArrayEttiesAux.filter((a, b) => ArrayEttiesAux.indexOf(a) === b)

    return {
      entity_sentence_other_cancers,
      entity_sentence_cancer,
      entity_sentence_polifenol,
      entity_sentence_genes,
      entitiesRules,
    }
  }


  function weightCalculationInSentences(
    entity_sentence_polifenol: EntitiesInterface[],
    entity_sentence_cancer: EntitiesInterface[],
    entity_sentence_other_cancers: EntitiesInterface[],
    entity_sentence_genes: EntitiesInterface[],
    rule: RuleInterface
  ) {

    let peso_genes = 0
    let peso_frase = 0

    if (
      entity_sentence_polifenol.length > 0 &&
      entity_sentence_cancer.length > 0
    ) {
      peso_genes = calc_peso_polifenol_gene(rule);
      peso_frase = calc_peso_polifenol_cancer(rule);
    } else if (entity_sentence_polifenol.length > 0 &&
      entity_sentence_other_cancers.length > 0) {
      peso_genes = calc_peso_polifenol_gene(rule);
      peso_frase = calc_peso_polifenol(rule)
    }
    else if (entity_sentence_polifenol.length > 0) {
      peso_genes = calc_peso_polifenol_gene(rule);
      peso_frase = calc_peso_polifenol(rule)
    } else if (entity_sentence_cancer) {
      peso_genes = 0
      peso_frase = calc_peso_polifenol(rule)
    }
    else if (entity_sentence_other_cancers.length > 0) {
      peso_genes = 0
      peso_frase = calc_peso_gene(rule)
    }
    else if (entity_sentence_genes.length > 0) {
      peso_genes = calc_peso_polifenol_gene(rule)
      peso_frase = calc_peso_polifenol(rule)
    }

    return { peso_genes, peso_frase }
  }

  function weigthCalculationEntities(
    entities: EntitiesInterface[],
    termsSearchPmid: String[],
    Id: String,
  ) {

    const termId = parseInt(Id as string)

    const peso_entities_other_cancers = entities.filter(
      (eleEnites) => {
        const nameEntitie: keyof typeof Redirect = eleEnites.entity_type as ClassificartionGene
        return eleEnites.term_id === "10007" &&
          eleEnites.entity_pmid === termId &&
          Redirect[nameEntitie] === "indexCancers"
      }
    );

    const peso_entities_cancer = entities.filter(
      (eleEnites) => {
        const nameEntitie: keyof typeof Redirect = eleEnites.entity_type as ClassificartionGene
        return termsSearchPmid.find((term) => eleEnites.term_id === term) &&
          eleEnites.entity_pmid == termId &&
          Redirect[nameEntitie] === "indexCancers"
      }
    );

    const peso_entities_polifenol = entities.filter(
      (eleEnites) => {
        const nameEntitie: keyof typeof Redirect = eleEnites.entity_type as ClassificartionGene
        return termsSearchPmid.find((term) => eleEnites.term_id === term) &&
          eleEnites.entity_pmid == termId &&
          Redirect[nameEntitie] === "indexPolifenols"
      }
    );

    const peso_entities_geness = entities.filter(
      (eleEnites) => {
        const nameEntitie: keyof typeof Redirect = eleEnites.entity_type as ClassificartionGene
        return eleEnites.entity_pmid == termId &&
          Redirect[nameEntitie] === "indexGene"
      }
    );

    return peso_entities_other_cancers.length +
      peso_entities_cancer.length +
      peso_entities_polifenol.length +
      peso_entities_geness.length;

  }

  return {
    filterSearchEntities,
    weightCalculationInSentences,
    weigthCalculationEntities
  }
}

export default Rakend()