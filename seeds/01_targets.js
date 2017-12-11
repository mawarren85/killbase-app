const targets = require('../targets');

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('targets').del()

    .then(function () {
      // Inserts seed entries
      let targetData = [];
      targets.forEach(function(target) {
        targetData.push(target);
      });
      console.log(targetData);

      return knex('targets').insert(targetData);
    });
};
