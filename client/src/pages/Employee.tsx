import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import Loading from "../elements/Loading"
import "../styles/Actor.css"
import "react-photo-view/dist/react-photo-view.css"
import fetchEmployees from "../api/fetchEmployees"
import { IEmployee } from "../api/types/employeeTypes"
import { processError } from "../api/apiError"
import { PhotoProvider, PhotoView } from "react-photo-view"
import { IShortActor } from "../api/types/actorTypes"
import fetchActors from "../api/fetchActors"
import Card from "../elements/Card"


export default function Employee() {
    const { id } = useParams()
    const [employee, setEmployee] = useState<IEmployee>()
    const [error, setError] = useState<string | null>(null)
    const [actors, setActors] = useState<IShortActor[]>([])
    const [actorsLoading, setActorsLoading] = useState<boolean>(true)

    useEffect(() => {
        const f = async () => {
            try {
                if (typeof id !== "string") throw Error("элемент находится не там, где нужно. попытка получить id из url")
                const data: IEmployee = await fetchEmployees.getEmployee(id + "")
                setError(null)
                setEmployee(data)
            } catch (e: unknown) {
                setError(processError(e))
            }

            try {
                const data: IShortActor[] = await fetchActors.filterActor({employeeId: id})
                setError(null)
                setActorsLoading(false)
                setActors(data)

            } catch (e: unknown) {
                setError(processError(e))
            }
        }

        f()
    }, [])

    
    if (error) {
        return <h1>{error}</h1>
    }

    if (!employee) {
        return <Loading />
    }

    return (
        <div className="actor_page_wrapper">
            <div className="actor_grid">
            
                {/* Левая часть===================================== */}
                <div className="actor_left">
                    <PhotoProvider>
                        <PhotoView src={employee.avatarUrl + "_1600.jpg"}>
                            <img
                                className="actor_avatar"
                                src={employee.avatarUrl + "_400.jpg"}
                                alt="avatar"
                            />
                        </PhotoView>
                    </PhotoProvider>

                    <div className="actor_actions empl_actions">
                        {employee.telegram &&
                            <a href={"https://t.me/" + employee.telegram}>
                                <img src="/icons/telegram.svg" alt="icon1" />
                            </a>
                        }
                        {employee.vk && 
                            <a href={employee.vk}>
                                <img src="/icons/vk.svg" alt="icon2" />
                            </a>
                        }
                        {employee.instagram && 
                            <a href={employee.instagram}>
                                <img src="/icons/instagram.svg" alt="icon3" />
                            </a>
                        }
                        {employee.facebook && 
                            <a href={employee.facebook}>
                                <img src="/icons/facebook.svg" alt="icon4" />
                            </a>
                        }
                    </div>
                </div>

                {/* Правая часть===================================== */}
                <div className="actor_right">
                    <div className="floating_block">
                    <h1 className="actor_fio">
                        {employee.lastName} {employee.firstName} {employee.middleName && employee.middleName}
                    </h1>

                    <div className="actor_parameters">
                        <div className="actor_param">
                            <h4>Почта</h4>
                            <p>{employee.email}</p>
                        </div>
                        <div className="actor_param">
                            <h4>Телефон</h4>
                            <p>{employee.phone}</p>
                        </div>
                    </div>
                    </div>

                    {
                        employee.description && (
                            <div className="floating_block">
                                <p id="quote">❝</p>
                                <p className="description">{employee.description}</p>
                            </div>
                        )
                    }

                    <div className="floating_block">
                        <h3>Актёры</h3>
                        {   actorsLoading 
                            ?
                            <Loading />
                            :
                            (
                                actors.length === 0 ?
                                <h4>Актёров не найдено</h4>
                                :
                                <div className="empl_actors">
                                    {actors.map((actor, idx) => 
                                        <Card showVideo={false} actor={actor} key={idx} />)
                                    }
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}