import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.alterTable('articlesTotal', function (table) {
    table.float('SVM_PROB');
    table.float('FORESTS_PROB');
    table.float('LOGITBOOST_PROB');
    table.float('MAXENTROPY_PROB');
    table.float('med');
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.table('articlesTotal', function (table) {
    table.dropColumn('SVM_PROB');
    table.dropColumn('FORESTS_PROB');
    table.dropColumn('LOGITBOOST_PROB');
    table.dropColumn('MAXENTROPY_PROB');
    table.dropColumn('med');
  });
}

