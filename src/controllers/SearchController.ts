import { Request, Response } from "express";
import knex from "@/database/connection";

import { DRRuleAssociationsExtractedArray } from "@/Utils/ReadFiles/utils/ReadFileJson/ruleAssociationsExtracted";

const CPesoPouC1_10 = (rule: DRRuleAssociationsExtractedArray) => {
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

const CPesoPC1_10 = (rule: DRRuleAssociationsExtractedArray) => {
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
  return pesoTotal;
};

const CPesoPC14_T1 = (rule: DRRuleAssociationsExtractedArray) => {
  let pesoTotal = 0;
  if (rule.R14.indexOf("sim") >= 0) pesoTotal += 3;
  if (rule.R15.indexOf("sim") >= 0) pesoTotal += 2;
  if (rule.is_title.indexOf("sim") >= 0) pesoTotal += 10;
  return pesoTotal;
};

const CPesoP14_T1 = (rule: DRRuleAssociationsExtractedArray) => {
  let pesoTotal = 0;
  if (rule.R14.indexOf("sim") >= 0) pesoTotal += 3;
  if (rule.R15.indexOf("sim") >= 0) pesoTotal += 2;
  if (rule.is_title.indexOf("sim") >= 0) pesoTotal += 7;
  return pesoTotal;
};

const CPesoPGeG11_12 = (rule: DRRuleAssociationsExtractedArray) => {
  let pesoTotal = 0;
  if (rule.R11.indexOf("sim") >= 0) pesoTotal += 2;
  if (rule.R12.indexOf("sim") >= 0) pesoTotal += 1;
  return pesoTotal;
};

const index = async (req: Request, res: Response): Promise<Response> => {
  const {
    dataSearchPolyphenol = "",
    dataSearchChemical = "",
    pArtigo = 4,
    pGene = 3,
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
      "cancer_type_entity_cell",
    ],
  };

  await knex("entitiesTotal")
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

      let termsIds: any = [];
      if (articlesPolifenols) {
        const pmidsSplit = articlesPolifenols.pmids.split(",");
        termsIds = [...new Set([...pmidsSplit, ...termsIds])];
      }

      if (articlesCancer) {
        const pmidsSplit = articlesCancer.pmids.split(",");
        termsIds = [...new Set([...pmidsSplit, ...termsIds])];
      }

      const response = await Promise.all(
        termsIds.map(async (ele) => {
          const entities = await knex("entitiesTotal")
            .select("*")
            .where({ entity_pmid: ele })
            .then((data) => data)
            .catch(() => []);

          const peso_entities_other_cancers = entities.filter(
            (eleEnites) =>
              eleEnites.term_id === "10007" &&
              eleEnites.entity_pmid == ele &&
              Redirect[eleEnites.entity_type] === "indexCancers"
          );

          const peso_entities_cancer = entities.filter(
            (eleEnites) =>
              termsSearchPmid.find((term) => eleEnites.term_id === term) > 0 &&
              eleEnites.entity_pmid == ele &&
              Redirect[eleEnites.entity_type] === "indexCancers"
          );

          const peso_entities_polifenol = entities.filter(
            (eleEnites) =>
              termsSearchPmid.find((term) => eleEnites.term_id === term) > 0 &&
              eleEnites.entity_pmid == ele &&
              Redirect[eleEnites.entity_type] === "indexPolifenols"
          );

          const peso_entities_geness = entities.filter(
            (eleEnites) =>
              termsSearchPmid.find((term) => eleEnites.term_id === term) > 0 &&
              eleEnites.entity_pmid == ele &&
              Redirect[eleEnites.entity_type] === "indexGene"
          );

          const peso_entities_total =
            peso_entities_other_cancers.length +
            peso_entities_cancer.length +
            peso_entities_polifenol.length +
            peso_entities_geness.length;

          const rules = await knex("ruleAssociationsExtracted")
            .where({ pmid_article: ele })
            .then((data) => data)
            .catch(() => []);

          const [article] = await knex("articlesTotal")
            .where({ pmid: ele })
            .then((data) => data)
            .catch(() => []);

          let peso_artigo_genes = 0;
          let peso_artigo = 0;

          const newRules = rules.map((rule) => {
            let peso_frase = 0;
            let peso_genes = 0;

            const entitiesRules = [];

            entities.map((entitiesItem) => {
              entitiesItem.start_pos.map((spos, index) => {
                const epos = entitiesItem.end_pos[index];
                if (spos >= rule.start_pos && epos <= rule.end_pos) {
                  entitiesRules.push({
                    start: spos,
                    end: epos,
                    entity_type: entitiesItem.entity_type,
                  });

                  const entity_sentence_other_cancers = entities.filter(
                    (eleEnites) =>
                      eleEnites.term_id === "10007" &&
                      eleEnites.entity_pmid == rule.pmid_article &&
                      Redirect[eleEnites.entity_type] === "indexCancers"
                  );

                  const entity_sentence_cancer = entities.filter(
                    (eleEnites) =>
                      termsSearchPmid.find(
                        (term) => eleEnites.term_id === term
                      ) > 0 &&
                      eleEnites.entity_pmid == rule.pmid_article &&
                      Redirect[eleEnites.entity_type] === "indexCancers"
                  );

                  const entity_sentence_polifenol = entities.filter(
                    (eleEnites) =>
                      termsSearchPmid.find(
                        (term) => eleEnites.term_id === term
                      ) > 0 &&
                      eleEnites.entity_pmid == rule.pmid_article &&
                      Redirect[eleEnites.entity_type] === "indexPolifenols"
                  );

                  const entity_sentence_genes = entities.filter(
                    (eleEnites) =>
                      eleEnites.entity_pmid == rule.pmid_article &&
                      Redirect[eleEnites.entity_type] === "indexGene"
                  );

                  if (
                    entity_sentence_polifenol.length > 0 &&
                    entity_sentence_cancer.length > 0
                  ) {
                    peso_genes = CPesoPGeG11_12(rule);
                    peso_frase = CPesoPC1_10(rule) + CPesoPC14_T1(rule);
                  } else if (
                    entity_sentence_polifenol.length > 0 &&
                    entity_sentence_other_cancers.length > 0
                  ) {
                    peso_genes = CPesoPGeG11_12(rule);
                    peso_frase = CPesoPouC1_10(rule) + CPesoP14_T1(rule);
                  } else if (entity_sentence_polifenol.length > 0) {
                    // n_polifenols = entity_sentence_polifenol
                    // n_genes = entity_sentence_genes
                    peso_genes = CPesoPGeG11_12(rule);
                    peso_frase = CPesoPouC1_10(rule) + CPesoP14_T1(rule);
                  } else if (entity_sentence_cancer.length > 0) {
                    // n_cancers = entity_sentence_cancer
                    peso_genes = 0;
                    peso_frase = CPesoPouC1_10(rule) + CPesoP14_T1(rule);
                  } else if (entity_sentence_other_cancers.length > 0) {
                    // n_other_cancers = entity_sentence_other_cancers
                    peso_genes = 0;
                    peso_frase = CPesoPouC1_10(rule) + CPesoP14_T1(rule);
                  } else if (entity_sentence_genes.length > 0) {
                    // n_genes = entity_sentence_genes
                    peso_genes = CPesoPGeG11_12(rule);
                    peso_frase = CPesoPouC1_10(rule) + CPesoP14_T1(rule);
                  }
                  peso_artigo_genes += peso_genes;
                  peso_artigo += peso_frase;
                }
              });
            });

            return {
              ...rule,
              entitiesRules,
              peso_frase,
              peso_genes,
            };
          });

          const pTotal = pArtigo + pGene + pEntities;
          const peso_final =
            peso_artigo * pArtigo +
            peso_artigo_genes * pGene +
            (peso_entities_total * pEntities) / pTotal;

          return {
            article,
            pmid: ele,
            peso_rules: peso_artigo,
            peso_entities: peso_entities_total,
            peso_genes: peso_artigo_genes,
            peso_final,
            rule: newRules,
          };
        })
      );

      response.sort((ele1, ele2) => {
        if (ele1.peso_final > ele2.peso_final) return -1;
        if (ele2.peso_final > ele1.peso_final) return 1;
        return 0;
      });

      return res.status(200).json(response);
    })
    .catch((err) => {
      return res
        .status(400)
        .json({ err, message: "Algo de errado não esta certo." });
    });
};

export default { index };
