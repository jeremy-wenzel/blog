import ImageLink from "./ImageLink";
import "../styles/Footer.css";

export default function Footer() {
  const currentDate = new Date();
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__links" aria-label="Social links">
          <ImageLink
            icon="github.svg"
            url="https://github.com/jeremy-wenzel"
            alternativeName="Link to Jeremy Wenzel's GitHub"
          />
          <ImageLink
            icon="linkedin.svg"
            url=""
            alternativeName="Link to Jeremy Wenzel's LinkedIn"
          />
        </div>
        <p className="site-footer__copyright">&#169; {currentDate.getFullYear()} Jeremy Wenzel</p>
      </div>
    </footer>
  );
}
