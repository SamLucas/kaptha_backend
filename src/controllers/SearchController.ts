import { Request, Response } from 'express'
import knex from '@/database/connection'

import { DRRuleAssociationsExtractedArray } from '@/Utils/ReadFiles/utils/ReadFileJson/ruleAssociationsExtracted'

const CPesoPouC1_10 = (rule: DRRuleAssociationsExtractedArray) => {
  let pesoTotal = 0
  pesoTotal += rule.R2[0].split('sim').length > 0 ? 1 : 0
  pesoTotal += rule.R3[0].split('sim').length > 0 ? 1 : 0
  pesoTotal += rule.R4[0].split('sim').length > 0 ? 1 : 0
  pesoTotal += rule.R5[0].split('sim').length > 0 ? 1 : 0
  pesoTotal += rule.R6[0].split('sim').length > 0 ? 1 : 0
  pesoTotal += rule.R8[0].split('sim').length > 0 ? 1 : 0
  pesoTotal += rule.R9[0].split('sim').length > 0 ? 1 : 0
  pesoTotal += rule.R10[0].split('sim').length > 0 ? 1 : 0
  return pesoTotal
}

const CPesoPC1_10 = (rule: DRRuleAssociationsExtractedArray) => {
  let pesoTotal = 0
  pesoTotal += rule.R1[0].split('sim').length > 0 ? 1 : 0
  pesoTotal += rule.R2[0].split('sim').length > 0 ? 2 : 0
  pesoTotal += rule.R3[0].split('sim').length > 0 ? 3 : 0
  pesoTotal += rule.R4[0].split('sim').length > 0 ? 2 : 0
  pesoTotal += rule.R5[0].split('sim').length > 0 ? 2 : 0
  pesoTotal += rule.R6[0].split('sim').length > 0 ? 2 : 0
  pesoTotal += rule.R7[0].split('sim').length > 0 ? 1 : 0
  pesoTotal += rule.R8[0].split('sim').length > 0 ? 2 : 0
  pesoTotal += rule.R9[0].split('sim').length > 0 ? 2 : 0
  pesoTotal += rule.R10[0].split('sim').length > 0 ? 2 : 0
  return pesoTotal
}

const CPesoPC14_T1 = (rule: DRRuleAssociationsExtractedArray) => {
  let pesoTotal = 0
  pesoTotal += rule.R14[0].split('sim').length > 0 ? 3 : 0
  pesoTotal += rule.R15[0].split('sim').length > 0 ? 2 : 0
  pesoTotal += rule.is_title[0].split('sim').length > 0 ? 10 : 0
  return pesoTotal
}

const CPesoP14_T1 = (rule: DRRuleAssociationsExtractedArray) => {
  let pesoTotal = 0
  pesoTotal += rule.R14[0].split('sim').length > 0 ? 3 : 0
  pesoTotal += rule.R15[0].split('sim').length > 0 ? 2 : 0
  pesoTotal += rule.is_title[0].split('sim').length > 0 ? 7 : 0
  return pesoTotal
}

const CPesoPGeG11_12 = (rule: DRRuleAssociationsExtractedArray) => {
  let pesoTotal = 0
  pesoTotal += rule.R11[0].split('sim').length > 0 ? 2 : 0
  pesoTotal += rule.R12[0].split('sim').length > 0 ? 1 : 0
  return pesoTotal
}

const index = async (req: Request, res: Response): Promise<Response> => {
  const { dataSearch = '', pArtigo = 4, pGene = 3, pEntities = 3 } = req.query

  if (!dataSearch) {
    return res.status(400).json({ message: 'Termos de pesquisa estão em um formato errado.' })
  }

  const terms = dataSearch.split(', ')

  const Redirect = {
    // cancer_type_entity_cell: 'cancerEquivalenceTerms',
    // cancer_type_entity_e: 'cancerEquivalenceTerms',
    // cancer_type_entity_p: 'cancerTerms',
    // chemical_entity_e: 'chemicalEquivalenceTerms',
    // chemical_entity_p: 'chemicalTerms'
    cancer_type_entity_cell: 'indexCancers',
    cancer_type_entity_e: 'indexCancers',
    cancer_type_entity_p: 'indexCancers',
    chemical_entity_e: 'indexPolifenols',
    chemical_entity_p: 'indexPolifenols',
    gene_hgnc_entity: 'indexGene',
    gene_entity: 'indexGene',
    indexPolifenols: ['chemical_entity_p', 'chemical_entity_e'],
    indexCancers: ['cancer_type_entity_cell', 'cancer_type_entity_e', 'cancer_type_entity_cell']
  }

  await knex('entitiesTotal')
    .whereIn('db_equivalence', terms)
    .select('*')
    .then(async (data) => {
      const dataTermsCancer = [
        ...new Set(
          data.filter(
            ele => Redirect[ele.entity_type] === 'indexCancers'
          )
            .map(ele => ele.term_id)
        )
      ]

      const dataTermsPolifenols = [
        ...new Set(
          data.filter(
            ele => Redirect[ele.entity_type] === 'indexPolifenols'
          )
            .map(ele => ele.term_id)
        )
      ]

      const [articlesPolifenols] = dataTermsPolifenols.length > 0
        ? await knex('indexPolifenols').select('pmids').whereIn('id_term', dataTermsPolifenols)
        : []

      const [articlesCancer] = dataTermsCancer.length > 0
        ? await knex('indexCancers').select('pmids').whereIn('id_term', dataTermsCancer)
        : []

      let termsIds = []
      if (articlesPolifenols) {
        const pmidsSplit = articlesPolifenols.pmids.split(',')
        termsIds = [...new Set([...pmidsSplit, ...termsIds])]
      }

      if (articlesCancer) {
        const pmidsSplit = articlesCancer.pmids.split(',')
        termsIds = [...new Set([...pmidsSplit, ...termsIds])]
      }

      console.log(termsIds)
      await knex('entitiesTotal')
        .select('*')
        .whereIn('entity_pmid', termsIds)
        .then(async dataEntities => {
          const Articles = await Promise.all(
            dataEntities.map(async (entitie) => {
              const ArticleRule = await knex('articlesTotal')
                .select('id', 'title_article', 'abstract_article', 'pmid')
                .where('pmid', entitie.entity_pmid)
                .then(async ([article]) => {
                  if (article) {
                    const responseRules = await knex('ruleAssociationsExtracted')
                      .where('pmid_article', article.pmid)
                      .select('*')

                    const ruleAssociationsExtracted = responseRules.map(rule => {
                      let entity_sentence_other_cancers = 0
                      let entity_sentence_cancer = 0
                      let entity_sentence_polifenol = 0
                      let entity_sentence_genes = 0

                      entitie.start_pos.forEach((spos, index) => {
                        const epos = entitie.end_pos[index]
                        if (spos >= rule.start_pos && epos <= rule.end_pos) {
                          if (entitie.term_id === '10007') {
                            entity_sentence_other_cancers++
                          } else if (Redirect[entitie.entity_type] === 'indexCancers') {
                            entity_sentence_cancer++
                          } else if (Redirect[entitie.entity_type] === 'indexPolifenols') {
                            entity_sentence_polifenol++
                          } else if (Redirect[entitie.entity_type] === 'indexGene') {
                            entity_sentence_genes++
                          }
                        }
                      })

                      const peso_entities_total = entity_sentence_other_cancers +
                  entity_sentence_cancer +
                  entity_sentence_polifenol +
                  entity_sentence_genes

                      // let n_polifenols = 0
                      // let n_cancers = 0
                      // let n_other_cancers = 0
                      // let n_genes = 0
                      let peso_genes = 0
                      let peso_frase = 0

                      peso_genes = CPesoPGeG11_12(rule)
                      peso_frase = CPesoPouC1_10(rule) + CPesoP14_T1(rule)

                      if (entity_sentence_polifenol > 0 && entity_sentence_cancer > 0) {
                        // n_polifenols = entity_sentence_polifenol
                        // n_cancers = entity_sentence_cancer
                        // n_other_cancers = entity_sentence_other_cancers
                        // n_genes = entity_sentence_genes
                        peso_frase = CPesoPC1_10(rule) + CPesoPC14_T1(rule)
                      } else if (
                        entity_sentence_polifenol > 0 &&
                    entity_sentence_other_cancers > 0
                      ) {
                        // n_polifenols = entity_sentence_polifenol
                        // n_other_cancers = entity_sentence_other_cancers
                        // n_genes = entity_sentence_genes
                      } else if (entity_sentence_polifenol > 0) {
                        // n_polifenols = entity_sentence_polifenol
                        // n_genes = entity_sentence_genes
                      } else if (entity_sentence_cancer > 0) {
                        // n_cancers = entity_sentence_cancer
                        peso_genes = 0
                      } else if (entity_sentence_other_cancers > 0) {
                        // n_other_cancers = entity_sentence_other_cancers
                        peso_genes = 0
                      } else if (entity_sentence_genes > 0) {
                        // n_genes = entity_sentence_genes
                      }

                      return {
                        ...rule,
                        peso_artigo: peso_frase,
                        peso_artigo_genes: peso_genes,
                        peso_entities_total
                      }
                    })

                    const totalPesoArtigo =
                  ruleAssociationsExtracted
                    .reduce((total, ele) => total + ele.peso_artigo, 0)

                    const totalPesoGenes =
                  ruleAssociationsExtracted
                    .reduce((total, ele) => total + ele.peso_artigo_genes, 0)

                    const totalEntities =
                  ruleAssociationsExtracted
                    .reduce((total, ele) => total + ele.peso_entities_total, 0)

                    const pTotal = pArtigo + pGene + pEntities
                    const peso_final =
                  (totalPesoArtigo * pArtigo) +
                  (totalPesoGenes * pGene) +
                  (totalEntities * pEntities) / pTotal

                    const filterRule = ruleAssociationsExtracted.map(ele => {
                      const {
                        association_type, start_pos, end_pos, sentence, peso_artigo, peso_artigo_genes
                      } = ele
                      return { association_type, start_pos, end_pos, sentence, peso_artigo, peso_artigo_genes }
                    })

                    return {
                      ...article,
                      peso_final,
                      peso_rules_normalized: totalPesoArtigo,
                      peso_genes_normalized: totalPesoGenes,
                      peso_entities_normalized: totalEntities,
                      ruleAssociationsExtracted: filterRule
                    }
                  }
                })

              return ArticleRule
            }))

          Articles.sort((ele1, ele2) => {
            if (ele1.peso_final > ele2.peso_final) return -1
            if (ele2.peso_final > ele1.peso_final) return 1
            return 0
          })

          return res.status(200).json(Articles)
        })
    })
    .catch((err) => {
      console.log(err)
      return res.status(400).json({ err, message: 'Algo de errado não esta certo.' })
    })
}

export default { index }
