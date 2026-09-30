import { useEffect, useState, useRef } from "react"
import fetchActors from "../api/fetchActors"
import { IShortActor } from "../api/types/actorTypes"
import { Link } from "react-router-dom"
import { ACTORS } from "../routes"
import type { Swiper as SwiperInstance } from "swiper"
import "../styles/ActorsWheel.css"
import { processError } from "../api/apiError"

import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
import "swiper/css"


export default function ActorsWheel() {
    const [actors, setActors] = useState<IShortActor[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loaded, setLoaded] = useState(false)
    const container = useRef<HTMLDivElement>(null)
    const slider = useRef<SwiperInstance | null>(null)
    const [nearby, setNearby] = useState(false)

    useEffect(() => {
        const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
        let visible = false
        const update = () => {
            const swiper = slider.current
            if (!swiper || swiper.destroyed) return
            if (visible && !document.hidden && !motion.matches) swiper.autoplay.start()
            else swiper.autoplay.stop()
        }
        const preload = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) { setNearby(true); preload.disconnect() }
        }, { rootMargin: '300px' })
        const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update() })
        preload.observe(container.current!)
        observer.observe(container.current!)
        document.addEventListener('visibilitychange', update)
        motion.addEventListener('change', update)
        update()
        return () => {
            preload.disconnect(); observer.disconnect()
            document.removeEventListener('visibilitychange', update)
            motion.removeEventListener('change', update)
        }
    }, [loaded])

    useEffect(() => {
        if (!nearby) return
        let cancelled = false
        async function load() {
            try {
                const data = await fetchActors.getShort()
                const pool = Array.from(new Map(data.map(actor => [actor.id, actor])).values())
                const count = Math.min(12, pool.length)
                // Sample without replacement; never multiply the list for looping.
                for (let i = 0; i < count; i++) {
                    const j = i + Math.floor(Math.random() * (pool.length - i))
                    ;[pool[i], pool[j]] = [pool[j], pool[i]]
                }
                if (!cancelled) setActors(pool.slice(0, count))
            } catch (e) {
                if (!cancelled) setError(processError(e));
            } finally {
                if (!cancelled) setLoaded(true)
            }
        }
        load()
        return () => { cancelled = true }
    }, [nearby])

    return (
        <div ref={container} className="actors-wheel" aria-label="Наши актёры">
        {error ? <p role="alert">{error}</p> : !loaded ? <p role="status">Загрузка…</p> : actors.length === 0 ? <p>Не найдено актёров</p> :
        <Swiper
            onSwiper={(swiper: SwiperInstance) => { slider.current = swiper }}
            onFocusCapture={() => slider.current?.autoplay.stop()}
            modules={[Autoplay]}
            loop={actors.length >= 6}
            rewind={actors.length < 6}
            spaceBetween={24}
            autoplay={{ enabled: false, delay: 3500, pauseOnMouseEnter: true, disableOnInteraction: true }}
            speed={600}
            slidesPerView="auto"
        >
            {actors.map(actor => (
                <SwiperSlide key={actor.id}>
                    <Link to={`${ACTORS}/${actor.id}`} className="actors-wheel-card">
                        <img src={`${actor.avatarUrl}_400.jpg`} alt={`${actor.firstName} ${actor.lastName}`}
                            width={260} height={360} loading="lazy" decoding="async" />
                        <span>{actor.firstName} {actor.lastName}</span>
                    </Link>
                </SwiperSlide>
            ))}
        </Swiper>}
        </div>
    );
}
