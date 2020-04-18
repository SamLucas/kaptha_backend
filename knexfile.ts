// import 'sucrase/register'
// import 'dotenv/config'

require('sucrase/register')
require('dotenv/config')

const EvironmentConfig = {
  test: {
    client: 'sqlite3',
    connection: {
      filename: './src/database/db.sqlite'
    },
    migrations: {
      directory: './src/database/migrations',
      tableName: 'knex_migrations'
    },
    useNullAsDefault: false
  },
  development: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
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
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
}

module.exports = EvironmentConfig[process.env.ENVIRONMENT]
