
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('targets', function(table) {
    table.increments().primary();
    table.string('target_name').notNullable().defaultTo('');
    table.string('target_location').notNullable().defaultTo('');
    table.string('target_photo');
    table.integer('target_security').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('targets');
};
