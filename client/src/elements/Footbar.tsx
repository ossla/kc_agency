import "../styles/Main.css"

export default function Footbar() {
  return (
    <footer className="agency-footer">
        <a href="https://t.me/beregagent" className="link-footer">
            <img src="/icons/telegram.svg" alt="telegram" className="link-icon" id="tg-icon" />
            <label htmlFor="tg-icon" className="link-text">t.me/beregagent</label>
        </a>
        <div className="footer-small">
            © {new Date().getFullYear()} Агентство “Берег”
        </div>
    </footer>
  );
}
