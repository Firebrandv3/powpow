# powpow

> powpow is my first web project for the college. It‘s a multiplayer online
> shooter based on the [phaser.js] (http://phaser.io/) game framework and node.js. 


## License

Code is licensed under ISC. Content is licensed under CC-BY-SA 3.0. See the LICENSE file for details.


## NPM Commands

```bash          
    lint:client             linting all client side js files using jshint
    lint:server             linting all server side js files using jshint
    build:scss              compile all scss files inside the client folder
    build:js                lint and concatenate all client side js files 
    build:all               build js and scss files
    watch:js                auto lint and build all js files on change
    watch:scss              auto build all scss files on change
    watch                   watch js and scss files
    demon                   run the node app in production environment
    demon:dev               run the node app in develop environment
```


## Notes
 - Check out the node-config package 


## Todos
 [] Setup the http server
 [] Create the base frontend interface
 [] Create base game world including a simple tilemap
 [] Add a moveable camera to the game world
 [] Create a simple player entity and add it to the game world
 [] The player should be able to run and jump
 [] Create an item entity for later use
 [] The player should be able to hold and shoot a gun (or other items later)
 [] Create a simple login dialog
 [] Setup the websocket server
 [] The server should be able to manage multiple players / connections
 [] One players action should be visible on other connected clients
    (!!! Connected doesn‘t mean logged in)
 [] setup a postgres database connections using an orm
 [] Add passportjs to the app and provide an oauth login
 [] Make logged in players be able to get trophies and save the current trophy into the database
 
