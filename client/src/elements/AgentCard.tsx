import { useNavigate } from "react-router-dom"
import { useState } from "react";

import { IShortAgent } from "../models/IAgent";


export interface AgentCardProps {
    shortAgent: IShortAgent
}
export function AgentCard(props: AgentCardProps) {
    const [agent] = useState<IShortAgent>(props.shortAgent) 
    const navigate = useNavigate()

    const handleClick = () => {
        navigate(`/agent/${agent.id}`)
    }

    return (
        <div onClick={handleClick} style={{cursor: 'pointer'}}>
            <img 
                src={agent.avatarUrl}              
                alt={`${agent.firstName} ${agent.lastName}`} 
                style={{ width: "200px"}}
            />
            <h1>{agent.firstName} {agent.lastName}</h1>
        </div>
    )
}