import knex from '@/database/connection'

export interface DRArticlesTotal {
  title_article: string;
  abstract_article: string;
  pmid: number;
}

export default async function FRArticlesTotal (data: DRArticlesTotal[]): Promise<void> {
  const dataFilter: DRArticlesTotal[] = []

  data.forEach((dataInfo: DRArticlesTotal) => {
    if (dataInfo.pmid) {
      dataFilter.push({
        title_article: dataInfo.title_article || '',
        abstract_article: dataInfo.abstract_article || '',
        pmid: dataInfo.pmid
      })
    }
  })

  await knex.batchInsert('articlesTotal', dataFilter, 1)
    .then(data => data)
    .catch(err => console.log(err))
}
