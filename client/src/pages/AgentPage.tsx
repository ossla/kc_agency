import { useEffect, useState } from "react"
import { IShortAgent } from "../models/IAgent"
import { AgentCard } from "../elements/AgentCard"
import fetchAgents from "../data/fetchAgents"


export function AgentPage() {

    const [agents, setAgents] = useState<IShortAgent[]>([])

    useEffect(() => {
        async function get() {
            setAgents(await fetchAgents.getShort())
        }
        get()
    }, [])

    if (!agents) { return (<p>Loading...</p>) }

    return (
        <>
            {   
                agents.map(actor => 
                    <>
                        <AgentCard key={actor.id} shortAgent={actor}/>
                    </>
                )
            }
        </>
    )
}