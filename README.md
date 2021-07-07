![banner](https://repository-images.githubusercontent.com/377238967/a54d6580-de8d-11eb-9672-b854042ed0f6)
[![Open Source](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://opensource.org/)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/fernandomema/Gestor-PDF)

# Description
Web app that let you upload documents for digitally sign or generate documents from templates.<br>
<img src="https://github.com/fernandomema/Gestor-PDF/blob/fernando-frontend/assets/screenshot_home.png?raw=true" width="32%">
<img src="https://github.com/fernandomema/Gestor-PDF/blob/fernando-frontend/assets/screenshot_home.png?raw=true" width="32%">
<img src="https://github.com/fernandomema/Gestor-PDF/blob/fernando-frontend/assets/screenshot_home.png?raw=true" width="32%">
<img src="https://github.com/fernandomema/Gestor-PDF/blob/fernando-frontend/assets/screenshot_home.png?raw=true" width="32%">
<img src="https://github.com/fernandomema/Gestor-PDF/blob/fernando-frontend/assets/screenshot_home.png?raw=true" width="32%">
<img src="https://github.com/fernandomema/Gestor-PDF/blob/fernando-frontend/assets/screenshot_home.png?raw=true" width="32%">

## Stack
- Frontend
  - ![html](https://img.shields.io/badge/HTML-239120?style=for-the-badge&logo=html5&logoColor=white)
  - ![css](https://img.shields.io/badge/CSS-239120?&style=for-the-badge&logo=css3&logoColor=white)
  - ![js](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
  - ![Jquery](https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white)
  - ![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white) + tabler components
- Backend
  - ![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
  - ![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)

# Deploy status
- Frontend:
  - ![status](https://img.shields.io/website-up-down-green-red/http/fernandomema.github.io/Gestor-PDF/frontend.svg)
  - https://fernandomema.github.io/Gestor-PDF/frontend
- Backend: 
  - ![status](https://img.shields.io/website-up-down-green-red/http/insta-pdf.herokuapp.com.svg)
  - ![Heroku](https://heroku-badge.herokuapp.com/?app=insta-pdf)
  - https://insta-pdf.herokuapp.com/

# Diagrams
- [Database ER diagram](https://github.com/fernandomema/Gestor-PDF/blob/main/DB_ER_Diagram.png?raw=true)
- [Navigability map](https://github.com/fernandomema/Gestor-PDF/blob/main/navigability_map.png?raw=true)

# SetUp
## Backend
- Clone Backend repo
  - ```git clone -b Backend --single-branch https://github.com/fernandomema/Gestor-PDF.git```
- Install dependencies
  - ```composer install```
- Create .env file
  - ```cp .env.example .env```
  - edit .env files with your variables
    - Required variables to aplication work
      - Database variables
      - SMTP variables
- Run migrations
  - ```php artisan migrate```
- Generate laravel keys
  - ```php artisan key:generate```
- Generate laravel passport keys
  - ```php artisan passport:keys```
 
