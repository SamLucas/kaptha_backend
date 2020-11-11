import { Request, Response } from "express";
import knex from "@/database/connection";

import _ from "lodash";

import { DRRuleAssociationsExtractedArray } from "@/Utils/ReadFiles/utils/ReadFileJson/ruleAssociationsExtracted";
import { normalization } from "@/Utils";

import RankingOfEntities from '@/factorys/Ranking'
import PMIDs from '@/factorys/PMIDs'

import RulesInterface from '@/interfaces/Rules'
import ResultInterface from '@/interfaces/Result'

import {
  ClassificartionGene,
  Redirect
} from '@/Utils/EntitiesRedirect'

const index = async (req: Request, res: Response) => {

  const {
    dataSearchPolyphenol = "",
    dataSearchChemical = "",
    dataSearchGene = "",
  } = req.query;

  const pArtigo = 5
  const pGene = 2
  const pEntities = 3

  const terms: String[] = [];
  dataSearchPolyphenol !== "" && terms.push(dataSearchPolyphenol as String);
  dataSearchChemical !== "" && terms.push(dataSearchChemical as String);
  dataSearchGene !== "" && terms.push(dataSearchGene as String);

  console.log(terms);

  await knex.transaction(async trx => {

    await trx("entitiesTotal")
      .whereIn("db_equivalence", terms)
      .select("*")
      .then(async (data) => {

        const {
          termsSearchPmid,
          dataTermsCancer,
          dataTermsPolifenols,
          dataTermsGeneEntitie,
          dataTermsGeneHGNC,
        } = PMIDs._getPMIDs(data)


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

        const [articlesGeneEntitie] =
          dataTermsGeneEntitie.length > 0
            ? await knex("genesTotal")
              .select("pmids")
              .whereIn("id_term", dataTermsGeneEntitie)
            : [];

        const [articlesGeneHGNC] =
          dataTermsGeneHGNC.length > 0
            ? await knex("genesTotal")
              .select("pmids")
              .whereIn("gene_hgnc_entity", dataTermsGeneHGNC)
            : [];

        const termsIds = PMIDs._makeInterception(
          articlesPolifenols,
          articlesCancer,
          articlesGeneEntitie,
          articlesGeneHGNC
        ).map((ele: String) => ele.trim())

        console.log(termsIds.length, "artigos encontrados.")

        const response: ResultInterface[] = []

        await Promise.all(
          termsIds.map(async (ele: String) => {

            const [article] = await trx("articlesTotal")
              .where({ pmid: ele })
              .then((data) => data)
              .catch(() => []);

            if (!article) {
              console.log("Artigo não encontrado:", ele)
              return;
            }

            const rules = await trx("ruleAssociationsExtracted")
              .where({ pmid_article: ele })
              .then((data) => data)
              .catch(() => []);

            const entities = await trx("entitiesTotal")
              .select("*")
              .where({ entity_pmid: ele })
              .then((data) => data)
              .catch(() => []);

            const peso_entities_total = RankingOfEntities.weigthCalculationEntities(
              entities,
              termsSearchPmid,
              ele as String
            )

            let peso_artigo_genes = 0;
            let peso_artigo = 0;

            const newRules = rules.map((rule: RulesInterface) => {

              const responseRankedEntities = RankingOfEntities.filterSearchEntities(
                entities,
                rule,
                termsSearchPmid
              )

              const {
                entitiesRules,
                entity_sentence_cancer,
                entity_sentence_genes,
                entity_sentence_other_cancers,
                entity_sentence_polifenol
              } = responseRankedEntities

              const { peso_frase, peso_genes } = RankingOfEntities.weightCalculationInSentences(
                entity_sentence_cancer,
                entity_sentence_genes,
                entity_sentence_other_cancers,
                entity_sentence_polifenol,
                rule
              )

              peso_artigo_genes += peso_genes;
              peso_artigo += peso_frase;

              return {
                ...rule,
                peso_frase,
                peso_genes,
                entitiesRules
              };
            });

            const Xmax = Math.max(...[peso_artigo, peso_entities_total, peso_artigo_genes]);
            const Xmin = 0

            const peso_rules_normalized = normalization(peso_artigo, Xmin, Xmax)
            const peso_entities_normalized = normalization(peso_entities_total, Xmin, Xmax)
            const peso_genes_normalized = normalization(peso_artigo_genes, Xmin, Xmax)

            const pTotal = pArtigo + pGene + pEntities;
            const sumTotal =
              peso_rules_normalized * pArtigo +
              peso_entities_normalized * pGene +
              peso_genes_normalized * pEntities;

            const peso_final = sumTotal / pTotal

            response.push({
              pmid: ele,
              peso_rules: peso_rules_normalized,
              peso_entities: peso_entities_normalized,
              peso_genes: peso_genes_normalized,
              peso_final,
              article,
              rule: newRules,
            });
          })
        );

        response.sort((ele1, ele2) => {
          if (ele1.peso_final > ele2.peso_final) return -1;
          if (ele2.peso_final > ele1.peso_final) return 1;
          return 0;
        });

        // console.log(response.length);
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
