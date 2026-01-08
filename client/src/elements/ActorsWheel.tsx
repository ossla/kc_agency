import { useEffect, useState, useRef } from "react"
import fetchActors from "../api/fetchActors"
import { IShortActor } from "../api/types/actorTypes"
import Card from "./Card"
import "../styles/ActorsWheel.css"
import { processError } from "../api/apiError"

import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
import "swiper/css"


export default function ActorsWheel() {
    const [actors, setActors] = useState<IShortActor[]>([])
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function load() {
            try {
                const data = await fetchActors.getShort()
                if (data.length === 0) return
                const repeated = Array(20).fill(data).flat()
                setActors(repeated)
            } catch (e) {
                setError(processError(e));
            }
        }
        load()
    }, [])

    if (error) return <p>{error}</p>
    if (actors.length === 0) return <p>Загрузка актёров...</p>

    return (
        <Swiper
            modules={[Autoplay]}
            loop
            spaceBetween={24}
            autoplay={{ delay: 0 }}
            speed={8000}
            slidesPerView="auto"
        >
            {actors.map(actor => (
                <SwiperSlide key={actor.id} style={{ width: 260 }}>
                    <Card actor={actor} showVideo={false} />
                </SwiperSlide>
            ))}
        </Swiper>
    );
}