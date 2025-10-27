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

/* agents **/
const agentURL = serverURL + "/api/agent"
export const getAgentURL = agentURL
export const createAgentURL = agentURL + "/create"
export const deleteAgentURL = agentURL + "/delete"
export const filterAgentURL = agentURL + "/filter"
export const editAgentURL = agentURL + "/edit"

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
