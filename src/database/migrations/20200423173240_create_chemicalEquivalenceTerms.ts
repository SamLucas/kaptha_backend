import * as Knex from 'knex'

export async function up (knex: Knex): Promise<any> {
  return knex.schema.createTable('chemicalEquivalenceTerms', table => {
    table.increments('id').primary()
    table.integer('idequivalence_relationship').notNullable()
    table.string('equivalence_term').notNullable()

    table.integer('id_term')
      .unsigned()
      .notNullable()

    table.foreign('id_term')
      .references('id_term')
      .inTable('indexPolifenols')

    table.timestamps(true, true)
  })
}

export async function down (knex: Knex): Promise<any> {
  return knex.schema.dropTable('chemicalEquivalenceTerms')
}
