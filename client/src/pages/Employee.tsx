import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import Loading from "../elements/Loading"
import "../styles/Actor.css"
import "react-photo-view/dist/react-photo-view.css"
import fetchEmployees from "../api/fetchEmployees"
import { IEmployee } from "../api/types/employeeTypes"


export default function Employee() {
    const { id } = useParams()
    const [employee, setEmployee] = useState<IEmployee>()
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadData = async () => { 
                try {
                    setEmployee(await fetchEmployees.getEmployee(Number(id)))
                } catch (e: any) {
                    setError("Не удалось загрузить агента")
                }
            }
        loadData()
    }, [])

    if (!employee) {
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