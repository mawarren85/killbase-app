/*jshint esversion: 6 */


var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('../knexfile')['development'];
var knex = require('knex')(config);
var port = process.env.PORT || 8000



/* ============== Get all assassins ===========================*/

router.get('/', function(req, res) {
  knex.from('assassins').innerJoin('codenames', 'assassins.id', 'codenames.assassin_id')

    .then(function(results) {
      res.render('assassins-page', {
        results: results
      });
    });
});

/* ============== New assassin page ===========================*/

router.get('/new', function(req, res) {
  knex('assassins').select()
    .then(function(results) {

      res.render('new-assassin', {
        results: results
      });
    });
});

/* ============== Edit an assassin ===========================*/

router.get('/:id/edit', function(req, res) {
  let assassinId = req.params.id;

  knex('assassins')
    .where('id', assassinId)
    .join('codenames', 'codenames.assassin_id', 'assassins.id')
    .then(function(results) {

      res.render('assassin-edit', {
        results: results
      });
    });
});

/* ============== Get single assassin ===========================*/

router.get('/:id', function(req, res) {
  let assassinsId = req.params.id;
  let assassinsCodenames;
  let assassinsContractsContracts;

  knex('assassins')
    .where('assassins.id', assassinsId)
    .join('codenames', 'assassins.id', 'codenames.assassin_id')
    .join('assassins_contracts', 'assassins_contracts.assassin_id', 'assassins.id')
    .join('contracts', 'assassins_contracts.contract_id', 'contracts.id')
    .join('targets', 'targets.id', 'contracts.target_id')
    .join('clients', 'contracts.client_id', 'clients.id')

    .then(function(results) {
      //if there are contracts...
      
      if (results.length) {
        res.render('assassin-page', {
          results: results
        });
      } else {
        //if there are not contracts...
        knex('assassins')
          .where('assassins.id', assassinsId)
          .join('codenames', 'assassins.id', 'codenames.assassin_id')

          .then(function(results) {

            res.render('assassin-page', {
              results: results
            });
          });
      }
    });
});



/* ============== Delete an assassin ===========================*/

router.get('/:id/deleted', function(req, res) {
  let assassinsId = req.params.id;
  let assCode;

  knex('assassins').where('id', assassinsId)
    .join('codenames', 'assassins.id', 'codenames.assassin_id')
    .then(function(results) {
      assCode = results;

      knex('assassins').where('id', assassinsId).del()
        .then(function(results) {
          knex('codenames').where('codenames.assassin_id', assassinsId)
            .then(function(results) {

              res.render('assassin-deleted', {
                assassin: assCode
              });
            });
        });
    });
});

/* ============== Update an assassin ===========================*/

router.post('/:id/updated', function(req, res) {
  let assassinsId = req.params.id;

  let newAssassinInfo = {
    "full_name": req.body.full_name,
    "weapon": req.body.weapon,
    "contact_info": req.body.contact_info,
    "age": req.body.age,
    "price": req.body.price,
    "kills": req.body.kills,
    "assassin_photo": req.body.assassin_photo,
    "rating": req.body.rating
  };

  let newCodename = {
    "assassin_id": assassinsId,
    "code_name": req.body.code_name
  };

  knex('assassins').where('assassins.id', assassinsId)
    .update(newAssassinInfo)
    .then(function(results) {

    })
    .then(function(results) {
      knex('codenames').where('codenames.assassin_id', assassinsId)
        .update(newCodename)

        .then(function(results) {
          res.render('assassin-updated', {
            codename: newCodename,
            assassin: newAssassinInfo
          });
        });
    });
});

/* ============== Add new assassin ===========================*/

router.post('/added', function(req, res) {

  let info = req.body;
  let newAssassin = [];
  let newCodename = [];

  newAssassin.push({
    "full_name": info.full_name,
    "weapon": info.weapon,
    "contact_info": info.contact_info,
    "age": info.age,
    "price": info.price,
    "rating": info.rating,
    "kills": info.kills,
    "assassin_photo": info.assassin_photo
  });

  return knex('assassins').insert(newAssassin).returning(['id', 'contact_info'])

    .then(function(newAssassinData) {

      let insertedAssassin = {};

      insertedAssassin[newAssassinData[0].contact_info] = newAssassinData[0].id;

      newCodename.push({
        "assassin_id": insertedAssassin[newAssassin[0].contact_info],
        "code_name": req.body.code_name
      });

      return knex('codenames').insert(newCodename);
    })
    .then(function() {

      res.render('assassin-added', {
        assassin: newAssassin,
        codename: newCodename
      });
    });
});


router.use(function(req, res) {
  res.set('Content-Type', 'text/plain');
  res.sendStatus(404);
});

module.exports = router;
