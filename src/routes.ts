import { Router } from 'express'

import ReadFiles from '@/Utils/ReadFiles'
import SeachController from '@/controllers/SearchController'

export const Routes = Router()

Routes.post('/read_file', ReadFiles.store)

Routes.get('/search', SeachController.index)

Routes.get('/status', (req, res) => {
  return res.json({ message: 'Servidor esta funcionando.' })
})
