import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

import { Routes } from './routes'

class App {
    public express: express.Application

    public constructor () {
      this.express = express()
      this.middlewares()
      this.routes()
    }

    private middlewares (): void {
      this.express.use(express.json())
      this.express.use(cors())
      this.express.use(morgan(`${process.env.MORGAN_TYPE}`))
    }

    private routes (): void {
      this.express.use(Routes)
    }
}

export default new App().express
