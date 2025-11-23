import path from "path"

export const serverURL = `http://${process.env.REACT_APP_SHOST}:${process.env.REACT_APP_SPORT}`

/* actors **/
const actorURL = serverURL + "/api/actor"
export const getActorsURL = actorURL
export const getMenActorsURL = actorURL + "/get/men"
export const getWomenActorsURL = actorURL + "/get/women"
export const filterActorsURL = actorURL + "/filter"
export const createActorURL = actorURL + "/create"
export const deleteActorURL = actorURL + "/delete"
export const editActorURL = actorURL + "/edit"

const employeeURL = serverURL + "/api/employee"
export const getEmployeeURL = employeeURL
export const createEmployeeURL = employeeURL + "/create"
export const deleteEmployeeURL = employeeURL + "/delete"
export const filterEmployeeURL = employeeURL + "/filter"
export const editEmployeeURL = employeeURL + "/edit"

/* relevant **/
const relevantURL = serverURL + "/api/relevant"
export const cityURL = relevantURL + "/city"
export const eyeURL = relevantURL + "/eye"
export const languageURL = relevantURL + "/language"

/* user */
export const mainAuthURL = serverURL + "/api/auth"
export const registrationURL = mainAuthURL + "/registration"
export const loginURL = mainAuthURL + "/login"
export const logoutURL = mainAuthURL + "/logout"
export const authURL = mainAuthURL + "/"

/* favorites */