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
    client: process.env.BD_CLIENT,
    connection: {
      host: process.env.BD_HOST,
      database: process.env.BD_DATABASE,
      user: process.env.BD_USER,
      password: process.env.BD_PASSWORD,
      port: process.env.BD_PORT
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/database/migrations'
    }
  },
  production: {
    client: process.env.BD_CLIENT,
    connection: {
      host: process.env.BD_HOST,
      database: process.env.BD_DATABASE,
      user: process.env.BD_USER,
      password: process.env.BD_PASSWORD,
      port: process.env.BD_PORT
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/database/migrations'
    }
  }
}

module.exports = EvironmentConfig["development"]
