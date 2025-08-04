import { useEffect, useState } from "react"

import fetchagents from "../data/fetchAgents"
import { IAgent } from "../models/IAgent"
import { useParams } from "react-router-dom"
import { GenderEnum } from "../types/enums"
import Album from "../elements/AlbumPhotos"
import AlbumPhotos from "../elements/AlbumPhotos"


export function Agent() {
    const [agent, setagent] = useState<IAgent>()
    // const [links, setLinks] = useState<ILinks>()

    const { id } = useParams<{ id: string }>()

    useEffect(() => {
        async function get() {
            const data: IAgent = await fetchagents.getAgent(Number(id))
            setagent(data)
        }
        get()
    })


    if (!agent) return <p>Loading...</p>

    return (
        <div className="flex gap-8">
            <div className="flex flex-col items-start w-1/3">
                <img
                    src={`http://localhost:3001/${agent.photo}`}
                    alt={`${agent.firstName} ${agent.lastName}`}
                    className="w-64 h-80 object-cover rounded mb-4"
                />
            </div>

            <div className="w-2/3">

                <h1 className="text-2xl font-bold mb-2">{agent.firstName} {agent.middleName} {agent.lastName}</h1>

                <ul className="space-y-1 text-sm">
                    {agent.description && (
                        <li className="mt-2"><b>Описание:</b> <p>{agent.description}</p></li>
                    )}
                </ul>

            </div>
        </div>
    )
}