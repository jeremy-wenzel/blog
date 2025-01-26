import ImageLink from "./ImageLink";
import "../styles/Footer.css";

/*
* TODO:
*  - Need to figure out what is going on with the footer. If the page is scrollable, then the footer
*    will over be covering content and just stay there. When you scroll, it also just stays put.
*    Need to figure out how to have it at the bottom of the screen always.
*/
export default function Footer() {
  const currentDate = new Date();
  return (
    <footer>
      <div className="links">
        <ImageLink
          className="first-link"
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
      <div className="copyright">
        <p className='footer-text'>&#169; {currentDate.getFullYear()} Jeremy Wenzel</p>
      </div>
    </footer>
  );
}

