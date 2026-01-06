import { useEffect, useState } from "react"
import fetchEmployees from "../api/fetchEmployees"
import { IEmployee } from "../api/types/employeeTypes"
import { processError } from "../api/apiError"
import Loading from "../elements/Loading"
import { EmployeeCard } from "../elements/EmployeeCard"

export function EmployeesList() {
    const [error, setError] = useState<string | null>()
    const [employees, setEmployees]  = useState<IEmployee[]>([])

    useEffect(() => {
        try {
            const f = async () => {
                const data: IEmployee[] = await fetchEmployees.get()
                setError(null)
                setEmployees(data)
            }
    
            f()
        } catch (error: unknown) {
            setError(processError(error))
        }
    }, [])

    if (employees.length === 0) return <Loading />

    if (error) return <div>{error}</div>

    return (
        <>
            { employees &&
                employees.map((empl, idx) =>
                    <EmployeeCard employee={empl} key={idx} />
                )
            }
        </>
    )
}
