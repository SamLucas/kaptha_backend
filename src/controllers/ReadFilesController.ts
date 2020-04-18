import { Request, Response } from 'express'
import knex from '@/database/connection'
import fs from 'fs'

interface DRCancerEquivalenceTerms {
  idequivalence_relationship: string;
  equivalence_term: string;
  idterm_descritor: string;
}

interface DRIndexCancers {
  cancer: string;
  id_term: number;
  total_ocorrence: number;
  unique_ocorrence: number;
  pmids: string;
  ration: number;
}

const FRIndexCancers = (data: DRIndexCancers[]): void =>
  data.forEach((dataInfo: DRIndexCancers) => {
    const {
      cancer,
      id_term,
      total_ocorrence,
      unique_ocorrence,
      pmids,
      ration
    } = dataInfo

    knex('indexCancers').insert({
      cancer,
      id_term,
      total_ocorrence,
      unique_ocorrence,
      pmids,
      ration
    })
      .then(data => data)
      .catch(err => console.log(err))
  })

const FRCancerEquivalenceTerms = (data: DRCancerEquivalenceTerms[]): void =>
  data.forEach((dataInfo: DRCancerEquivalenceTerms) => {
    const { idequivalence_relationship, equivalence_term, idterm_descritor } = dataInfo

    knex('cancerEquivalenceTerms').insert({
      idequivalence_relationship,
      equivalence_term,
      idterm_descritor
    })
      .then(data => data)
      .catch(err => console.log(err))
  })

const Fuctions = [FRIndexCancers, FRCancerEquivalenceTerms]

const store = async (req: Request, res: Response): Promise<Response> => {
  const { name } = req.body

  const file = fs.readFileSync(`./backup/${name}.json`, 'utf8')
  const data = JSON.parse(file)

  let IndexFunction = 0

  switch (name) {
    case 'indexCancers':
      IndexFunction = 0
      break

    case 'cancerEquivalenceTerms':
      IndexFunction = 1
      break

    default:
      IndexFunction = -1
      break
  }

  IndexFunction >= 0 && Fuctions[IndexFunction](data)

  return res.json({ ok: 'ok' })
}

export default { store }
