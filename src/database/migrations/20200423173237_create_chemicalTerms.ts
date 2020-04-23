import * as Knex from 'knex'

export async function up (knex: Knex): Promise<any> {
  return knex.schema.createTable('chemicalTerms', table => {
    table.increments('id').primary()
    table.text('Name').notNullable()
    table.string('DrugBankID').notNullable()
    table.string('PubChemCompoundID').notNullable()
    table.string('WikipediaID').notNullable()
    table.string('DrugscomLink').notNullable()
    table.string('ChemSpiderID').notNullable()
    table.string('MeshID').notNullable()
    table.string('idterm_descritor').notNullable()
    table.integer('term_type_idterm_type').notNullable()
    table.integer('term_type_mesh').notNullable()
    table.string('tree').notNullable()
    table.timestamps(true, true)
  })
}

export async function down (knex: Knex): Promise<any> {
  return knex.schema.dropTable('chemicalTerms')
}
