import * as Knex from 'knex'

export async function up (knex: Knex): Promise<any> {
  return knex.schema.createTable('entitiesTotal', table => {
    table.increments('id').primary()
    table.integer('V1')
    table.string('pubtatot_term')
    table.string('db_term')
    table.string('db_equivalence')
    table.string('mesh_id')
    table.string('term_id')
    table.specificType('start_pos', 'INT[]')
    table.specificType('end_pos', 'INT[]')
    table.string('entity_type')
    table.integer('entity_pmid')
    table.timestamps(true, true)
  })
}

export async function down (knex: Knex): Promise<any> {
  return knex.schema.dropTable('entitiesTotal')
}
