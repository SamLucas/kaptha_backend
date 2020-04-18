import { Request, Response } from 'express'
import knex from '@/database/connection'
import fs from 'fs'

interface DataRecoverd {
  idequivalence_relationship: string;
  equivalence_term: string;
  idterm_descritor: string;
}

const store = async (req: Request, res: Response): Promise<Response> => {
  const file = fs.readFileSync('./backup/cancerEquivalenceTerms.json', 'utf8')
  const data = JSON.parse(file)

  data.map((dataInfo: DataRecoverd) => {
    const { idequivalence_relationship, equivalence_term, idterm_descritor } = dataInfo

    knex('cancerEquivalenceTerms').insert({
      idequivalence_relationship,
      equivalence_term,
      idterm_descritor
    })
      .then(data => data)
      .catch(err => console.log(err))
  })

  return res.json({ ok: 'ok' })
}

export default { store }
