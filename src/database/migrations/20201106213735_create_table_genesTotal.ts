import * as Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('genesTotal', table => {
    table.increments('id').primary()
    table.string("genes")
    table.string("id_term_hgnc")
    table.string("id_term")
    table.integer("total_ocorrence")
    table.integer("unique_ocorrence")
    table.text("pmids")
    table.float("ration")
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('genesTotal')
}