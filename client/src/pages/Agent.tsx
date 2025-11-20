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
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadData = async () => { 
                try {
                    setAgent(await fetchAgents.getAgent(Number(id)))
                } catch (e: any) {
                    setError("Не удалось загрузить агента")
                }
            }
        loadData()
    }, [])

    if (!agent) {
        return <Loading />
    }

    if (error) {
        return <h1>{error}</h1>
    }

    return (
        <div className="agent_container">
            <h1>Агент</h1>
        </div>
    )
}