import * as Knex from 'knex'

export async function up (knex: Knex): Promise<any> {
  return knex.schema.createTable('articlesTotal', table => {
    table.increments('id').primary()
    table.text('title_article').notNullable()
    table.text('abstract_article').notNullable()
    table.integer('pmid').unique().notNullable()
    table.timestamps(true, true)
  })
}

export async function down (knex: Knex): Promise<any> {
  return knex.schema.dropTable('articlesTotal')
}
