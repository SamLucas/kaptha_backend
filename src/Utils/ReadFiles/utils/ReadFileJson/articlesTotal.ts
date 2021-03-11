import knex from '@/database/connection'
import fs from 'fs'

export interface DRArticlesTotal {
  title_article: string;
  abstract_article: string;
  pmid: number;
  SVM_PROB: number;
  FORESTS_PROB: number;
  LOGITBOOST_PROB: number;
  MAXENTROPY_PROB: number;
  med: number;
}

export interface Score {
  id: string;
  pmid: string;
  SVM_PROB: number;
  FORESTS_PROB: number;
  LOGITBOOST_PROB: number;
  MAXENTROPY_PROB: number;
  med: number;
}

export default async function FRArticlesTotal(data: DRArticlesTotal[]): Promise<void> {

  const file: Score[] = JSON.parse(
    fs.readFileSync("./backup/table_articles_ensemble.json", "utf8")
  );

  const dataFilter: DRArticlesTotal[] = []

  data.forEach((dataInfo: DRArticlesTotal) => {
    if (dataInfo.pmid) {

      const [details] =
        file.filter((ele: Score) => parseInt(ele.pmid) == dataInfo.pmid).
          map(({ pmid, id, ...rest }) => ({ ...rest }))

      dataFilter.push({
        title_article: dataInfo.title_article || '',
        abstract_article: dataInfo.abstract_article || '',
        pmid: dataInfo.pmid,
        ...details
      })
    }
  })

  // console.log(dataFilter[0])

  await knex.batchInsert('articlesTotal', dataFilter, 1)
    .then(data => data)
    .catch(err => console.log(err))
}
