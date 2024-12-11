<a name="readme-top"></a>


<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">

  <a href="https://github.com/acidspud/coding-challenge">
    <h3 align="center">CODING CHALLENGE</h3>
  </a>

  <p align="center">
    FullStack Developer
    <br />
    <a href="https://github.com/acidspud/coding-challenge/tree/main/doc"><strong>Explore the docs »</strong></a>
    <br />
    <br />
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

A full-stack application for chefs in Kota shops to manage food items. Built with Golang for the back-end and ReactJS for the front-end. Features include adding, updating, and deleting food items, user registration, JWT-based authentication, and a dashboard for inventory levels. Seamlessly integrates with a postgres database and can be easily deployed using Docker.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![React][React.js]][React-url]
* [![Redux][Redux]][Redux-url]
* [![Golang][Golang]][Golang-url]
* [![Swagger][Swagger]][Swagger-url]
* [![Docker][Docker]][Docker-url]
* [![Redis][Redis]][Redis-url]
* [![Postgresql][Postgresql]][Postgresql-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started



### Prerequisites

To run the project, you need Docker and Docker Compose installed. The project is containerized, simplifying deployment. It includes a database migration strategy for table setup during startup. There is also a test user available for initial testing.

Additionally, useful development commands are available in the Golang Makefile, providing convenient functionality during the development process.


### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/acidspud/coding-challenge
   ```
2. Run with docker-compose
   ```sh
   docker-compose up
   ```
3. Access the site at [localhost:8080/](http://localhost:8080/)
4. Test user credentials is `test@gmail.com:12345678`
    ```js
      username: test@gmail.com
      password: 12345678
    ```
5. Consume the API at `localhost:8080/api/*`
6. Access the Swagger Docs at [localhost:8080/swagger/](http://localhost:8080/swagger/index.html)


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Jaques Horn - [@acidspud](https://github.com/acidspud) - jaqueshorn@gmail.com

Project Link: [https://github.com/acidspud/coding-challenge](https://github.com/acidspud/coding-challenge)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/acidspud/coding-challenge.svg?style=for-the-badge
[contributors-url]: https://github.com/acidspud/coding-challenge/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/acidspud/coding-challenge.svg?style=for-the-badge
[forks-url]: https://github.com/acidspud/coding-challenge/network/members
[stars-shield]: https://img.shields.io/github/stars/acidspud/coding-challenge.svg?style=for-the-badge
[stars-url]: https://github.com/acidspud/coding-challenge/stargazers
[issues-shield]: https://img.shields.io/github/issues/acidspud/coding-challenge.svg?style=for-the-badge
[issues-url]: https://github.com/acidspud/coding-challenge/issues
[license-shield]: https://img.shields.io/github/license/acidspud/coding-challenge.svg?style=for-the-badge
[license-url]: https://github.com/acidspud/coding-challenge/blob/master/LICENSE.txt

[React.js]: https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white
[React-url]: https://reactjs.org/
[Golang]: https://img.shields.io/badge/Golang-007D9C?style=for-the-badge&logo=go&logoColor=white
[Golang-url]: https://go.dev/
[Swagger]: https://img.shields.io/badge/Swagger-38b832?style=for-the-badge&logo=swagger&logoColor=white
[Swagger-url]: https://swagger.io/
[Docker]: https://img.shields.io/badge/Docker-003f8c?style=for-the-badge&logo=docker&logoColor=white
[Docker-url]: https://www.docker.com/
[Redis]: https://img.shields.io/badge/Redis-dc382c?style=for-the-badge&logo=redis&logoColor=white
[Redis-url]: https://redis.io/
[Postgresql]: https://img.shields.io/badge/Postgresql-699eca?style=for-the-badge&logo=postgresql&logoColor=white
[Postgresql-url]: https://www.postgresql.org/
[Redux]: https://img.shields.io/badge/Redux-764abc?style=for-the-badge&logo=redux&logoColor=white
[Redux-url]: https://redux.js.org/

