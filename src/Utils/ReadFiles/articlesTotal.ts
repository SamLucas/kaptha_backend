import knex from '@/database/connection'

interface DRArticlesTotal {
  title_article: string;
  abstract_article: string;
  pmid: string;
}

export default async function FRArticlesTotal (data: DRArticlesTotal[]): Promise<void> {
  const dataFilter: DRArticlesTotal[] = data.map((dataInfo: DRArticlesTotal) =>
    ({
      title_article: dataInfo.title_article || '',
      abstract_article: dataInfo.abstract_article || '',
      pmid: dataInfo.pmid || ''
    })
  )

  await knex.batchInsert('articlesTotal', dataFilter, 1)
    .then(data => data)
    .catch(err => console.log(err))
}
