import * as Knex from 'knex'

export async function up (knex: Knex): Promise<any> {
  return knex.schema.createTable('chemicalTerms', table => {
    table.increments('id').primary()
    table.text('Name').notNullable()
    table.text('DrugBankID').notNullable()
    table.text('PubChemCompoundID').notNullable()
    table.text('WikipediaID').notNullable()
    table.text('DrugscomLink').notNullable()
    table.text('ChemSpiderID').notNullable()
    table.text('MeshID').notNullable()
    table.text('idterm_descritor').notNullable()
    table.integer('term_type_idterm_type').notNullable()
    table.integer('term_type_mesh').notNullable()
    table.text('tree').notNullable()
    table.timestamps(true, true)
  })
}

export async function down (knex: Knex): Promise<any> {
  return knex.schema.dropTable('chemicalTerms')
}
