var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('../knexfile')['development'];
var knex = require('knex')(config);
var port = process.env.PORT || 8000


/* ============== Get ======================================*/
/* list all contracts...*/

router.get('/', function(req, res) {
  knex('contracts')
  .join('targets', 'targets.id', 'contracts.target_id')
  .join('clients', 'clients.id', 'contracts.client_id')
  
    .then(function(results) {
      console.log(results, 'arrrrrrrrr')
      res.render('contracts-page', {results: results});
    });
})

/*list all contracts associated with an assassin id */
// ---------------fix this part!!!--------//
router.get('/contracts/:id', function(req, res) {
  let assassinsId = req.params.id;

  knex('assassins').select('*').where('id', assassinsId)
    .then(function(results) {
      res.send(results);
    });
})



/* ============== Delete ===========================*/

router.delete('/contracts/:id', function(req, res) {
  let contractsId = req.params.id;
  knex('contracts').where('id', contractsId).del()
    .then(function(results) {
      res.send(results);
    });

})

/* ============== Patch ===========================*/

router.patch('/contracts/:id', function(req, res) {
  let contractsId = req.params.id;

  knex('contracts').where('id', contractsId)
    .update(req.body)
    .then(function(results) {
      res.send(results);
    });
})

/* ============== Post ===========================*/
/* add a contract */


router.post('/contracts', function(req, res) {
  let newContract = []
  newContract.push(req.body);

  knex('targets').select('id').where('target_name', req.body.target_name)
    .then(function(targetID) {

      req.body.target_name = targetID[0].id;

      knex('clients').select('id').where('client_name', req.body.client_name)
        .then(function(clientID) {

          req.body.client_name = clientID[0].id;
          let newContractInsert = {
            "target_id" : req.body.target_name,
            "client_id" : req.body.client_name,
            "budget" : req.body.budget,
            "completed" : req.body.completed
          }

          knex('contracts').insert(newContractInsert)
            .then(function(results) {
              res.send(results);
            })
        })


    });
})





router.use(function(req, res) {
  res.set('Content-Type', 'text/plain');
  res.sendStatus(404);
});

module.exports = router;

// app.listen(port, function() {
//   console.log("listening on port ", port);
// });
