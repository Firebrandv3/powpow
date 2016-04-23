# powpow

> powpow is my first web project for the college. It‘s a multiplayer online
> shooter based on the [phaser.js] (http://phaser.io/) game framework and node.js. 


## License

Code is licensed under ISC. Content is licensed under CC-BY-SA 3.0. See the LICENSE file for details.


## NPM Commands

```bash          
    start                   run the node app in production environment
    start:dev               start the app with nodemon in develop environment
```


## Grunt Commands

```bash          
    grunt                   builds all files and starts the watch task
    grunt build             builds all files
```

## Notes
 -  forward traffic on port 80 to 3000 (nginx?)
 -  configure systemd or use 'forever' package
 -  install iterm2
 -  remove phaser from index.html and add it to build process
 -  add onleave event 


## Todos
 [x] Setup the http server
 [x] Create the base frontend interface
 [] Create an item entity for later use
 [] The player should be able to hold and shoot a gun (or other items later)
 [x] Create base game world including a simple tilemap
 [x] Add a moveable camera to the game world
 [x] Create a simple player entity and add it to the game world
 [x] The player should be able to run and jump
 [] Add aim cursor
 [] Create a game logo
 [] Create a simple login dialog
 [] Setup the websocket server
 [] The server should be able to manage multiple players / connections
 [] One players action should be visible on other connected clients
    (!!! Connected doesn‘t mean logged in)
 [] setup a postgres database connections using an orm
 [] Add passportjs to the app and provide an oauth login
 [] Make logged in players be able to get trophies and save the current trophy into the database
 
