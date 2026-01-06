import { Link } from 'react-router-dom'
import { IEmployee } from '../api/types/employeeTypes'
import "../styles/Employee.css"
import { EMPLOYEES } from '../routes'

interface IEmployeeCard {
    employee: IEmployee
}

export function EmployeeCard({ employee }: IEmployeeCard) {
    return (
        <div className="employee-card">
            <Link to={EMPLOYEES + '/' + employee.id} className='employee-main'>
                <div className="employee-avatar">
                    <img
                        src={employee.avatarUrl}
                        alt={`${employee.firstName} ${employee.lastName}`}
                    />
                </div>

                <div className="employee-info">
                    <h1 className="employee-name">
                        {employee.lastName} {employee.firstName}
                    </h1>

                    <div className="employee-description">
                        {employee.description}
                    </div>

                    <div className="employee-phone">
                        {employee.phone}
                    </div>
                    <div className="employee-phone">
                        {employee.email}
                    </div>
                </div>
            </Link>
            <div className="employee-links">
                {employee.vk &&
                    <div className="employee-link" style={{marginTop: "40px"}}>
                        <a href={employee.vk} ><img src="/icons/vk.svg" alt='vk'/></a>
                    </div>
                }
                {employee.telegram &&
                    <div className="employee-link">
                        <a href={`https://t.me/${employee.telegram}`} ><img src="/icons/telegram.svg" alt='telegram'/></a>
                    </div>
                }
                {employee.instagram &&
                    <div className="employee-link">
                        <a href={employee.instagram} ><img src="/icons/instagram.svg" alt='vk'/></a>
                    </div>
                }
                {employee.facebook &&
                    <div className="employee-link" style={{marginBottom: "40px"}}>
                        <a href={employee.facebook} ><img src="/icons/facebook.svg" alt='facebook'/></a>
                    </div>
                }
            </div>
        </div>
    )
}