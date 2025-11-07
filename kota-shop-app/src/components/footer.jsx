import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

function Footer() {
  return (
    <footer>
      <div className="grid grid-cols-[auto_auto] gap-5 items-center h-[100px] justify-end min-h-[70px] bg-[#292f33] text-white text-center text-xs md:grid-cols-[1fr] md:grid-rows-[1fr_1fr] md:gap-0">
          <a className="text-white no-underline animate-fade-right" href="https://github.com/acidspud/coding-challange">
            <p>Coding Challenge on&nbsp;
            <FontAwesomeIcon icon={faGithub} />
            &nbsp;GitHub</p>
          </a>
      </div>
    </footer>
  );
}

export default Footer;

