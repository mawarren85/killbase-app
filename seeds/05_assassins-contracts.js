const assassins = require('../assassins');
const codenames = require('../contracts');

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('assassins_contracts').del()
    .then(function () {
      // Inserts seed entries


      return knex('assassins_contracts').insert();
    });
};
