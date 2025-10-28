import { useEffect, useState } from "react"
import fetchAgents from "../api/fetchAgents"
import { IShortAgent } from "../api/types/agentTypes"
import Card from "../elements/Card"
import Loading from "../elements/Loading"


export default function AgentsList() {
    const [agents, setAgents] = useState<IShortAgent[]>([])

    useEffect(() => {
        async function load() {
            const data: IShortAgent[] = await fetchAgents.getShort()
            setAgents(data)
        }
        load()
    }, [])

    if (agents.length === 0) {
        return <Loading />
    }

    return (
        <div className="page_cards">
            {agents.length !== 0 ?
                agents.map((agent, idx) => <Card person={agent} isActor={false} key={idx} />)
                :
                    <p>Ведутся технические работы. Попробуйте зайти позже.</p>
                }
        </div>
    )
}