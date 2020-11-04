import { Request, Response } from "express";
import knex from "@/database/connection";

import _ from "lodash";

import { DRRuleAssociationsExtractedArray } from "@/Utils/ReadFiles/utils/ReadFileJson/ruleAssociationsExtracted";
import { normalization } from "@/Utils";

const calc_peso_polifenol = (rule: DRRuleAssociationsExtractedArray) => {
  let pesoTotal = 0;
  if (rule.R2.indexOf("sim") >= 0) pesoTotal += 1;
  if (rule.R3.indexOf("sim") >= 0) pesoTotal += 1;
  if (rule.R4.indexOf("sim") >= 0) pesoTotal += 1;
  if (rule.R5.indexOf("sim") >= 0) pesoTotal += 1;
  if (rule.R6.indexOf("sim") >= 0) pesoTotal += 1;
  if (rule.R8.indexOf("sim") >= 0) pesoTotal += 1;
  if (rule.R9.indexOf("sim") >= 0) pesoTotal += 1;
  if (rule.R10.indexOf("sim") >= 0) pesoTotal += 1;
  if (rule.R14.indexOf("sim") >= 0) pesoTotal += 3;
  if (rule.R15.indexOf("sim") >= 0) pesoTotal += 2;
  if (rule.R16.indexOf("sim") >= 0) pesoTotal += 2;
  if (rule.is_title.indexOf("sim") >= 0) pesoTotal += 7;
  return pesoTotal;
};

const calc_peso_gene = (rule: DRRuleAssociationsExtractedArray) => {
  let pesoTotal = 0;
  if (rule.R2.indexOf("sim") >= 0) pesoTotal += 1;
  if (rule.R3.indexOf("sim") >= 0) pesoTotal += 1;
  if (rule.R4.indexOf("sim") >= 0) pesoTotal += 1;
  if (rule.R5.indexOf("sim") >= 0) pesoTotal += 1;
  if (rule.R6.indexOf("sim") >= 0) pesoTotal += 1;
  if (rule.R8.indexOf("sim") >= 0) pesoTotal += 1;
  if (rule.R9.indexOf("sim") >= 0) pesoTotal += 1;
  if (rule.R10.indexOf("sim") >= 0) pesoTotal += 1;
  return pesoTotal;
};

const calc_peso_polifenol_cancer = (rule: DRRuleAssociationsExtractedArray) => {
  let pesoTotal = 0;
  if (rule.R1.indexOf("sim") >= 0) pesoTotal += 1;
  if (rule.R2.indexOf("sim") >= 0) pesoTotal += 2;
  if (rule.R3.indexOf("sim") >= 0) pesoTotal += 3;
  if (rule.R4.indexOf("sim") >= 0) pesoTotal += 2;
  if (rule.R5.indexOf("sim") >= 0) pesoTotal += 2;
  if (rule.R6.indexOf("sim") >= 0) pesoTotal += 2;
  if (rule.R7.indexOf("sim") >= 0) pesoTotal += 1;
  if (rule.R8.indexOf("sim") >= 0) pesoTotal += 2;
  if (rule.R9.indexOf("sim") >= 0) pesoTotal += 2;
  if (rule.R10.indexOf("sim") >= 0) pesoTotal += 2;
  if (rule.R14.indexOf("sim") >= 0) pesoTotal += 3;
  if (rule.R16.indexOf("sim") >= 0) pesoTotal += 2;
  if (rule.is_title.indexOf("sim") >= 0) pesoTotal += 10;
  return pesoTotal;
};


const calc_peso_polifenol_gene = (rule: DRRuleAssociationsExtractedArray) => {
  let pesoTotal = 0;
  if (rule.R11.indexOf("sim") >= 0) pesoTotal += 1;
  if (rule.R12.indexOf("sim") >= 0) pesoTotal += 2;
  return pesoTotal;
};

const index = async (req: Request, res: Response): Promise<Response> => {
  const {
    dataSearchPolyphenol = "",
    dataSearchChemical = "",
    // pArtigo = 4,
    // pGene = 3,
    // pEntities = 3,
    pArtigo = 5,
    pGene = 2,
    pEntities = 3,
  } = req.query;

  // if (!dataSearch) {
  //   return res.status(400).json({ message: 'Termos de pesquisa estão em um formato errado.' })
  // }

  // const terms = dataSearch.split(', ')
  const terms = [];
  dataSearchPolyphenol !== "" && terms.push(dataSearchPolyphenol);
  dataSearchChemical !== "" && terms.push(dataSearchChemical);

  console.log(terms);

  const Redirect = {
    // cancer_type_entity_cell: 'cancerEquivalenceTerms',
    // cancer_type_entity_e: 'cancerEquivalenceTerms',
    // cancer_type_entity_p: 'cancerTerms',
    // chemical_entity_e: 'chemicalEquivalenceTerms',
    // chemical_entity_p: 'chemicalTerms'
    cancer_type_entity_cell: "indexCancers",
    cancer_type_entity_e: "indexCancers",
    cancer_type_entity_p: "indexCancers",
    chemical_entity_e: "indexPolifenols",
    chemical_entity_p: "indexPolifenols",
    gene_hgnc_entity: "indexGene",
    gene_entity: "indexGene",
    indexPolifenols: ["chemical_entity_p", "chemical_entity_e"],
    indexCancers: [
      "cancer_type_entity_cell",
      "cancer_type_entity_e",
      "cancer_type_entity_p",
    ],
  };



  await knex.transaction(async trx => {
    await trx("entitiesTotal")
      .whereIn("db_equivalence", terms)
      .select("*")
      .then(async (data) => {
        const termsSearchPmid = [...new Set(data.map((ele) => ele.term_id))];

        const dataTermsCancer = [
          ...new Set(
            data
              .filter((ele) => Redirect[ele.entity_type] === "indexCancers")
              .map((ele) => ele.term_id)
          ),
        ];

        const dataTermsPolifenols = [
          ...new Set(
            data
              .filter((ele) => Redirect[ele.entity_type] === "indexPolifenols")
              .map((ele) => ele.term_id)
          ),
        ];

        const [articlesPolifenols] =
          dataTermsPolifenols.length > 0
            ? await knex("indexPolifenols")
              .select("pmids")
              .whereIn("id_term", dataTermsPolifenols)
            : [];

        const [articlesCancer] =
          dataTermsCancer.length > 0
            ? await knex("indexCancers")
              .select("pmids")
              .whereIn("id_term", dataTermsCancer)
            : [];

        let termsIdsOne: any = [];
        let termsIdsTwo: any = [];
        let termsIds: any = [];

        if (articlesPolifenols) {
          const pmidsSplit = articlesPolifenols.pmids.split(",");
          termsIdsOne = [...new Set([...pmidsSplit, ...termsIds])];
        }

        if (articlesCancer) {
          const pmidsSplit = articlesCancer.pmids.split(",");
          termsIdsTwo = [...new Set([...pmidsSplit, ...termsIds])];
        }

        termsIds = termsIdsOne.length > 0 &&
          termsIdsTwo.length > 0 ? _.intersection(termsIdsOne, termsIdsTwo) : [...termsIdsOne, ...termsIdsTwo]

        const response = await Promise.all(
          termsIds.map(async (ele) => {

            const entities = await trx("entitiesTotal")
              .select("*")
              .where({ entity_pmid: ele })
              .then((data) => data)
              .catch(() => []);


            const peso_entities_other_cancers = entities.filter(
              (eleEnites) => {
                return eleEnites.term_id === "10007" &&
                  eleEnites.entity_pmid == ele &&
                  Redirect[eleEnites.entity_type] === "indexCancers"
              }
            );

            const peso_entities_cancer = entities.filter(
              (eleEnites) => {
                return termsSearchPmid.find((term) => eleEnites.term_id === term) &&
                  eleEnites.entity_pmid == ele &&
                  Redirect[eleEnites.entity_type] === "indexCancers"
              }
            );

            const peso_entities_polifenol = entities.filter(
              (eleEnites) =>
                termsSearchPmid.find((term) => eleEnites.term_id === term) &&
                eleEnites.entity_pmid == ele &&
                Redirect[eleEnites.entity_type] === "indexPolifenols"
            );

            const peso_entities_geness = entities.filter(
              (eleEnites) =>
                eleEnites.entity_pmid == ele &&
                Redirect[eleEnites.entity_type] === "indexGene"
            );

            const peso_entities_total =
              peso_entities_other_cancers.length +
              peso_entities_cancer.length +
              peso_entities_polifenol.length +
              peso_entities_geness.length;

            const rules = await trx("ruleAssociationsExtracted")
              .where({ pmid_article: ele })
              .then((data) => data)
              .catch(() => []);

            const [article] = await trx("articlesTotal")
              .where({ pmid: ele })
              .then((data) => data)
              .catch(() => []);

            let peso_artigo_genes = 0;
            let peso_artigo = 0;

            const newRules = rules.map((rule) => {
              let peso_frase = 0;
              let peso_genes = 0;
              let entitiesRules = []

              const entity_sentence_other_cancers = entities.filter(
                (eleEnites) =>
                  eleEnites.term_id === "10007" &&
                  eleEnites.entity_pmid == rule.pmid_article &&
                  eleEnites.start_pos >= rule.start_pos && eleEnites.end_pos <= rule.end_pos &&
                  Redirect[eleEnites.entity_type] === "indexCancers"
              );

              const entity_sentence_cancer = entities.filter(
                (eleEnites) =>
                  eleEnites.entity_pmid == rule.pmid_article &&
                  eleEnites.start_pos >= rule.start_pos && eleEnites.end_pos <= rule.end_pos &&
                  Redirect[eleEnites.entity_type] === "indexCancers"
              );

              const entity_sentence_polifenol = entities.filter(
                (eleEnites) =>
                  termsSearchPmid.find(
                    (term) => eleEnites.term_id === term
                  ) > 0 &&
                  eleEnites.entity_pmid == rule.pmid_article &&
                  eleEnites.start_pos >= rule.start_pos && eleEnites.end_pos <= rule.end_pos &&
                  Redirect[eleEnites.entity_type] === "indexPolifenols"
              );

              const entity_sentence_genes = entities.filter(
                (eleEnites) =>
                  eleEnites.entity_pmid == rule.pmid_article &&
                  eleEnites.start_pos >= rule.start_pos && eleEnites.end_pos <= rule.end_pos &&
                  Redirect[eleEnites.entity_type] === "indexGene"
              );

              if (
                entity_sentence_polifenol.length > 0 &&
                entity_sentence_cancer.length > 0
              ) {
                peso_genes = calc_peso_polifenol_gene(rule);
                peso_frase = calc_peso_polifenol_cancer(rule);
                entitiesRules = [...entity_sentence_polifenol, ...entity_sentence_cancer]
                // ele === "29434850" && console.log("entity_sentence_polifenol || entity_sentence_cancer", peso_frase)
              } else if (entity_sentence_polifenol.length > 0 &&
                entity_sentence_other_cancers.length > 0) {
                peso_genes = calc_peso_polifenol_gene(rule);
                peso_frase = calc_peso_polifenol(rule)
                entitiesRules = [...entity_sentence_polifenol, ...entity_sentence_other_cancers]
                // ele === "29434850" && console.log("entity_sentence_polifenol || entity_sentence_other_cancers", peso_frase)
              } else if (entity_sentence_polifenol.length > 0) {
                peso_genes = calc_peso_polifenol_gene(rule);
                peso_frase = calc_peso_polifenol(rule)
                entitiesRules = entity_sentence_polifenol
                // ele === "29434850" && console.log("entity_sentence_polifenol", peso_frase)
              } else if (entity_sentence_cancer) {
                peso_genes = 0
                peso_frase = calc_peso_polifenol(rule)
                entitiesRules = entity_sentence_cancer
                // ele === "29434850" && console.log("entity_sentence_cancer", peso_frase)
              }
              else if (entity_sentence_other_cancers.length > 0) {
                peso_genes = 0
                peso_frase = calc_peso_gene(rule)
                entitiesRules = entity_sentence_other_cancers
                // ele === "29434850" && console.log("entity_sentence_other_cancers", peso_frase)
              }
              else if (entity_sentence_genes.length > 0) {

                peso_genes = calc_peso_polifenol_gene(rule)
                peso_frase = calc_peso_polifenol(rule)
                entitiesRules = entity_sentence_genes

                // ele === "29434850" && console.log("entity_sentence_genes", peso_frase)
              }

              peso_artigo_genes += peso_genes;
              peso_artigo += peso_frase;

              return {
                ...rule,
                peso_frase,
                peso_genes,
                entitiesRules
              };
            });

            const Xmin = Math.min(...[peso_artigo, peso_entities_total, peso_artigo_genes]);
            const Xmax = Math.max(...[peso_artigo, peso_entities_total, peso_artigo_genes]);

            const peso_rules_normalized = normalization(peso_artigo, Xmin, Xmax)
            const peso_entities_normalized = normalization(peso_entities_total, Xmin, Xmax)
            const peso_genes_normalized = normalization(peso_artigo_genes, Xmin, Xmax)

            const pTotal = pArtigo + pGene + pEntities;
            const peso_final =
              peso_artigo * pArtigo +
              peso_entities_total * pGene +
              peso_artigo_genes * pEntities;


            return {
              pmid: ele,
              peso_rules: peso_rules_normalized,
              peso_entities: peso_entities_normalized,
              peso_genes: peso_genes_normalized,
              peso_final: parseInt(peso_final) / parseInt(pTotal),
              article,
              rule: newRules,
            };
          })
        );


        response.sort((ele1, ele2) => {
          if (ele1.peso_final > ele2.peso_final) return -1;
          if (ele2.peso_final > ele1.peso_final) return 1;
          return 0;
        });

        console.log(response.length);
        return res.status(200).json(response);

      })
      .catch((err) => {
        console.log(err)
        return res
          .status(400)
          .json({ err, message: "Algo de errado não esta certo." });
      });
  }).catch((err) => {
    console.log(err)
    return res
      .status(400)
      .json({ err, message: "Algo de errado não esta certo." });
  });

};

export default { index };
