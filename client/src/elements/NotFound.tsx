import "../styles/NotFound.css"

export default function NotFound() {
        return (
            <div className="not_found">
                <h1 className="not_found_title">404!</h1>
                <p className="not_found_text">Страница не найдена. Возможно, указан неверный путь в URL</p>
                <img src="/not_found.png" alt="404.png" className="not_found_icon" />
            </div>
        )
}