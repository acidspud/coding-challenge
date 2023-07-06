import React, { Fragment } from "react";
import Fade from "react-reveal/Fade";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

function Footer() {
  return (
    <Fragment>
      <div className="footer">
        <Fade right cascade>
          <a href="https://github.com/acidspud/gotbot-coding-challange">
            <p>Gotbot Coding Challenge on&nbsp;
            <FontAwesomeIcon icon={faGithub} /> 
            &nbsp;GitHub</p>
          </a>
        </Fade>
      </div>
    </Fragment>
  );
}

export default Footer;
