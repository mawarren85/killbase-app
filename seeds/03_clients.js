let clients = require('../clients')

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('clients').del()
    .then(function () {
      // Inserts seed entries
      let clientList = [];
      clients.forEach(function(client) {
        clientList.push(client)
      });
      console.log('seeding clients')
      return knex('clients').insert(clientList);
    });
};
