import React, { useEffect, useState } from 'react'
import { IEmployee } from '../api/types/employeeTypes';
import fetchEmployees from '../api/fetchEmployees';
import { serverURL } from '../api/URLs';
import "../styles/Employee.css"


export function EmployeeCards() {
    const [employees, setEmployees] = useState<IEmployee[]>([])
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function load() {
            try {
                const data = await fetchEmployees.getFull()
                if (data.length === 0) return
                data.push(data[0])
                setEmployees(data)

            } catch (e) {
                setError("Ошибка загрузки ")
            }
        }
        load()
    }, [])

    if (employees.length === 0) {
        return <h1>Агенты не найдены</h1>
    }

    if (!employees) {
        return <h1>loading...</h1>
    }

    return (
        <div className="employees-list">
            {employees.map((empl, idx) => (
                <div key={empl.id} className={"employee-card " + (idx % 2 === 0 ? "empl-right" : "empl-left")}>
                    <img
                        className="employee-avatar"
                        src={serverURL + "/" + empl.photo + ".jpg"}
                        alt="avatar"
                    />

                    <div className="employee-content">
                        <h3 className="employee-name">
                            {empl.lastName} {empl.firstName}
                        </h3>

                        <span className="quote">❝</span>
                        <p className="employee-description">
                            {empl.description} 
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate eum ut alias odit ipsam itaque voluptatibus assumenda rem enim blanditiis! Necessitatibus odio veritatis sequi, dolorum consequatur sapiente voluptate facere ex?
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )

}
