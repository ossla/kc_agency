import { useEffect, useState } from "react"
import fetchEmployees from "../api/fetchEmployees"
import { IShortEmployee } from "../api/types/employeeTypes"
import Card from "../elements/Card"
import Loading from "../elements/Loading"
import ActorsWheel from "../elements/ActorsWheel"

// export default function AgentsList() {
//     const [agents, setAgents] = useState<IShortAgent[]>([])
//     const [error, setError] = useState<string | null>(null)

//     useEffect(() => {
//         async function load() {
//             try {
//                 const data: IShortAgent[] = await fetchAgents.getShort()
//                 setAgents(data)
//             } catch(e) {
//                 setError("что-то пошло не так")
//             }
//         }
//         load()
//     }, [])

//     if (agents.length === 0) {
//         return <p>Агенты не загружены</p>
//     }

//     if (error) {
//         return <h1>{error}</h1>
//     }

//     return (
//         <div className="page_cards">
//             {agents.length !== 0 &&
//                 agents.map((agent, idx) => <Card person={agent} isActor={false} key={idx} />)
//             }
//         </div>
//     )
// }

import "../styles/Cards.css";
import "../styles/HomePage.css";


export default function HomePage() {

    useEffect(() => {
        const elements = document.querySelectorAll(".animate-on-scroll");

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("show");
                    }
                });
            },
            { threshold: 0.2 }
        );

        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, [])

    return (
       <main className="home_page">

            <section className="hero_section animate-on-scroll">
                <img className="hero_logo" src="/white_logo.png" alt="Logo" />
                <div className="hero_text">
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Suspendisse hendrerit, velit ut volutpat placerat...
                    </p>
                </div>
            </section>

            <section className="actors_section animate-on-scroll">
                <h2>Наши актёры</h2>
                <ActorsWheel />
            </section>

            <section className="agents_section animate-on-scroll">
                <h2>Наши агенты</h2>
                <div className="agents_grid"></div>
            </section>

            <section className="contact_section animate-on-scroll">
                <h2>Связаться с нами</h2>
                <form className="contact_form">
                    <input type="text" placeholder="Ваше имя" />
                    <input type="email" placeholder="Email" />
                    <textarea placeholder="Сообщение" />
                    <button type="submit">Отправить</button>
                </form>
            </section>

        </main>
    )
}
