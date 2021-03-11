import knex from "@/database/connection";

export interface DREntitiesTotal {
  V1: number;
  pubtatot_term: string;
  db_term: string;
  db_equivalence: string;
  term_id: string;
  mesh_id: string;
  start_pos: number;
  end_pos: number;
  entity_type: string;
  entity_pmid: number;
}

function paginate(array: DREntitiesTotal[], page_size: number, page_number: number) {
  return array.slice((page_number - 1) * page_size, page_number * page_size);
}

export default async function FREntitiesTotal(
  data: DREntitiesTotal[]
): Promise<void> {
  const response = data.map((dataInfo: DREntitiesTotal) => ({
    V1: dataInfo.V1,
    pubtatot_term: dataInfo.pubtatot_term,
    db_term: dataInfo.db_term,
    db_equivalence: dataInfo.db_equivalence,
    term_id: dataInfo.term_id,
    mesh_id: dataInfo.mesh_id,
    start_pos: dataInfo.start_pos,
    end_pos: dataInfo.end_pos,
    entity_type: dataInfo.entity_type,
    entity_pmid: dataInfo.entity_pmid,
  }));

  let currentPage = 0;
  const limitPag = 10000

  // console.log(response.length)

  while ((currentPage + 1) * limitPag < response.length) {

    currentPage = currentPage + 1
    const dataPerPag = paginate(response, limitPag, currentPage)

    await knex
      .batchInsert("entitiesTotal", dataPerPag, 1)
      .then((data) => data)
      .catch(console.error);

    // console.log(currentPage, dataPerPag.length)
  }

  const rest = response.slice(currentPage * limitPag)
  if (rest.length > 0) {
    await knex
      .batchInsert("entitiesTotal", rest, 1)
      .then((data) => data)
      .catch(console.error);

    // console.log(currentPage, rest.length)
  }
}
