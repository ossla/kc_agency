import { Link } from 'react-router-dom'
import { IEmployee } from '../api/types/employeeTypes'
import "../styles/Employee.css"
import { EMPLOYEES } from '../routes'

interface IEmployeeCard {
    employee: IEmployee
}

export function EmployeeCard({ employee }: IEmployeeCard) {
    return (
        <div className="employee-card-wrapper">
        <div className="employee-card">
            <div className='employee-main'>
                <Link to={EMPLOYEES + '/' + employee.id}>
                    <div className="employee-avatar">
                        <img
                            src={employee.avatarUrl + "_400.jpg"}
                            alt={`${employee.firstName} ${employee.lastName}`}
                        />
                    </div>
                </Link>

                <div className="employee-info">
                    <div>
                        <Link to={EMPLOYEES + '/' + employee.id}>
                        <h1 className="employee-name">
                            {employee.lastName} {employee.firstName}
                        </h1>
                        </Link>

                        <div className="employee-description">
                            {employee.description}
                        </div>
                    </div>
                    <div className="employee-contacts">
                        <h4>
                            <span className='employee-dot'>•</span> {employee.phone}
                        </h4>

                        <h4>
                            <span className='employee-dot'>•</span> {employee.email}
                        </h4>
                    </div>
                </div>

            </div> {/* employee-main */}

            <div className="employee-links">
                {employee.vk &&
                    <div className="employee-link">
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
                    <div className="employee-link">
                        <a href={employee.facebook} ><img src="/icons/facebook.svg" alt='facebook'/></a>
                    </div>
                }
            </div>
        </div>     
        </div>
    )
}