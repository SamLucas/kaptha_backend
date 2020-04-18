import { Request, Response } from 'express'
import fs from 'fs'

import FRIndexCancers from '@/Utils/ReadFiles/indexCancers'
import FRCancerEquivalenceTerms from '@/Utils/ReadFiles/cancerEquivalenceTerms'
import FRChemicalEquivalenceTerms from '@/Utils/ReadFiles/chemicalEquivalenceTerms'

const FuctionsArray = [FRIndexCancers, FRCancerEquivalenceTerms, FRChemicalEquivalenceTerms]

const IndexFunctions = {
  indexCancers: 0,
  cancerEquivalenceTerms: 1,
  chemicalEquivalenceTerms: 2
}

const store = async (req: Request, res: Response): Promise<Response> => {
  const { name } = req.body

  const file = fs.readFileSync(`./backup/${name}.json`, 'utf8')
  if (!file) return res.status(401).json({ message: 'Arquivo não encontrado ou nome invalido.' })

  const data = JSON.parse(file)

  const keyIndexFunctions: keyof typeof IndexFunctions = name
  const index = IndexFunctions[keyIndexFunctions]

  FuctionsArray[index](data)

  return res.json({ message: 'Dados inseridos com sucesso.' })
}

export default { store }
