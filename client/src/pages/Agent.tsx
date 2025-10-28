import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import Loading from "../elements/Loading"
import "../styles/Actor.css"
import "react-photo-view/dist/react-photo-view.css"
import fetchAgents from "../api/fetchAgents"
import { IAgent } from "../api/types/agentTypes"


export default function Agent() {
    const { id } = useParams()
    const [agent, setAgent] = useState<IAgent>()

    useEffect(() => {
        const loadData = async () => { setAgent(await fetchAgents.getAgent(Number(id))) } 
        loadData()
    }, [])

    if (!agent) {
        return <Loading />
    }

    return (
        <div className="agent_container">
            <h1>Агент</h1>
        </div>
    )
}