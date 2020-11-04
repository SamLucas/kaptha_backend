import * as Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('ruleAssociationsExtracted', table => {
    table.increments('id').primary()
    table.string('sentence_id').notNullable()
    table.string('association_type').notNullable()
    table.string('R1').notNullable()
    table.string('R2').notNullable()
    table.string('R3').notNullable()
    table.string('R4').notNullable()
    table.string('R5').notNullable()
    table.string('R6').notNullable()
    table.string('R7').notNullable()
    table.string('R8').notNullable()
    table.string('R9').notNullable()
    table.string('R10').notNullable()
    table.string('R11').notNullable()
    table.string('R12').notNullable()
    table.string('R13').notNullable()
    table.string('R14').notNullable()
    table.string('R15').notNullable()
    table.string('HM12').notNullable()
    table.string('HM3').notNullable()
    table.string('HM4').notNullable()
    table.string('HM5').notNullable()
    table.string('HM6').notNullable()
    table.string('HM7').notNullable()
    table.string('HM8').notNullable()
    table.string('HM9').notNullable()
    table.string('HM10').notNullable()
    table.string('is_title').notNullable()
    table.string('has_entity').notNullable()
    table.string('is_association').notNullable()
    table.string('start_pos').notNullable()
    table.string('end_pos').notNullable()
    table.text('sentence').notNullable()
    table.text('original_sentence').notNullable()

    table.integer('pmid_article', 11).notNullable()
    // table.foreign('pmid_article')
    //   .references('pmid')
    //   .inTable('articlesTotal')

    table.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('ruleAssociationsExtracted')
}
