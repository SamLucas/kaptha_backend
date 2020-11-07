import * as Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('indexGene', table => {
    table.increments('id').primary()
    table.string("id_polifenol").notNullable()
    table.string("polifenol").notNullable()
    table.string("id_gene").notNullable()
    table.string("gene").notNullable()
    table.string("quant").notNullable()
    table.text("pmids").notNullable()
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('indexGene')
}