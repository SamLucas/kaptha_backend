import { Request, Response } from "express";
import knex from "@/database/connection";

import Normalization from '@/factorys/Normalization'
import RankingOfEntities from '@/factorys/Ranking'
import PMIDs from '@/factorys/PMIDs'

import RulesInterface from '@/interfaces/Rules'
import ResultInterface from '@/interfaces/Result'

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

  const typeConsult = PMIDs.typeConsult(
    dataSearchPolyphenol as String,
    dataSearchChemical as String,
    dataSearchGene as String
  )

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
              .whereIn("id_term_hgnc", dataTermsGeneHGNC)
            : [];

        const termsIds = PMIDs._makeInterception(
          articlesPolifenols,
          articlesCancer,
          articlesGeneEntitie,
          articlesGeneHGNC
        ).map((ele: String) => ele.trim())

        console.log(termsIds.length, "artigos encontrados.")

        const dataResult: ResultInterface[] = []

        let XP1 = { min: 10000, max: -1 }
        let XP2 = { min: 10000, max: -1 }
        let XP3 = { min: 10000, max: -1 }

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

              const {
                entitiesRules,
                entity_sentence_cancer,
                entity_sentence_genes,
                entity_sentence_other_cancers,
                entity_sentence_polifenol
              } = RankingOfEntities.filterSearchEntities(
                entities,
                rule,
                termsSearchPmid,
                typeConsult
              )

              const { peso_frase, peso_genes } =
                RankingOfEntities.weightCalculationInSentences(
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

            XP1 = Normalization._changeValueMinMax(XP1, peso_artigo)
            XP2 = Normalization._changeValueMinMax(XP2, peso_entities_total)
            XP3 = Normalization._changeValueMinMax(XP3, peso_artigo_genes)

            dataResult.push({
              pmid: ele,
              peso_rules: peso_artigo,
              peso_entities: peso_entities_total,
              peso_genes: peso_artigo_genes,
              peso_final: 0,
              article: {
                ...article,
                med: Normalization._changedToPrecision(article.med as number, 3)
              },
              rule: newRules,
            });
          })
        );


        const response = dataResult.map(ele => {

          const { peso_rules, peso_entities, peso_genes } = ele

          const newPR = Normalization._calcNormalization(peso_rules as number, XP1)
          const newPE = Normalization._calcNormalization(peso_entities as number, XP2)
          const newPG = Normalization._calcNormalization(peso_genes as number, XP3)

          const pTotal = pArtigo + pGene + pEntities;
          const sumTotal =
            newPR * pArtigo +
            newPE * pGene +
            newPG * pEntities;

          const peso_final = sumTotal / pTotal
          return {
            ...ele,
            peso_rules: Normalization._changedToPrecision(newPR, 2),
            peso_entities: Normalization._changedToPrecision(newPE, 2),
            peso_genes: Normalization._changedToPrecision(newPG, 2),
            peso_final: Normalization._changedToPrecision(peso_final, 3)
          }
        })
          .sort((ele1, ele2) => {
            if (ele1.peso_final > ele2.peso_final) return -1;
            if (ele2.peso_final > ele1.peso_final) return 1;
            return 0;
          })

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
