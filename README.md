![banner](https://repository-images.githubusercontent.com/377238967/a54d6580-de8d-11eb-9672-b854042ed0f6)

# Description
Web app that let you upload documents for digitally sign or generate documents from templates.<br>
<img src="https://github.com/fernandomema/Gestor-PDF/blob/fernando-frontend/assets/screenshot_home.png?raw=true" width="33%">
<img src="https://github.com/fernandomema/Gestor-PDF/blob/fernando-frontend/assets/screenshot_home.png?raw=true" width="33%">
<img src="https://github.com/fernandomema/Gestor-PDF/blob/fernando-frontend/assets/screenshot_home.png?raw=true" width="33%">
<img src="https://github.com/fernandomema/Gestor-PDF/blob/fernando-frontend/assets/screenshot_home.png?raw=true" width="33%">
<img src="https://github.com/fernandomema/Gestor-PDF/blob/fernando-frontend/assets/screenshot_home.png?raw=true" width="33%">
<img src="https://github.com/fernandomema/Gestor-PDF/blob/fernando-frontend/assets/screenshot_home.png?raw=true" width="33%">

## Stack
- Frontend
  - html
  - css
  - js
  - jquery
  - bootstrap + tabler components
- Backend
  - Laravel
  - MySQL

# Deploy status
- Frontend:
  - https://fernandomema.github.io/Gestor-PDF/frontend
- Backend: 
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
 
