import { Router } from 'express'

import ReadFile from '@/controllers/ReadFilesController'

export const Routes = Router()

Routes.post('/read_file', ReadFile.store)
