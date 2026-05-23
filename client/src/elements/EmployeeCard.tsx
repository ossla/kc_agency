import { Link } from 'react-router-dom'
import { IEmployee } from '../api/types/employeeTypes'
import "../styles/Employee.css"
import { EMPLOYEES } from '../routes'

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
                        {description}
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
