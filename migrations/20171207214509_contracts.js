
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('contracts', function(table) {
    table.increments().primary();
    table.integer('target_id').unsigned();
    table.foreign('target_id').references('targets.id').onDelete('cascade');
    table.integer('client_id').unsigned();
    table.foreign('client_id').references('clients.id').onDelete('cascade');
    table.integer('budget').notNullable();
    table.boolean('completed');
    table.integer('completed_by').unsigned();
    table.foreign('completed_by').references('assassins.id').onDelete('cascade');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('contracts');
};
