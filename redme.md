This is a project for learning nestjs.


type "npm run start:dev", to test it.
type "npm run db:setup" to create the postgres ddatabase on docker then "npm run db:start".
You may have to create a "task-management" database using pgAdmin.


## CONCEPTS ##

### Setup project:
* ?
* ?

### Release new version:
To create a new production version out off your development app, use:
`npm run release-dockered:clean`

This will
* build a lightweight, fast, production version of the app into dist folder. 
* logs into heroku container
* builds a docker image of the app (only uses dist folder, .env.stage.production file and production dependencies)
* Pushes this image to heroku
* releases this image on heroku
* opens the app in the browser

All automatic, you just have to wait.
(You may have to install docker, nestjs globally)

### Add a new release



### Generation of pdf-files ###

* Short:
Bootstrap Studio -> Export to pdf/templates/{TEMPLATE_FOLDER} -> Convert .html to .ejs -> modify hrefs in .ejs form href="assets..." to href="../{TEMPLATE_FOLDER}/assets..."

* Long:
We are using external editor, to create templates for e-mails and pdfs: Bootstrap Studio. 
The templates are converted to ejs files, so the backend can inject data into them.
Then we render out the injected document as a page on a specific route: [currently: /sandbox/render-page]

Then we are using puppeteer to load that url: localhost:3000/sandbox/render-page
and generate a pdf of it to a file.

Then we can use that file to send it as a mail


## TODO ##
--- Attila backend 

* Replicate hosting-releasing process on another dummy app
* Fill Install documentation above: ### Setup project:

* Auto permanent development login as admin on: npm run start:dev:admin
* Auto permanent development login as admin on: npm run start:dev:user

* Sessions over JWT

* Password reset + email


* Auto permanent development login as admin on: npm run start:dev:user

* Create an angular app
* Use NX to combine everything
* Upload app to heroku
* You are fully capable to make shitton of money developing fullstack webapps

* Permissions and roles with manytomany relations - MikroORM/Mongoose
  - Admins should create roles with custom set of permissions.
  - Admins and the app should add custom set of permissions to users

* change TypeORM to MikroORM: https://docs.nestjs.com/recipes/mikroorm

* ✅ Run a jwt-refresh-token cleanup every hour - delete all tokens, which autoLogout date is expired. Also delete the onse which are lasts longer than in authConfig - for security reasons. 
* ✅ Token (refreshing), Logout endpoints
* ✅ Create Authorization, dumb permissions, Learn the Guards
* Logout ✅
* ✅ change TypeORM to Mongoose: https://docs.nestjs.com/recipes/mikroorm
* Encapsulate pdf/, mail/ into output module, add template/ module, which will be responsible to create templates and render them as pages, so it can be turned into pdf-s. UPDATE: no new module needed yet ✅
* Dockerize: https://blog.logrocket.com/containerized-development-nestjs-docker/ ✅
* Use docker to create a docker image of the production app ✅
* Host server on Heroku ✅