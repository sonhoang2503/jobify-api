# Jobify API

### Perfect application for your job tracking!

Live demo   : https://jobify-hoangnguyen.netlify.app/landing 


Test account: ( email: hoang253@gmail.com // password: test1234)

API documentation: https://jobify-hoangnguyen.herokuapp.com/
## Main features

* Authentication and Authorization 
  - Login and logout 

* Job
  - Get jobs  stats through chart
  - Manage new job (crud)
  - Jobs list with filter , sort ,search

* User
  - User profile check and update 

## Demonstration

![jobify-app](dev-data/2022-04-29%20(2).png)
![jobify-app](dev-data/2022-04-29%20(3).png)
![jobify-app](dev-data/2022-04-29%20(4).png)




## Main Tools And Technologies 

* React , ContextAPI , style-components
* Nodejs, expressjs, mongodb, mongoose, jwt.

## Installation
You can fork the app or you can git-clone the app into your local machine. Once done that, please install all the
dependencies by running
```

$ npm install

!Set up your env variables 
$ npm start
```
### Setting Up Your Local Environment

* In your .env file, set environment variables for the following:


```
    * NODE_ENV= production
    * DATABASE=your mongodb database url

    *JWT_SECRET=jwtSecret
    *JWT_LIFETIME=1d

```

## Acknowledgement

* This small project is part of the online course i have taken.
* The express purpose is to practice my skill in fullstack web development!


