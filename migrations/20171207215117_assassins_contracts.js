
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('assassins_contracts', function(table) {
    table.integer('assassin_id').unsigned();
    table.foreign('assassin_id').references('assassins.id').onDelete('cascade');
    table.integer('contract_id').unsigned();
    table.foreign('contract_id').references('contracts.id').onDelete('cascade');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('assassins_contracts');
};
