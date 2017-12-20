/*jshint esversion: 6 */

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('../knexfile')['production'];
var knex = require('knex')(config);
var port = process.env.PORT || 8000;


/* ============== Get ======================================*/

/* ============== get all of the contracts ==============================*/


router.get('/', function(req, res) {
  let targetContracts;
  knex('targets')
    .join('contracts', {
      'targets.id': 'contracts.target_id '
    })

    .then(function(results) {
      targetContracts = results;

      knex('clients')
        .then(function(clientData) {

          let clientIds = [];
          let temp = {};

          clientData.forEach(function(data) {
            temp[data.id] = {
              'client_name': data.client_name
            };
          });
          clientIds.push(temp);

          targetContracts.forEach(function(targetContract) {
            targetContract["client_name"] =
              clientIds[0][targetContract.client_id].client_name;
          });

          res.render('contracts-page', {
            targetContracts: targetContracts
          });
        });
    });
});

/* ============== new contract form page ==============================*/

router.get('/new', function(req, res) {
  knex('clients').select()
    .then(function(results) {

      res.render('new-contract', {
        results: results
      });
    });
});



/* ============== edit a contract ==============================*/

router.get('/:id/edit', function(req, res) {
  let contractId = req.params.id;
  let targetContract;
  let clientNames;

  knex('clients')
    .join('contracts', 'clients.id', 'contracts.client_id')
    .select('contracts.client_id', 'clients.id', 'clients.client_name')
    .then(function(results) {
      clientNames = results;
    });

  knex('targets')
    .join('contracts', {
      'targets.id': 'contracts.target_id '
    })

    .then(function(results) {

      results.forEach(function(result) {

        if (result.id == contractId) {
          targetContract = result;
        }
      });
      knex('clients')
        .where('clients.id', targetContract.client_id)
        .then(function(results) {
          targetContract["client_name"] = results[0].client_name;

          res.render('contract-edit', {
            targetContract: targetContract,
            clientNames: clientNames
          });
        });
    });
});

/* ============== get a single contract page ==============================*/

router.get('/:id', function(req, res) {
  let contractId = req.params.id;
  let targetContract;
  let clientNames;
  let assassinNames;
  let assassinContracts;

  knex('assassins_contracts').where('contract_id', contractId)
    .join('assassins', 'assassins_contracts.assassin_id', 'assassins.id')
    .join('codenames', 'assassins.id', 'codenames.assassin_id')
    .then(function(results) {
      assassinContracts = results;
    });
console.log(assassinContracts, 'asssssssssssssss')
  knex('assassins')
    .join('codenames', 'assassins.id', 'codenames.assassin_id')
    .select('assassins.id', 'full_name', 'code_name')
    .then(function(results) {
      assassinNames = results;

    });

  knex('clients')
    .join('contracts', 'clients.id', 'contracts.client_id')
    .select('contracts.client_id', 'clients.id', 'clients.client_name')
    .then(function(results) {
      clientNames = results;
    });

  knex('targets')
    .join('contracts', {
      'targets.id': 'contracts.target_id '
    })

    .then(function(results) {

      results.forEach(function(result) {

        if (result.id == contractId) {
          targetContract = result;
        }
      });

      knex('clients')
        .where('clients.id', targetContract.client_id)
        .then(function(results) {
          targetContract["client_name"] = results[0].client_name;

          res.render('contract-page', {
            targetContract: targetContract,
            clientNames: clientNames,
            assassinNames: assassinNames,
            assassinContracts: assassinContracts
          });
        });
    });
});

/* ============== remove assassin from contract ==============================*/


router.post('/:id/:assassinid/removed', function(req, res) {
  let assassinId = req.params.assassinid;
  let contractId = req.params.id;
  let assassinName;

  knex('assassins_contracts').where({
      contract_id: contractId,
      assassin_id: assassinId
    }).del()
    .then(function() {

      knex('assassins').where('id', assassinId)
        .join('codenames', 'assassins.id', 'codenames.assassin_id')
        .then(function(results) {
          assassinName = results;

          res.render('contract-assassin-removed', {
            assassinName: assassinName,
            contractId: contractId
          });
        });
    });
});


/* ============== Delete ===========================*/

router.get('/:id/deleted', function(req, res) {
  let contractId = req.params.id;
  let contract;
  let client;
  let target;

  knex('contracts').where('id', contractId)
    .then(function(results) {
      contract = results;

      knex('clients').where('id', contract[0].client_id)
        .then(function(results) {
          client = results;

          knex('targets').where('id', contract[0].target_id)
            .then(function(results) {
              target = results;

              knex('contracts').where('id', contractId).del()
                .then(function(results) {
                  knex('targets').where('id', contract[0].target_id).del()
                    .then(function(results) {
                      res.render('contract-deleted', {
                        contract: contract,
                        client: client,
                        target: target
                      });
                    });
                });
            });
        });
    });
});


/* ============== update a contract ===========================*/

// get post body from form to update tables
//update targets table
//get target and client id's
//update contracts table

router.post('/:id/updated', function(req, res) {
  let contractId = req.params.id;
  let bodyName = req.body.target_name;
  let clientName;
  let clientObject;
  let targetObject;
  let newTargetInfo;
  let newContractInfo;
  let contractObject;

  knex('contracts')
    .where('id', contractId)
    .select('id', 'client_id', 'target_id')
    .then(function(results) {

      contractObject = results;

      knex('targets')
        .where('id', contractObject[0].target_id)
        .then(function(results) {
          targetObject = results;

          newTargetInfo = {
            "target_name": req.body.target_name,
            "target_location": req.body.target_location,
            "target_photo": req.body.target_photo,
            "target_security": req.body.target_security
          };

          if (req.body.client_name !== '') {
            clientName = req.body.client_name;
          } else {
            clientName = req.body.clients;
          }

          knex('clients')
            .where('client_name', clientName)
            .then(function(results) {
              clientObject = results;

              newContractInfo = {
                "target_id": targetObject[0].id,
                "client_id": clientObject[0].id,
                "budget": req.body.budget
              };

              knex('contracts').where('id', contractId)
                .update(newContractInfo)
                .then(function(results) {
                  let newContractResults = results;

                  knex('targets').where('id', targetObject[0].id)
                    .update(newTargetInfo)
                    .then(function(results) {
                      let newTargetResults = results;

                      res.render('contract-updated', {
                        target: newTargetInfo,
                        contract: newContractInfo,
                        clientName: clientName
                      });
                    });
                });
            });
        });
    });
});


/* ============== Add a contract ===========================*/

//adding to contract table -----
//get target id from target table
//get client id from client table
//budget, completed from form

//adding to target table ---- (creating new target)
//target name, target location, target photo, target security

router.post('/added', function(req, res) {

  let info = req.body;
  let newContract = [];
  let newTarget = [];
  let insertedTarget;
  let clientData;

  newTarget.push({
    "target_name": info.target_name,
    "target_location": info.target_location,
    "target_photo": info.target_photo,
    "target_security": info.target_security
  });

  return knex('targets').insert(newTarget).returning(['id', 'target_name'])
    .then(function(newTargetData) {

      insertedTarget = {};
      insertedTarget[newTargetData[0].target_name] = newTargetData[0].id;

      knex('clients').where('client_name', info.client_name)
        .then(function(results) {
          clientData = {};
          clientData[results[0].client_name] = results[0].id;

          newContract.push({
            "target_id": insertedTarget[info.target_name],
            "client_id": clientData[info.client_name],
            "budget": info.budget,
            "completed": false
          });

          return knex('contracts').insert(newContract)
        })

        .then(function() {

          res.render('contract-added', {
            target: newTarget,
            contract: newContract,
            client: info.client_name
          });
        });
    });
});


/* ============== add assassin to a contract ===========================*/



router.post('/:id', function(req, res) {
  let contractId = req.params.id;
  let targetContract;
  let clientNames;
  let assassinNames;
  let assassinContracts;
  let assassinSelected = req.body;
  let assignedAssassin;

  knex('assassins')
    .where('full_name', assassinSelected.assassins)
    .select('id', 'full_name')
    .then(function(results) {

      if (results.length) {
          assignedAssassin = {
          assassin_id: results[0].id,
          contract_id: contractId };
        }
          knex('codenames')
            .where('code_name', assassinSelected.assassins)
            .then(function(results) {
              if (results.length) {
                assignedAssassin = {
                  assassin_id: results[0].assassin_id,
                  contract_id: contractId
                };
              }

          return knex('assassins_contracts').insert(assignedAssassin)
            .then(function() {

              knex('assassins_contracts').where('contract_id', contractId)
                .join('assassins', 'assassins_contracts.assassin_id', 'assassins.id')
                .join('codenames', 'assassins.id', 'codenames.assassin_id')
                .then(function(results) {
                  assassinContracts = results;
                });

              knex('assassins')
                .join('codenames', 'assassins.id', 'codenames.assassin_id')
                .select('assassins.id', 'full_name', 'code_name')
                .then(function(results) {
                  assassinNames = results;
                });

              knex('clients')
                .join('contracts', 'clients.id', 'contracts.client_id')
                .select('contracts.client_id', 'clients.id', 'clients.client_name')
                .then(function(results) {
                  clientNames = results;
                });

              knex('targets')
                .join('contracts', {
                  'targets.id': 'contracts.target_id '
                })

                .then(function(results) {

                  results.forEach(function(result) {

                    if (result.id == contractId) {
                      targetContract = result;
                    }
                  });

                  knex('clients')
                    .where('clients.id', targetContract.client_id)
                    .then(function(results) {
                      targetContract["client_name"] = results[0].client_name;

                      res.render('contract-page', {
                        targetContract: targetContract,
                        clientNames: clientNames,
                        assassinNames: assassinNames,
                        assassinContracts: assassinContracts
                      });
                    });
                });
            });
        });
    });
});




router.use(function(req, res) {
  res.set('Content-Type', 'text/plain');
  res.sendStatus(404);
});

module.exports = router;
