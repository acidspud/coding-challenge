import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

function Footer() {
    return (
        <footer>
            <div className="flex items-center justify-center h-[70px] bg-secondary text-white text-center text-sm shadow-inner">
                <a className="text-white no-underline hover:text-primary-light transition-colors duration-200 flex items-center gap-2 animate-fade-right" href="https://github.com/acidspud/coding-challange">
                    <FontAwesomeIcon icon={faGithub} className="text-xl" />
                    <p className="m-0">Coding Challenge on GitHub</p>
                </a>
            </div>
        </footer>
    )
}

export default Footer

