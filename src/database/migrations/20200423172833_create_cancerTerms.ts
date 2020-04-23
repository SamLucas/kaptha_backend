import * as Knex from 'knex'

export async function up (knex: Knex): Promise<any> {
  return knex.schema.createTable('cancerTerms', table => {
    table.increments('id').primary()
    table.integer('idterm_descritor').notNullable()
    table.integer('term_type_idterm_type').notNullable()
    table.string('term_description').notNullable()
    table.text('term_definition').notNullable()
    table.string('link_wiki').notNullable()
    table.string('term_type_mesh').notNullable()
    table.timestamps(true, true)
  })
}

export async function down (knex: Knex): Promise<any> {
  return knex.schema.dropTable('cancerTerms')
}
