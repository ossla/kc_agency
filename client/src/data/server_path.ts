export const serverURL = `http://${process.env.REACT_APP_SHOST}:${process.env.REACT_APP_SPORT}/`

/* actors **/
export const ActorURL = serverURL + "api/actor"
export const getShortActorURL = ActorURL
export const getShortMenActorURL = ActorURL + "api/actor/get/men"
export const getShortWomenActorURL = ActorURL + "api/actor/get/women"