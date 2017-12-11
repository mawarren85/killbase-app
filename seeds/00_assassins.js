const assassins = require('../assassins');
const codenames = require('../codenames');


exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('assassins').del()
      .then(function() {
        return knex('codenames').del()
      })
      .then(function() {
        // insert assassins
        let assassinData = [];

        assassins.forEach(function(assassin) {
          assassinData.push(assassin)
        })
        return knex('assassins').insert(assassinData).returning(['id', 'contact_info'])
      })

      // ========================= code names ================

      .then(function(assassinsReturned) {
        // Inserts seed entries

        let reducedCodenames = codenames.reduce(function(obj, codename) {
          obj[codename.contact_info] = codename;
          return obj;
        }, {});
        // obj is the accumulator..creating new objects to an empty object where emails are the keys...codename is the current object you are iterating over


        let codeNameInserts = [];
        assassinsReturned.forEach(function(assassin) {
          const codename = reducedCodenames[assassin.contact_info];
          if (codename) {
            codeNameInserts.push({
              assassin_id: assassin.id,
              code_name: codename.code_name
            });
         }
        });

        // iterating through the returned data from inserting assassins..
        // this is saying if there is a value inside the email keys
        // push an object into an array where you can do a mass insert setting the assassin_id and the assassin_code_name

        return knex('codenames').insert(codeNameInserts);
      });
    };
