import { useEffect, useState } from "react"


export function Actor(props: any) {
    
    const [actorData, setActorData] = useState(null)

    useEffect(() => {
        async function fetchData() {
            const response = await fetch('http://localhost:3001/api/actor/')
            const data = await response.json()
            setActorData(data)
        }
        fetchData()
    })

    return (
        <div
            className='border py-2 px-4 rounded flex flex-col items-center'>
            {actorData ? (
                <pre>{JSON.stringify(actorData, null, 2)}</pre>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    )
}