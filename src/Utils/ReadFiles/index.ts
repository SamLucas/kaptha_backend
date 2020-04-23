import { Request, Response } from 'express'
import fs from 'fs'

import FRIndexCancers from '@/Utils/ReadFiles/indexCancers'
import FRCancerEquivalenceTerms from '@/Utils/ReadFiles/cancerEquivalenceTerms'
import FRChemicalEquivalenceTerms from '@/Utils/ReadFiles/chemicalEquivalenceTerms'
import FRIndexPolifenols from '@/Utils/ReadFiles/indexPolifenols'
import FRArticlesTotal from '@/Utils/ReadFiles/articlesTotal'
import FRRuleAssociationsExtracted from '@/Utils/ReadFiles/ruleAssociationsExtracted'
import FRCancerTerms from '@/Utils/ReadFiles/cancerTerms'

const FuctionsArray = [
  FRIndexCancers,
  FRCancerEquivalenceTerms,
  FRChemicalEquivalenceTerms,
  FRIndexPolifenols,
  FRArticlesTotal,
  FRRuleAssociationsExtracted,
  FRCancerTerms
]

const IndexFunctions = {
  indexCancers: 0,
  cancerEquivalenceTerms: 1,
  chemicalEquivalenceTerms: 2,
  indexPolifenols: 3,
  articlesTotal: 4,
  ruleAssociationsExtracted: 5,
  cancerTerms: 6
}

const store = async (req: Request, res: Response): Promise<Response> => {
  const { name, page } = req.body

  const nameFile = `${name}${page ? '-' + page : ''}`
  const file = JSON.parse(fs.readFileSync(`./backup/${nameFile}.json`, 'utf8'))

  if (!file) return res.status(401).json({ message: 'Arquivo não encontrado ou nome invalido.' })

  const data = file

  const keyIndexFunctions: keyof typeof IndexFunctions = name
  const index = IndexFunctions[keyIndexFunctions]

  await FuctionsArray[index](data)

  return res.json({ message: `Dados inseridos com sucesso! (${nameFile} - ${data.length} registros)` })
}

export default { store }
