
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('assassins', function(table) {
    table.increments().primary();
    table.string('full_name').notNullable().defaultTo('');
    table.string('weapon').notNullable().defaultTo('');
    table.string('contact_info').notNullable().defaultTo('');
    table.integer('age').notNullable();
    table.integer('price').notNullable();
    table.float('rating').notNullable();
    table.integer('kills');
    table.string('assassin_photo');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('assassins');
};
