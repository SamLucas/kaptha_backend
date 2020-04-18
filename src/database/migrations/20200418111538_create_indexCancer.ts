import * as Knex from 'knex'

export async function up (knex: Knex): Promise<any> {
  return knex.schema.createTable('indexCancer', table => {
    table.increments('id').primary()
    table.string('cancer').notNullable()
    table.integer('id_term').notNullable()
    table.integer('total_ocorrence').notNullable()
    table.integer('unique_ocorrence').notNullable()
    table.text('pmids').notNullable()
    table.float('ration').notNullable()
    table.timestamps(true, true)
  })
}

export async function down (knex: Knex): Promise<any> {
  return knex.schema.dropTable('indexCancer')
}
