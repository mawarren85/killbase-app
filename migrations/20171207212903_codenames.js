
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('codenames', function(table) {
    table.integer('assassin_id').unsigned();
    table.foreign('assassin_id').references('assassins.id').onDelete('cascade');
    table.string('code_name');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('codenames');
};
