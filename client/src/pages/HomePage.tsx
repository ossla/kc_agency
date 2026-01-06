import { useEffect, useState } from "react"
import ActorsWheel from "../elements/ActorsWheel"

import "../styles/Cards.css";
import "../styles/HomePage.css";
import { Link } from "react-router-dom";
import { ACTORS_MEN, ACTORS_WOMEN, EMPLOYEES, WRITER } from "../routes";
import fetchEmployees from "../api/fetchEmployees";
import { IEmployee } from "../api/types/employeeTypes";
import { EmployeeCard } from "../elements/EmployeeCard";
import { EmployeesList } from "./EmployeeList";


export default function HomePage() {



    return (
       <main className="container animate-on-load">

            <section className="hero_section ">
                <img src="/logo/logo.svg" className="hero_logo" />
            </section>

            <section className="home_navigation ">
                {/* <div className="home_navigation_side">
                    <Link to="#">МЕДИА</Link>
                </div>
                <span className="home_navigation_line"/> */}
                <div className="home_navigation_side">
                    <Link to={ACTORS_MEN}>АКТЁРЫ</Link>
                    <Link to={ACTORS_WOMEN}>АКТРИСЫ</Link>
                    <Link to={EMPLOYEES}>КОМАНДА</Link>
                </div>
            </section>

            <section className="about_section">
                <h2 className="home_title">О нашем агентстве</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia eligendi voluptatum velit fuga rerum, dolores qui rem quibusdam id voluptatem reiciendis libero quisquam, nostrum voluptatibus, sit temporibus iure deleniti distinctio.
                Nulla hic libero excepturi tenetur! Rerum aliquam maiores iusto quia explicabo expedita ipsa culpa impedit asperiores repellat, omnis soluta veritatis labore. Perferendis fuga eligendi laboriosam accusamus aspernatur deserunt a? Eos.</p>
            </section>

            <section className="agents_section">
                <h2 className="home_title">Наша команда</h2>
                <EmployeesList />
            </section>

            <section className="actors_section">
                <h2 className="home_title">Наши актёры</h2>
                <ActorsWheel />
            </section>
        </main>
    )
}
