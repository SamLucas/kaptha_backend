import { Request, Response } from 'express'
import knex from '@/database/connection'

const index = async (req: Request, res: Response): Promise<Response> => {
  const { cancer, chemicals, page, limit } = req.query

  let PMDCancer = []
  let PMDchemicals = []

  if (cancer) {
    PMDCancer = await knex('cancerEquivalenceTerms')
      .join('indexCancers', 'id_term', '=', 'idterm_descritor')
      .where('equivalence_term', cancer)
      .select('*')
      .first()
      .then(data => data.pmids.split(','))
  }

  if (chemicals) {
    PMDchemicals = await knex('chemicalEquivalenceTerms')
      .join('indexPolifenols', 'id_term', '=', 'idterm_descritor')
      .where('equivalence_term', chemicals)
      .select('*')
      .first()
      .then(data => data.pmids.split(','))
  }

  const Pmid = [...new Set([...PMDCancer, ...PMDchemicals])]

  const [count] = await knex('articlesTotal')
    .whereIn('pmid', Pmid).count()

  res.header('X-Total-Count', count['count(*)'])

  await knex('articlesTotal')
    .whereIn('pmid', Pmid)
    .limit(limit)
    .offset((page - 1) * limit)
    .select('*').then(async data => {
      const articles = await Promise.all(data.map(async ele => {
        const response = await knex('ruleAssociationsExtracted')
          .where('pmid_article', ele.pmid)
          .select('*')

        return { ...ele, ruleAssociationsExtracted: response }
      }))

      return res.json(articles)
    }).catch(err => {
      return res.json({ err, message: 'Algo de errado não esta certo.' })
    })
}

export default { index }
