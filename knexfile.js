// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      database: 'killbase-app',
      user:     'melissawarren',
      password: 'password'
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'pg',
    connection: {
      database: 'dee6jc96pa3lvk',
      user:     'zcivmzyvudjzhy',
      password: '42c05505490c9f8f8569173d7f97fe453846e690086fa6f7c24a1a68d180d517',
      host : 'ec2-184-73-240-228.compute-1.amazonaws.com'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
