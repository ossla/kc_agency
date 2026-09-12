import { Link } from 'react-router-dom'
import { IEmployee } from '../api/types/employeeTypes'
import "../styles/Employee.css"
import { EMPLOYEES } from '../routes'
import React from 'react'

interface IEmployeeCard {
    employee: IEmployee
}

export function EmployeeCard({ employee }: IEmployeeCard) {
    const employeeUrl = EMPLOYEES + '/' + employee.id
    const descriptionLimit = 180
    const fullDescription = employee.description ?? ""
    const hasLongDescription = fullDescription.length > descriptionLimit
    const description = hasLongDescription
        ? fullDescription.slice(0, descriptionLimit).trim()
        : fullDescription

    const linkify = (text: string | null | undefined) => {
        if (!text) return null

        const urlRegex = /(?:(?:https?:\/\/)?(?:www\.)?[A-Za-z0-9.-]+\.[A-Za-z]{2,}(?:\/\S*)?)/g
            const emailRegex = /([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g
            const combined = new RegExp(emailRegex.source + '|' + urlRegex.source, 'g')

        const parts: Array<string | React.ReactNode> = []
        let lastIndex = 0
        let match: RegExpExecArray | null

        while ((match = combined.exec(text)) !== null) {
            const idx = match.index
            if (idx > lastIndex) {
                parts.push(text.slice(lastIndex, idx))
            }

            const matched = match[0]
            if (/@/.test(matched)) {
                parts.push(
                    <a key={idx} href={`mailto:${matched}`}>{matched}</a>
                )
            } else {
                const href = /^https?:\/\//.test(matched) ? matched : `http://${matched}`
                parts.push(
                    <a key={idx} href={href} target="_blank" rel="noopener noreferrer">{matched}</a>
                )
            }

            lastIndex = idx + matched.length
        }

        if (lastIndex < text.length) parts.push(text.slice(lastIndex))

        return parts
    }

    return (
        <div className="employee-card-wrapper">
            <div className="employee-card">
                <div className="employee-avatar">
                    <Link to={employeeUrl}>
                        <img
                            src={employee.avatarUrl + "_400.jpg"}
                            alt={`${employee.firstName} ${employee.lastName}`}
                        />
                    </Link>
                </div>

                <div className="employee-info">
                    <Link to={employeeUrl}>
                        <h1 className="employee-name">
                            {employee.lastName} {employee.firstName}
                        </h1>
                    </Link>

                    <div className="employee-description">
                        {linkify(description)}
                        {hasLongDescription && (
                            <>
                                ... <Link to={employeeUrl} className="employee-more-link">больше</Link>
                            </>
                        )}
                    </div>

                    <div className="employee-contacts">
                        <h4>{employee.phone}</h4>
                        <h4>{employee.email}</h4>
                    </div>
                </div>
            </div>
        </div>
    )
}
