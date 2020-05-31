import { Request, Response } from 'express'
import fs from 'fs'

import FRIndexCancers from '@/Utils/ReadFiles/utils/ReadFileJson/indexCancers'
import FRCancerEquivalenceTerms from '@/Utils/ReadFiles/utils/ReadFileJson/cancerEquivalenceTerms'
import FRChemicalEquivalenceTerms from '@/Utils/ReadFiles/utils/ReadFileJson/chemicalEquivalenceTerms'
import FRIndexPolifenols from '@/Utils/ReadFiles/utils/ReadFileJson/indexPolifenols'
import FRArticlesTotal from '@/Utils/ReadFiles/utils/ReadFileJson/articlesTotal'
import FRRuleAssociationsExtracted from '@/Utils/ReadFiles/utils/ReadFileJson/ruleAssociationsExtracted'
import FRCancerTerms from '@/Utils/ReadFiles/utils/ReadFileJson/cancerTerms'
import FRChemicalTerms from '@/Utils/ReadFiles/utils/ReadFileJson/chemicalTerms'
import FREntitiesTotal from '@/Utils/ReadFiles/utils/ReadFileJson/entitiesTotal'

const FuctionsArray = [
  FRIndexCancers,
  FRCancerEquivalenceTerms,
  FRChemicalEquivalenceTerms,
  FRIndexPolifenols,
  FRArticlesTotal,
  FRRuleAssociationsExtracted,
  FRCancerTerms,
  FRChemicalTerms,
  FREntitiesTotal
]

const IndexFunctions = {
  indexCancers: 0,
  indexPolifenols: 3,
  cancerEquivalenceTerms: 1,
  chemicalEquivalenceTerms: 2,
  articlesTotal: 4,
  ruleAssociationsExtracted: 5,
  cancerTerms: 6,
  chemicalTerms: 7,
  entitiesTotal: 8
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
