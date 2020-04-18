import knex from '@/database/connection'

interface DRRuleAssociationsExtracted {
  sentence_id: number;
  association_type: string;
  R1: string;
  R2: string;
  R3: string;
  R4: string;
  R5: string;
  R6: string;
  R7: string;
  R8: string;
  R9: string;
  R10: string;
  R11: string;
  R12: string;
  R13: string;
  R14: string;
  R15: string;
  HM12: string;
  HM3: string;
  HM4: string;
  HM5: string;
  HM6: string;
  HM7: string;
  HM8: string;
  HM9: string;
  HM10: string;
  is_title: string;
  has_entity: string;
  is_association: string;
  start_pos: string;
  end_pos: string;
  sentence: string;
  original_sentence: string;
  pmid: string;
}

export default function FRRuleAssociationsExtracted (data: DRRuleAssociationsExtracted[]): void {
  console.log(data.length)
  data.forEach((dataInfo: DRRuleAssociationsExtracted) => {
    const {
      sentence_id,
      association_type,
      R1,
      R2,
      R3,
      R4,
      R5,
      R6,
      R7,
      R8,
      R9,
      R10,
      R11,
      R12,
      R13,
      R14,
      R15,
      HM12,
      HM3,
      HM4,
      HM5,
      HM6,
      HM7,
      HM8,
      HM9,
      HM10,
      is_title,
      has_entity,
      is_association,
      start_pos,
      end_pos,
      sentence,
      original_sentence,
      pmid
    } = dataInfo

    knex('ruleAssociationsExtracted').insert({
      sentence_id,
      association_type,
      R1,
      R2,
      R3,
      R4,
      R5,
      R6,
      R7,
      R8,
      R9,
      R10,
      R11,
      R12,
      R13,
      R14,
      R15,
      HM12,
      HM3,
      HM4,
      HM5,
      HM6,
      HM7,
      HM8,
      HM9,
      HM10,
      is_title,
      has_entity,
      is_association,
      start_pos,
      end_pos,
      sentence,
      original_sentence,
      pmid
    })
      .then(data => data)
      .catch(err => console.log(err))
  })
}
