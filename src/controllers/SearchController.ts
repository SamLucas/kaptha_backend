import { Request, Response } from 'express'
import knex from '@/database/connection'

const index = async (req: Request, res: Response): Promise<Response> => {
  const { dataSearch = '', page = 1, limit = 4 } = req.query

  let PMDCancer = []
  let PMDchemicals = []

  const terms = dataSearch.split(', ')

  if (dataSearch) {
    PMDCancer = await knex('cancerEquivalenceTerms')
      .join('indexCancers', 'id_term', '=', 'idterm_descritor')
      .whereIn('equivalence_term', terms)
      .select('*')

    PMDchemicals = await knex('chemicalEquivalenceTerms')
      .join('indexPolifenols', 'id_term', '=', 'idterm_descritor')
      .whereIn('equivalence_term', terms)
      .select('*')
  }

  let Pmid: number[] = [];
  [...PMDCancer, ...PMDchemicals].forEach(ele => {
    const arrayAux = ele.pmids.split(',')
    Pmid = [...new Set([...Pmid, ...arrayAux])]
  })

  const offset = (page - 1) * limit
  const pmidSearch = Pmid.slice(offset, offset + parseInt(limit))

  res.header('X-Total-Count', `${Pmid.length}`)

  await knex('articlesTotal')
    .whereIn('pmid', pmidSearch)
    .select('*')
    .then(async (data) => {
      const articles = await Promise.all(
        data.map(async (ele) => {
          const response = await knex('ruleAssociationsExtracted')
            .where('pmid_article', ele.pmid)
            .select('*')

          return { ...ele, ruleAssociationsExtracted: response }
        })
      )

      return res.json({ pages: Pmid.length, articles })
    })
    .catch((err) => {
      return res.json({ err, message: 'Algo de errado não esta certo.' })
    })
}

export default { index }
