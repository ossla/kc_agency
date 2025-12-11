import { Request, Response, NextFunction } from "express"

import { appDataSource } from "../../data-source"
import { getActor } from "./getActor"
import { Actor } from "../../models/actor.entity"
import processApiError from "../../error/processError"
import { getEmployee } from "../employee/getEmployee"
import { Employee } from "../../models/employee.entity"
import { editActorSchema, EditActorType, GenderEnum } from "./actorTypes"
import { saveCity, saveEyeColor, saveHairColor, saveLanguages } from "./createActor"


function setActorField<T extends keyof Actor>(actor: Actor, field: T, value: Actor[T] | undefined) {
    if (value !== undefined) {
        actor[field] = value
    }
}

async function setEmployee(actor: Actor, employeeId: any) {
    if (employeeId) {
        const employee: Employee = await getEmployee(Number(employeeId))
        actor.employee = employee
    }
}

function setGender(actor: Actor, gender: any) {
    if (gender) {
        if (gender === GenderEnum.Man || gender === GenderEnum.Woman) {
            actor.gender = gender
        } else {
            throw new Error("setGender: Пол актера: 'M' или 'W'")
        }
    }
}

export async function editActor(req: Request, res: Response, next: NextFunction) {
    try {    
        const body: EditActorType = editActorSchema.parse(req.body)
        
        let actor: Actor = await getActor(body.id)
        setActorField(actor, "firstName", body.firstName)
        setActorField(actor, "lastName", body.lastName)
        setActorField(actor, "middleName", body.middleName)
        setActorField(actor, "education", body.education)
        setActorField(actor, "description", body.description)
        setActorField(actor, "linkToFilmTools", body.linkToFilmTools)
        setActorField(actor, "linkToKinoTeatr", body.linkToKinoTeatr)
        setActorField(actor, "linkToKinopoisk", body.linkToKinopoisk)
        setActorField(actor, "videoURL", body.videoURL)

        setActorField(actor, "skills", body.skills)
        setActorField(actor, "height", body.height)
        setActorField(actor, "dateOfBirth", body.dateOfBirth)

        await setEmployee(actor, body.employeeId)
        await saveCity(actor, body.city)
        await saveEyeColor(actor, body.eyeColor)
        await saveHairColor(actor, body.hairColor)
        await saveLanguages(actor, body.languages)

        await appDataSource.getRepository(Actor).save(actor)
        res.json(actor)
    } catch (error: unknown) {
        processApiError(error, next)
    }
}
