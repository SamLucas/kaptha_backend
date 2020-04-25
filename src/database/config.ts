// import 'sucrase/register'
// import 'dotenv/config'

import 'sucrase/register'
import 'dotenv/config'

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
    client: process.env.CLIENT,
    connection: {
      host: process.env.HOST,
      database: process.env.DATABASE,
      user: process.env.USER,
      password: process.env.PASSWORD,
      port: process.env.PORT
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
    client: process.env.CLIENT,
    connection: {
      host: process.env.HOST,
      database: process.env.DATABASE,
      user: process.env.USER,
      password: process.env.PASSWORD,
      port: process.env.PORT
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

export default EvironmentConfig[process.env.ENVIRONMENT]
