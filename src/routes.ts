import { Router } from 'express'

import ReadFiles from '@/Utils/ReadFiles'

export const Routes = Router()

Routes.post('/read_file', ReadFiles.store)
