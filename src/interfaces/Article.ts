export default interface Article {
  title_article: string;
  abstract_article: string;
  pmid: number;
  SVM_PROB: number;
  FORESTS_PROB: number;
  LOGITBOOST_PROB: number;
  MAXENTROPY_PROB: number;
  med: number;
}