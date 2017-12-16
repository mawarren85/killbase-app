const assassins = require('../assassins');
const codenames = require('../codenames');
const contracts = require('../contracts');
const assassinsContracts = require('../assassins-contracts.js')

let codenamesDataObj;
let assassinsDataObj;
let assassinsContractsData;
let targetsDataObj;

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('assassins_contracts').del()
    .then(function() {
      // Inserts seed entries
      return knex('assassins').select('id', 'full_name')
        .then(function(assassinsData) {

          assassinsDataObj = {};

          assassinsData.forEach(function(assassinData) {
            if (assassinData.full_name !== '') {
              assassinsDataObj[assassinData.full_name] = assassinData.id
            }
          });
          //console.log(assassinsDataObj, 'assassins data ')
          return knex('codenames')
            .then(function(codenamesData) {

              codenamesDataObj = {};

              codenamesData.forEach(function(codenameData) {
                if (codenameData.codename !== '') {
                  codenamesDataObj[codenameData.code_name] = codenameData.assassin_id
                }
              });

              return knex('targets').select('target_name', 'id')
                .then(function(targetsData) {

                  targetsDataObj = {};

                  targetsData.forEach(function(targetData) {
                    targetsDataObj[targetData.target_name] = targetData.id
                  })
                  //  console.log(targetsDataObj, 'targets data obj')
                  return knex('contracts').select('id', 'target_id')
                    .then(function(contractsData) {

                      let contractsDataObj = {};

                      contractsData.forEach(function(contractData) {
                        contractsDataObj[contractData.target_id] = contractData.id
                      })
                      console.log(contractsDataObj, 'contracts data obj')

                      let targetIdContractIdMerge = {}

                      console.log(codenamesDataObj, 'codenames')

                      assassinsContractsData = [];

                      assassinsContracts.forEach(function(assassinContract) {
                        let tempAssassinContract = {}


                        if (assassinContract.full_name) {
                          tempAssassinContract = {
                            "assassin_id": assassinsDataObj[assassinContract.full_name],
                            "contract_id": targetsDataObj[assassinContract.target_name]
                          }
                        } else {
                          tempAssassinContract = {
                            "assassin_id": codenamesDataObj[assassinContract.code_name],
                            "contract_id": targetsDataObj[assassinContract.target_name]
                          }
                        }
                        // console.log(tempAssassinContract, 'temp assassin contract')
                        assassinsContractsData.push(tempAssassinContract);
                      })
                      // console.log(assassinsContractsData, 'assassins contracts data')
                      return knex('assassins_contracts').insert(assassinsContractsData);
                    });
                });
            });
        });
    });
};
