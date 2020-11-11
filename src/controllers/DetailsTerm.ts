import knex from "@/database/connection";
import { Request, Response } from 'express'

import { Redirect, ClassificartionGene } from '@/Utils/EntitiesRedirect';

function getDetailsTerm() {

  const _getDetailsTermCancer = async (idterm_descritor: String) =>
    await knex("cancerTerms").where({ idterm_descritor })

  const _getDetailsTermPolifenol = async (MeshID: String) =>
    await knex("chemicalTerms").where({ MeshID })

  async function main(req: Request, res: Response) {

    const { entity_type, term_id, mesh_id } = req.body

    console.log(entity_type, term_id, mesh_id)

    const indexRedirect: keyof typeof Redirect = entity_type as ClassificartionGene
    const typeFuction = Redirect[indexRedirect]

    console.log(typeFuction)

    let data

    if (typeFuction === "indexCancers")
      data = await _getDetailsTermCancer(term_id)

    else if (typeFuction === "indexPolifenols")
      data = await _getDetailsTermPolifenol(mesh_id)

    return res.status(200).send(data ? data[0] : null)
  }

  return {
    main,
  }
}

export default getDetailsTerm();
