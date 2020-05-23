# Introduction
This serves as a project assingment assigned by eduka. Github links are [here](https://github.com/skykykykykykykykykykykys/alpha-centauri).

## Grader Service
        - Grader Service will receive examsheets which are explained above. You have to create an API to calculate the score and then store the score to your local MySQL. Design your own data schema that will ease your further work.
        - You have to create an API to fetch the score from your local MySQL and return it in JSON format as informative and as efficiently as you can.
## Ranker Service
        - You have to create an API that will fetch all Ranking. You will fetch all scores from your Grader service and rank them without store it and then show it in JSON format complete with the user’s details which you can have from the User Service that we have already provided.
        - You have to create an API that will fetch a specified user’s Ranking. You will fetch all scores and rank them all and then give back that specified user Rank complete with the user’s details.

## init:
Inside the _code_ folder, 
```
npm install -g
```
## how to start:
```
nodemon
```




## TODO:
testing null values buat grader
testing tanpa path parameter
testing path parameternya salah