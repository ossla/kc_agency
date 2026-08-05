import ActorsWheel from "../elements/ActorsWheel";
import { Link } from "react-router-dom";
import { ACTORS_MEN, ACTORS_WOMEN, EMPLOYEES } from "../routes";

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
                    <p>
                        <strong>Актерское агентство БЕРЕГ</strong>  придумал и создал в 2003 году Дмитрий Котов. В 2007 году он же организовал и  провел первый в стране Учебный курс агентов и кастинг-директоров на базе компании АМЕДИА. В дальнейшем основной агентский состав БЕРЕГа сложился из выпускников этих курсов. За последовавшие почти два десятилетия работы в киноиндустрии те самые выпускники стали успешными независимыми агентами, кастинг-директорами, продюсерами.

                        <br />
                        <br />

                        В 2022 году Актерское Агентство КС-Agency (выросшее из Агентства БЕРЕГ) преобразовалось в АЛЬЯНС АКТЕРСКИХ АГЕНТОВ — союз опытных агентов, объединенных общими представлениями о стандартах профессии, форме, сути и принципах агентской деятельности.

                        В этом году мы приняли решение вернуть изначальное название и с 1 августа 2026 года наш Альянс, в состав которого входят Елена Кондратова, Алина Волкова, Анна Старадумова и Марина Чернова, называется Агентство талантов «БЕРЕГ кино».

                        В наших планах — дальнейшее расширение как актерского, так и агентского состава Альянса. А также — менеджмент и представительство интересов сценаристов и режиссеров.

                        Если Вы агент и ищете партнеров — мы будем рады рассмотреть Вашу заявку на вступление в наш Альянс.

                        <br />
                        <br />

                        <strong>Агентство талантов БЕРЕГ кино</strong> оказывает услуги профессиональным актерам на эксклюзивной основе. Наш сайт предназначен исключительно для профессионалов, работающих в области кино и телевидения: продюсеров, режиссеров, кастинг-директоров, а также ассистентов по актерам.

                        <br />
                        <br />
                        <br />

                        Заявки от актеров на включение в состав агентства принимаются исключительно по e-mail:{" "}
                        <span className="nowrap"><strong>beregactor@gmail.com</strong></span>
                    </p>
                </div>
            </section>

            <div className="mobile_links">
                <Link to={EMPLOYEES} className="mobile_link">КОМАНДА</Link>
                <Link to={ACTORS_MEN} className="mobile_link">АКТЁРЫ</Link>
                <Link to={ACTORS_WOMEN} className="mobile_link">АКТРИСЫ</Link>
            </div>

            <section className="actors_section">
                <h2 className="home_title">Наши актёры</h2>
                <ActorsWheel />
            </section>
        </main>
    );
}