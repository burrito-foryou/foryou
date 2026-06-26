import { FiGithub } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="border-t border-border px-6 py-6 text-sm text-text-muted">
      <div className="flex flex-col items-center gap-2">
        <a
          href="https://github.com/burrito-foryou/foryou"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 hover:text-primary"
        >
          <FiGithub size={16} />
          <span>burrito-foryou/foryou</span>
        </a>
        <span>© 2024 ForU · Team Burrito</span>
      </div>
    </footer>
  );
};

export default Footer;
