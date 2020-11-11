import ArticleInterface from '@/interfaces/Article'
import RuleInterface from '@/interfaces/Rules'

export default interface Result {
  pmid: String;
  peso_rules: Number;
  peso_entities: Number;
  peso_genes: Number;
  peso_final: Number;
  article: ArticleInterface[];
  rule: RuleInterface[]
}