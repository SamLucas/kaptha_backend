import * as Knex from 'knex'

export async function up (knex: Knex): Promise<any> {
  return knex.schema.createTable('cancerEquivalenceTerms', table => {
    table.increments('id').primary()
    table.integer('idequivalence_relationship').notNullable()
    table.string('equivalence_term').notNullable()

    table.integer('idterm_descritor').unsigned().notNullable()

    table.foreign('idterm_descritor')
      .references('id_term')
      .inTable('indexCancers')

    table.timestamps(true, true)
  })
}

export async function down (knex: Knex): Promise<any> {
  return knex.schema.dropTable('cancerEquivalenceTerms')
}
