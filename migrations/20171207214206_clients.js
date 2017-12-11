
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('clients', function(table) {
    table.increments().primary();
    table.string('client_name').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('clients');
};
