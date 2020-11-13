import knex from "@/database/connection";


function paginate(array: any[], page_size: number, page_number: number) {
  return array.slice((page_number - 1) * page_size, page_number * page_size);
}

export const handlePagination = async (response: any[], limitPag = 10000, nameTable = "") => {
  if (nameTable === "") return

  let currentPage = 0;
  console.log(response.length)

  while ((currentPage + 1) * limitPag < response.length) {

    currentPage = currentPage + 1
    const dataPerPag = paginate(response, limitPag, currentPage)

    await knex
      .batchInsert(nameTable, dataPerPag, 1)
      .then((data) => data)
      .catch(console.error);

    console.log(currentPage, dataPerPag.length)
  }

  const rest = response.slice(currentPage * limitPag)
  if (rest.length > 0) {
    await knex
      .batchInsert(nameTable, rest, 1)
      .then((data) => data)
      .catch(console.error);

    console.log(currentPage + 1, rest.length)
  }
}