let targets = require('../targets');
let contracts = require('../contracts');
let assassins = require('../assassins');
let clients = require('../clients');

var targetsDataObj;

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries

  return knex('contracts').del()

    .then(function() {
      //get target_id's
      return knex('targets')
        .select('id', 'target_name')
        .then(function(targetsData) {

          /*  put targetsdata in an object to be able to easily connect target id to target name from contracts page
          object formatted like this...
          { 'Butch Coolidge': { id: 386 },
          'The Jaguar': { id: 387 } }
          */

             targetsDataObj = {}

          targetsData.forEach(function(targetData) {
            targetsDataObj[targetData.target_name] = {
              "id": targetData.id
            };
          });
        })

        .then(function() {
          //get client_id's
          return knex('clients')
            .then(function(clientsData) {
              //make clientsData into a reformatted object like targetsData above
              let clientsDataObj = {};

              clientsData.forEach(function(clientData) {
                clientsDataObj[clientData.client_name] = {
                  "id": clientData.id
                };
              });

              let contractsData = [];

              contracts.forEach(function(contract) {

                var targetName = contract.target_name
                var clientName = contract.client_name
                //  console.log(targetsDataObj[targetName]["id"], 'targ name')
                let tempContractObj = {
                  "target_id" : targetsDataObj[targetName]["id"],
                  "client_id": clientsDataObj[clientName]["id"],
                  "budget": contract.budget,
                  "completed": contract.completed
                }
                contractsData.push(tempContractObj);

              })
            //  console.log(contractsData, 'contracts data')
              return knex('contracts').insert(contractsData);
            })
        })
      //     targetData------------------
      // { 'Butch Coolidge': { id: 386 },
      //   'The Jaguar': { id: 387 },
      //   'Norman Stansfield': { id: 388 },
      //   'Santino D\'Antonio': { id: 389 },
      //   'Sonny Valerio': { id: 390 } }

      //  })
      //let contractsData= [];
      //let targetNames = [];
      //let clientNames = []



      //  targets.forEach(function (target) {
      //    //targetNames.push({"target_name" : target.target_name});
      //  contractsData.push(knex('targets').select('id').where('target_name', 'target.target_name'))
      //    contractsData.push({
      //      "target_id":
      //    })
      //
      //
      //    console.log(target.target_name, 'temp target id')
      //
      // });
      //console.log(clients)


      //  return knex('contracts').insert(contractsData);



    });
};


//contracts.budget
//contracts.completed
// var clients =
// [ { client_name: 'Marcellus Wallace' },
//   { client_name: 'Concerto' },
//   { client_name: 'Mathilda' },
//   { client_name: 'Winston' },
//   { client_name: 'Ray Vargo' } ]


// var targetName =
// [ { target_name: 'Butch Coolidge' },
//   { target_name: 'The Jaguar' },
//   { target_name: 'Norman Stansfield' },
//   { target_name: 'Santino D\'Antonio' },
//   { target_name: 'Sonny Valerio' } ]





/*  [ {target_id:
        client_id:
        budget:
        completed:
        completed_by:
      }]
      */
