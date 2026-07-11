import ActorsWheel from "../elements/ActorsWheel"

import "../styles/Person.css";
import "../styles/HomePage.css";


export default function HomePage() {

    return (
       <main className="container animate-on-load">

            {/* <section className="home_navigation ">
                <div className="home_navigation_side">
                    <Link to={ACTORS_MEN}>АКТЁРЫ</Link>
                    <Link to={ACTORS_WOMEN}>АКТРИСЫ</Link>
                    <Link to={EMPLOYEES}>КОМАНДА</Link>
                </div>
            </section> */}

            <section className="about_section">
                {/* <img src="/logo/logo.svg" className="about_logo" alt="БЕРЕГ кино" /> */}
                <div className="about_text">
                    <h2 className="home_title">О нашем агентстве</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia eligendi voluptatum velit fuga rerum, dolores qui rem quibusdam id voluptatem reiciendis libero quisquam, nostrum voluptatibus, sit temporibus iure deleniti distinctio.
                    Nulla hic libero excepturi tenetur! Rerum aliquam maiores iusto quia explicabo expedita ipsa culpa impedit asperiores repellat, omnis soluta veritatis labore. Perferendis fuga eligendi laboriosam accusamus aspernatur deserunt a? Eos.</p>
                </div>
            </section>

            <section className="actors_section">
                <h2 className="home_title">Наши актёры</h2>
                <ActorsWheel />
            </section>
        </main>
    )
}
