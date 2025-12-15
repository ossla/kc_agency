import { useEffect, useState, useRef } from "react";
import fetchActors from "../api/fetchActors";
import { IShortActor } from "../api/types/actorTypes";
import Card from "./Card";
import "../styles/ActorsWheel.css";

export default function ActorsWheel() {
    const [actors, setActors] = useState<IShortActor[]>([]);
    const [error, setError] = useState<string | null>(null);
    const wheelRef = useRef<HTMLDivElement>(null);
    const speed = 0.2; // px/frame

    useEffect(() => {
        async function load() {
            try {
                const data = await fetchActors.getShort();
                if (data.length === 0) return;
                // повторяем массив столько раз, чтобы он точно перекрыл контейнер
                const repeated = Array(20).fill(data).flat();
                setActors(repeated);
            } catch (e) {
                setError("Ошибка загрузки актёров");
            }
        }
        load();
    }, []);

    useEffect(() => {
        const container = wheelRef.current;
        if (!container) return;

        let offset = 0;
        let animationFrame: number;

        const animate = () => {
            offset += speed;
            if (offset >= container.scrollWidth / 2) {
                offset = 0;
            }
            container.scrollLeft = offset;
            animationFrame = requestAnimationFrame(animate);
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [actors]);

    if (error) return <p>{error}</p>;
    if (actors.length === 0) return <p>Загрузка актёров...</p>;

    return (
        <div className="actors_wheel_container" ref={wheelRef}>
            <div className="actors_wheel_inner">
                {actors.map((actor, idx) => (
                    <div className="actor_item" key={idx}>
                        <Card actor={actor} isActor={true} />
                    </div>
                ))}
            </div>
        </div>
    );
}
