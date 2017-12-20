let targets = require('../targets');
let contracts = require('../contracts');
let assassins = require('../assassins');
let clients = require('../clients');
const assassinsContracts = require('../assassins-contracts.js')

let codenamesDataObj;
let assassinsDataObj;
let assassinsContractsData;
let clientsDataObj
let targetsDataObj;


let targetsInfo;
let clientsInfo;

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries

  return knex('contracts').del()
    .then(function() {
      return knex('assassins_contracts').del()
    })
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
          targetsInfo = targetsData;
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
              clientsInfo = clientsData;
              clientsDataObj = {};


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
                  "target_id": targetsDataObj[targetName]["id"],
                  "client_id": clientsDataObj[clientName]["id"],
                  "budget": contract.budget,
                  "completed": contract.completed
                }
                contractsData.push(tempContractObj);

              })
              console.log('seeding contracts')
              //  console.log(contractsData, 'contracts data')
              return knex('contracts').insert(contractsData).returning(['id', 'target_id', 'client_id'])
            })

            // seed assassins_contracts -----------
            .then(function(results) {

              let returnedContracts = results;
              let dataIds = []


              assassinsContracts.forEach(function(assContract) {
                let tempobj = {
                  client_id: clientsDataObj[assContract.client_name],
                  target_id: targetsDataObj[assContract.target_name]
                }

                returnedContracts.forEach(function(contract) {
                  let tempobj2;

                  if (tempobj.client_id.id === contract.client_id && tempobj.target_id.id === contract.target_id) {
                    if (assContract.full_name) {
                      tempobj2 = {
                        "contract_id": contract.id,
                        "client_id": tempobj.client_id,
                        "target_id": tempobj.target_id,
                        "full_name": assContract.full_name
                      }
                    }
                    if (assContract.code_name) {
                      tempobj2 = {
                        "contract_id": contract.id,
                        "client_id": tempobj.client_id,
                        "target_id": tempobj.target_id,
                        "code_name": assContract.code_name
                      }
                    }
                    dataIds.push(tempobj2)
                  }
                })
              })

              return knex('assassins')
              .select('assassins.id', 'full_name', 'code_name', 'codenames.assassin_id')
              .join('codenames', 'assassins.id', 'codenames.assassin_id')

              .then(function(assassins) {
                let assConData = [];

                dataIds.forEach(function(data) {
                  assassins.forEach(function(assassin) {
                    if (data.full_name === assassin.full_name) {
                      assConData.push({
                        "assassin_id": assassin.assassin_id,
                        "contract_id": data.contract_id
                      })
                    }
                    if (data.code_name === assassin.code_name) {
                      assConData.push({
                        "assassin_id": assassin.assassin_id,
                        "contract_id": data.contract_id
                      })
                    }
                  })
                })

              return knex('assassins_contracts').insert(assConData)
              })
            })









          //       .then(function() {
          //         return knex('assassins').select('id', 'full_name')
          //         .then(function(assassinsData) {
          //
          //           assassinsDataObj = {};
          //
          //           assassinsData.forEach(function(assassinData) {
          //             if (assassinData.full_name !== '') {
          //               assassinsDataObj[assassinData.full_name] = assassinData.id
          //             }
          //           });
          //           //console.log(assassinsDataObj, 'assassins data ')
          //           return knex('codenames')
          //             .then(function(codenamesData) {
          //
          //               codenamesDataObj = {};
          //
          //               codenamesData.forEach(function(codenameData) {
          //                 if (codenameData.codename !== '') {
          //                   codenamesDataObj[codenameData.code_name] = codenameData.assassin_id
          //                 }
          //               });
          //
          //               return knex('contracts')
          //                 .join('targets', 'contracts.target_id', 'targets.id')
          //                 .join('clients', 'contracts.client_id', 'clients.id')
          //
          //                 .then(function(results) {
          //
          //                   let contractsData = results
          //                   console.log(results, 'resuoltss')
          //                   assassinsContractsData = [];
          //
          //                   assassinsContracts.forEach(function(assassinContract) {
          //
          //                     contractsData.forEach(function(contractData) {
          //                       if (assassinContract.target_name === contractData.target_name && assassinContract.client_name === contractData.client_name) {
          //
          //                         if (assassinContract.full_name) {
          //                           assassinsContractsData.push({
          //                             "assassin_id": assassinsDataObj[assassinContract.full_name],
          //                             "contract_id": contractData.id
          //                           })
          //                           console.log(contractData.id, 'inside fullname')
          //                         } else {
          //                           assassinsContractsData.push({
          //                             "assassin_id": codenamesDataObj[assassinContract.code_name],
          //                             "contract_id": contractData.id
          //                           })
          //                         }
          //                       }
          //
          //                     })
          //
          //                   })
          //                   // console.log(assassinsContractsData, 'assassins contracts data')
          //                   console.log('seeding assassins-contracts')
          //                   console.log(assassinsContractsData, 'asscontract data')
          //                   return knex('assassins_contracts').insert(assassinsContractsData);
          //                 });
          //             });
          //         });
          //     });
          //    });
          // })
        })
    });
};
