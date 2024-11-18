# E-COMMERCE MERN Stack PROJECT

1. Environment Setup

2. create Express server setup -> express

3. morgan and POSTMEN setup AND testing
4. Third party middleware type and middleware setup & apply

- app.use(bodyParser.json())
- app.use(bodyParser.urlencoded({ extended: true }))

5. Express Error middleware in the apply project -> body- parser

6. HTTP ERROR Handle by -> http-errors

7. how to secure api limit -> xss-clean, express-rate-limit

8. environment github this file ignore git push -> github ignore (.gitignore)

9. dotenv and install and setup -> npm install dotenv >> require('dotenv').config()

\*\* MVC Architecture Setup

10. schema and model for use in the code
11. create seed router for testing
12. GET/api/users -> isAdmin -> getAllUsers -> search by name, email, phone -> And pagination functionality
13. Responser Handler by Helper folder success and Error message show
14. GET/api/users/:id -> get a single user by id
15. How to create services in the backend
16. user id fine by Deleted
17. refactoring and dynamic
18. delete image user by helper
19. POST/api/users/process-register -> process the registration
20. POST/api/users/verify -> verify + register info
21. smtp setup in the server site
    (http://security.google.com/settings/security/apppasswords)
22. smtp setup and prepare email (npm i nodemailer )
23. send email by user successful
24. user verify POST /api/users/activate
    !user login in the server site setup now
    !user login check the email and password and is the user isBanned
    !setup in the user create jwt token and all data by http cookie
    !user log out server site setup now
25. user verify POST /api/auth/login
    !user logout then user set is a cookie key is clear and empty now
26. user verify POST /api/auth/logout
27. Middlewares -> isLoggedIn, isLoggedOut, isAdmin
28. Get/api/auth/refresh -> refresh the token
