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
 -  forward traffic on port 80 to 3000 (use nginx?)
 -  configure systemd or use 'forever' package
 -  remove phaser from index.html and add it to build process
 -  add onleave event 


## Todos
 - [x] Setup the http server
 - [x] Create the base frontend interface
 - [] Create an item entity for later
 - [x] The player should be able to hold and shoot a gun (or other items later)
 - [x] Create base game world including a simple tilemap
 - [x] Add a moveable camera to the game world
 - [x] Create a simple player entity and add it to the game world
 - [x] The player should be able to run and jump
 - [] Add aim cursor
 - [x] Create a simple login dialog
 - [x] Projectiles should collide with other players and the ground
 - [x] Shooting should push the player in the opposite direction during a jump
 - [x] Fix shooting direction when the mouse is between player and weapon

 - [x] Setup the websocket server
 - [x] The server should be able to manage multiple players / connections
 - [x] One players action should be visible on other connected clients
 (!!! Connected doesn‘t mean logged in)
 - [x] Handle collsion between character sprites and projectiles
 - [x] Player should have health and ammo
 - [x] Player should die when he has no health and be removed from the game
 - [x] After death a play again dialog should pop up
 - [x] Create Jetpack, projectile and weapon sprite, jetpack fuel, health, ammo,
 deathskull
 - [x] The player should be able to reenter the game after death
 - [x] Pressing tab should show the top ten best players in game 
 - [x] Show a GUI where the player can see his current health and ammo
 - [x] The player should be able to pick up health and ammo on the map
 - [x] Add death sprite
  
 - [x] setup a postgres database connection using an orm
 - [x] Add passportjs to the app and provide an oauth login
 - [x] Make logged in players be able to get trophies and save the current trophy into the database
 - [x] Create a user page

 - [x] Upload the game on heroku and test it
 - [x] If there are any huge problems fix them and make the game playable 
 - [x] Fix revive inventory bug
 - [x] Create a profile page for every user
 - [] Add Background

 - [x] Add soundfx for walking, jetpack, shooting, explosion, item pickup, no ammo
 - [x] Add controls guide to login dialog
 - [] Add trollface skin, nyancat
 - [] Refactor socket connection and handle position interpolation
 - [] Fix reenter bug (wrong position)
 - [] Refactoring: Put pickup server code into own file
 - [] Refactoring: create a soundservice (pool)
 
