import { Router } from 'express'

// import ReadFileJson from '@/Utils/ReadFiles/utils/ReadFileJson'
import ReadFileTsv from '@/Utils/ReadFiles/utils/ReadFileTsv'
import SeachController from '@/controllers/SearchController'

export const Routes = Router()

Routes.get('/status', (req, res) => {
  return res.json({ message: 'Servidor esta funcionando.' })
})

// Routes.post('/readFile/json', ReadFileJson.store)
Routes.post('/readFile/tsv', ReadFileTsv.ReadFile)

Routes.get('/search', SeachController.index)
