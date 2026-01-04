import { useEffect, useState } from "react"
import ActorsWheel from "../elements/ActorsWheel"

import "../styles/Cards.css";
import "../styles/HomePage.css";
import { Link } from "react-router-dom";
import { ACTORS_MEN, ACTORS_WOMEN, WRITER } from "../routes";
import fetchEmployees from "../api/fetchEmployees";
import { IEmployee } from "../api/types/employeeTypes";
import { EmployeeCards } from "../elements/EmployeeCard";


export default function HomePage() {

    return (
       <main className="container animate-on-load">

            <section className="hero_section ">
                <img src="/logo/logo.svg" className="hero_logo" />
            </section>

            <section className="home_navigation ">
                <div className="home_navigation_side">
                    <Link to="#">МЕДИА</Link>
                </div>
                <span className="home_navigation_line"/>
                <div className="home_navigation_side">
                    <Link to={ACTORS_MEN}>АКТЁРЫ</Link>
                    <Link to={ACTORS_WOMEN}>АКТРИСЫ</Link>
                    <Link to={WRITER}>СЦЕНАРИСТЫ</Link>
                </div>
            </section>

            <section className="agents_section">
                <h2 className="home_title">Наша команда</h2>
                <EmployeeCards />
            </section>

            <section className="actors_section">
                <h2 className="home_title">Наши актёры</h2>
                <ActorsWheel />
            </section>

            <section className="screenwriters_section">
                <h2 className="home_title">Сценаристы</h2>
                {

                }
            </section>
        </main>
    )
}
