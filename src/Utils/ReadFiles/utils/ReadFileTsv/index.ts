import fs from 'fs'
import knex from '@/database/connection'
import { Request, Response } from 'express'

const SplitLine = (data: string): string[] =>
  data.split('\t').map(ele => {
    let newele = ele.replace('\"', '')
    newele = newele.replace('\"', '')
    newele = newele.replace('\r', '')
    return newele
  })

// interface ObjetoEntitiesTotal {
//   V1: number;
//   pubtatot_term: string;
//   db_term: string;
//   db_equivalence: string;
//   term_id: string;
//   mesh_id: string;
//   start_pos: number;
//   end_pos: number;
//   entity_type: string;
//   entity_pmid: number;
// }

const ReadFile = async (req: Request, res: Response): Promise<Response> => {
  const { name } = req.body

  const data = await fs.readFileSync(`./arquivos_tsv/${name}.tsv`, 'utf8')

  const lines = data.split('\n')
  const headers = SplitLine(lines[0])
  const result = []

  try {
    for (let k = 1; k < lines.length - 1; k++) {
      const obj: any = {}
      const currentline = SplitLine(lines[k])

      for (let j = 1; j < headers.length; j++) {
        if (currentline[j]) {
          obj[headers[j]] = currentline[j]
        } else {
          console.log(headers[j], j, currentline, k)
        }
      }

      result.push(obj)
    }

    const response = await fs.writeFile(
      `${name}.json`,
      JSON.stringify(result),
      'utf8',
      data => data
    )

    console.log(result.length)

    // await knex
    //   .batchInsert(name, result, 1)
    //   .then(() => {
    return res.status(200).json({ message: 'Dados cadastrados com sucesso.' })
    //   })
    //   .catch((err) => {
    //     console.log(err.stack)
    //     console.log('>>>', err)
    //     return res.status(400).json({ message: 'Não foi possivel realizar o cadastro.' })
    //   })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ message: 'Não foi possivel realizar o cadastro.' })
  }
}

export default { ReadFile }
