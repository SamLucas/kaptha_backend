import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.alterTable('ruleAssociationsExtracted', function (table) {
    table.string('R16');
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.table('ruleAssociationsExtracted', function (table) {
    table.dropColumn('R16');
  });
}

