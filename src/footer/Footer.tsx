import "./Footer.scss";
import { SamsaraSVG } from "../header/svgs/samsara";

type Props = {};

function Footer(props: Props) {
  return (
    <div className="footer">
      <div className="footer-top">
        {SamsaraSVG("white")}
        <div className="footer-menu">
          <span>FAQ</span>
          <span>Docs</span>
          <span>Analytics</span>
          <span>Investors</span>
          <span>About Us</span>
        </div>
      </div>
      <div className="footer-bottom">
        <span>Copyright © 2022 Samsara. All rights reserved</span>
        <div className="icons-menu">
          <div className="icon telegram" />
          <div className="icon discord" />
          <div className="icon twitter" />
          <div className="icon medium" />
          <div className="icon reddit" />
          <div className="icon github" />
        </div>
      </div>
    </div>
  );
}

export default Footer;
