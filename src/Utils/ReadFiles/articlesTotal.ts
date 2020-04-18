import knex from '@/database/connection'

interface DRArticlesTotal {
  title_article: string;
  abstract_article: string;
  pmid: string;
}

export default function FRArticlesTotal (data: DRArticlesTotal[]): void {
  data.forEach((dataInfo: DRArticlesTotal) => {
    const {
      title_article,
      abstract_article,
      pmid
    } = dataInfo

    knex('articlesTotal').insert({
      title_article,
      abstract_article,
      pmid
    })
      .then(data => data)
      .catch(err => console.log(err))
  })
}
