# Climbing Dots	                                       

An app to manage various unique collections of links, documents and videos.

## Stack

Climbing Dots is built entirely in Javascript. Below technology stack is used:

1. [MongoDB](http://mongodb.org/): The leading NoSQL database.
2. [Express](http://expressjs.com/): Fast, unopinionated, minimalist web framework for Node.js.
3. [AngularJS](): HTML enhanced for web apps.
4. [Node.js](http://nodejs.org/): A platform built on Chrome's JavaScript runtime.
5. [Angular Material](http://material.angularjs.org/): Implementation of Material Design in Angular.js.

## Installation

1. `npm i`
2. `bower i` (if there are errors, ensure to create this directory `/public/bower_components` and provide write permissions)
3. Set environment variables while running the app. If you're using `forever` (`npm i forever -g`) to run your app, below command can be helpful:
	`BASEURL=http://climbing-dots.riten.io PORT=8012 DB=delicious_desk_demo AWS_ACCESS_KEY_ID=<KEY> AWS_SECRET_ACCESS_KEY=<KEY> BITLY_TOKEN=<TOKEN> DIIGO_API_KEY=<key> DIIGO_USERNAME=<username> DIIGO_PASSWORD=<password> NODE_ENV=production forever --sourceDir /var/apps/climbing-dots/ -a -l /var/log/climbing-dots.demo.log --minUptime 5000 --spinSleepTime 2000 start index.js`