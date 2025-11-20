import "../styles/Main.css"

export default function Footbar() {
  return (
    <footer className="agency-footer">
      <div className="footer-main">
        Контакты: kc@agency.example • +7 (000)0000000
      </div>
      <div className="footer-small">
        © {new Date().getFullYear()} Агентство “Берег”
      </div>
    </footer>
  );
}
