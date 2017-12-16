
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('../knexfile')['development'];
var knex = require('knex')(config);
var port = process.env.PORT || 8000
//const assassins = require('../assassins');


/* ============== Get ===========================*/


router.get('/', function(req, res) {
  //res.send('You want to get ALL of the assassins? You brave.');
  knex.from('assassins').innerJoin('codenames', 'assassins.id', 'codenames.assassin_id')

    .then(function(results) {
      console.log(results, 'resultsssss')
      res.render('assassins-page', {results: results});
    });
});

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
      console.log(results.length,'baaaaaaaaaaaa')
      if(results.length) {
          res.render('assassin-page', {results: results});
      }
      knex('assassins')
      .where('assassins.id', assassinsId)
      .join('codenames', 'assassins.id', 'codenames.assassin_id')

      .then(function(results) {
        res.render('assassin-page', {results: results});
      })
    });
})


/* ============== Delete ===========================*/

router.delete('/assassins/:id', function(req, res) {
  let assassinsId = req.params.id;
  knex('assassins').where('id', assassinsId).del()
    .then(function(results) {
      res.send(results);
    });

})

/* ============== Patch ===========================*/

router.patch('/assassins/:id', function(req, res) {
  let assassinsId = req.params.id;

   knex('assassins').where('id', assassinsId)
     .update(req.body)
     .then(function(results) {
       res.send(results);
     });
})

/* ============== Post ===========================*/

router.post('/add', function(req, res) {
  let newAssassin = []
  newAssassin.push(req.body);

  knex('assassins').insert(newAssassin)
  .then(function(results) {
    res.send(results);
  });
})


router.use(function(req, res) {
  res.set('Content-Type', 'text/plain');
  res.sendStatus(404);
});

module.exports = router;
