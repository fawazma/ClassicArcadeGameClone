//Image loading module
(function() {
    var resourceCache = {};
    var loading = [];
    var readyCallbacks = [];

    //This is the image loading function
    //urlOrArr can be Array of images and a single image
    //Then we call loading function
    function load(urlOrArr) {
        if(urlOrArr instanceof Array) {
          //urlOrArr is Array of images
            urlOrArr.forEach(function(url) {
                _load(url);
            });
        } else {
          //urlOrArr is a single image
            _load(urlOrArr);
          //call loading function of single image
        }
    }

    //It will re-use chached images saved in resourceCache if you attempt to load the same image multiple times
    function _load(url) {

        if(resourceCache[url]) {
          //if image url loaded prev time, just return image rather reload image.
            return resourceCache[url];
        } else {
          //url has not been loaded prev time.
            var img = new Image();
            //load image from url.
            img.onload = function() {
              //once image has loaded , then add image to cache.
                resourceCache[url] = img;

                if(isReady()) {
                    readyCallbacks.forEach(function(func) { func(); });
                }
            };
            //Set the initial cache value to false. this will change when calling image's onload event handler.
            resourceCache[url] = false;
            //image's src attribute to the passed in url.
            img.src = url;
        }
    }
    function get(url) {
      //grab references to images they know have been previously loaded.
        return resourceCache[url];
    }
    function isReady() {
      //This function checks if all the images requested to be loaded are loaded properly.
        var ready = true;
        for(var k in resourceCache) {
            if(resourceCache.hasOwnProperty(k) &&
               !resourceCache[k]) {
                ready = false;
            }
        }
        return ready;
    }
    function onReady(func) {
      //Add a function to the callback stack that is called when every images are loaded correctly.
        readyCallbacks.push(func);
    }
    window.Resources = {
        load: load,
        get: get,
        onReady: onReady,
        isReady: isReady
    };
})();

//End of image loading module


//A game engine works by drawing the entire game screen
var Engine = (function(global) {
    var doc = global.document, //get doucment handle
        win = global.window, // get window handle
        canvas = doc.createElement('canvas'), //create canvas element
        ctx = canvas.getContext('2d'), //grab the 2D context for that canvas
        lastTime;

    canvas.width = 1010; //set canvas width
    canvas.height = 855; // set canvas height
    doc.body.appendChild(canvas); //add canvas to DOM

    function main() {
      //get current time to now valiable.
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;
        update(dt);
        render(); // call update/render function pass data along dt(delta time) so it can make smooth anim.
        lastTime = now;

        // call requestAnimationFrame function to call draw another frame.
        win.requestAnimationFrame(main);
    }

    function init() {
        reset();
        lastTime = Date.now();
        main();
    }
    //call updateentities function
    function update(dt) {
        updateEntities(dt);

    }
    //update all entities.
    function updateEntities(dt) {
        //update all enemy that move left to right.
        allEnemies.forEach(function(car) {
            car.update(dt);
        });
        //update all enemy that move right to left
        allEnemies.forEach(function(car1) {
            car1.update(dt);
        });
        //update player who acrssing the road.
        player.update();
        //winningblock update
        winningblocks.forEach(function(Winblock) {
            Winblock.update();
        });
        //update points
        points.update();
    }
    //This function initially draws the "game level"
    function render() {
        //this is imageurl arrays.
        var rowImages = [
                'images/sidewalk-block.png',
                'images/road-block.png',
                'images/road-block.png',
                'images/road-block.png',
                'images/road-block.png',
                'images/road-block.png',
                'images/road-block.png',
                'images/sidewalk-block.png',
                'images/sidewalk-block.png'
            ],
            numRows = 9, //number of rows
            numCols = 10, //number of columns
            row, col;


        ctx.clearRect(0,0,canvas.width,canvas.height)
        //draw images to grid with row images.
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {

                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }
        //draw all enemies
        allEnemies.forEach(function(car) {
            car.render();
        });
        allEnemies.forEach(function(car1) {
            car1.render();
        });
        //draw player
        player.render();
        //draw allives
        alllives.forEach(function(lives){
            lives.render();
        });
        //draw keys
        allKeys.forEach(function(key) {
            key.render();
        });
        //draw pointer
        points.render();
    }

    function reset() {

    }

    //this function is used to load images from resource
    Resources.load([
        'images/road-block.png',
        'images/suv_car.png',
        'images/suv_car_back.png',
        'images/sedan_car_back.png',
        'images/sedan_car.png',
        'images/win.png',
        'images/heart.png',
        'images/sidewalk-block.png',
        'images/saudiguy.png',
        'images/medal.png'

    ]);
    Resources.onReady(init);

    global.ctx = ctx;
})(this);

//this part is control all activities in game.
let modal = document.querySelector(".start-game");
let overlay = document.querySelector(".overlay");
let gameover = document.querySelector(".game-over");
let winnerModal = document.querySelector(".winner");


var playerPoints = 0; //playerpoint 0
var playerLives = 3; // set player lives 3

//this function to hide modal
function startGame(){
    modal.classList.add("hide");
    overlay.classList.add("hide");


    playerPoints = 0;
}

//when player lives becom 0  show modal for restart.
function gameOver(){
    overlay.classList.add("show");
    gameover.classList.add("show");
}

//when player crash cars in road, make player location to first  place
function resetGame(){
    window.location.reload(true);
}

//if lives ==0 make game over.
function checkLives(){
    if (alllives.length === 0){
        gameOver()
    }
}


function youWin(){
    overlay.classList.add("show");
    winnerModal.classList.add("show");
}

//make enemy moves left to right
var car = function(x, y, speed = 1, carimage) {

    this.x = x;
    this.y = y;
    this.location = ( x, y);
    this.speed = speed;

    this.sprite = carimage;
};


car.prototype.update = function(dt) {
//Change x position of car everyupdate.
    this.x += 50 * this.speed * dt;
    //enemy's postion and player's position is equal
    if (parseInt(this.x)+ 100 >= playerX && parseInt(this.x) <= playerX + 40 && this.y+10 == playerY){
        console.log("a collision just occured your player diessss");
        player.reset();
        //player position reset
        alllives.pop();
        //decrease lives
        playerLives -= 1
        if (playerPoints >= 50){
            playerPoints -= 50;
        }
    }
    checkLives();
};

car.prototype.render = function() {

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

};

//same as car.
var car1 = function(x, y, speed = 1, carimage) {

    this.x = x;
    this.y = y;
    this.location = ( x, y);
    this.speed = speed;
    this.sprite = carimage;
};

car1.prototype.update = function(dt) {

    this.x -= 50 * this.speed * dt;

    if (parseInt(this.x)+ 100 >= playerX && parseInt(this.x) <= playerX + 40 && this.y+10 == playerY){
        console.log("a collision just occured your player diessss");
        player.reset();
        alllives.pop();
        playerLives -= 1
        if (playerPoints >= 50){
            playerPoints -= 50;
        }
    }
    checkLives();
};


car1.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

};

//make player
var Player = function (x, y){
    this.x = x;
    this.y = y;
    this.sprite = 'images/saudiguy.png';
};
var playerX
var playerY

Player.prototype.update = function(){
    playerX = this.x;
    playerY = this.y;
}


Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

//when key left, up, right, down pressed, move player position
Player.prototype.handleInput = function(pressedKeys){
    if (pressedKeys === 'left' && this.x > 33){
        this.x -= 100;
    }
    else if (pressedKeys === 'up'&& this.y > 18){
        this.y -= 80;
    }
    else if (pressedKeys === 'right' && this.x < 900){
        this.x += 100
    }
    else if (pressedKeys === 'down' && this.y < 630){
        this.y += 80
    }
};
//player position.
Player.prototype.reset = function(){
    this.x = 500;
    this.y = 630;
}


var Lives = function(x, y){
    this.x = x;
    this.y = y
    this.sprite = 'images/heart.png';
};

Lives.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 28, 42);
}


var Key = function(x, y){
    this.x = x;
    this.y = y;
    this.sprite = 'images/medal.png';
}

Key.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 90, 130);
}



var Winblock = function(x, y){
    this.x = x;
    this.y = y
}

var winblockX
var winblockY
Winblock.prototype.update = function(){
    winblockX = this.x;
    winblockY = this.y;

    if((-Math.abs(winblockY))+10 == playerY && this.x == playerX){
        allKeys.push(new Key(winblockX, winblockY));
        playerPoints += 100;
        player.reset();
    }
    if (allKeys.length == 5){        console.log("You win Game");
        youWin();
    }
}


var Points = function(x, y, score){
    this.x = x;
    this.y = y;
    this.score = "Your points: "+ playerPoints
}
Points.prototype.render = function(){
    ctx.font = '20px serif';
    ctx.fillText(this.score, this.x, this.y);
}
//update player point when player arrvied to opposite sidewalk
Points.prototype.update = function(){
    this.score = "Your points: "+ playerPoints
}


var flag;
var columns = [ -5, -100, -200, -300, -400,-500,-600,-700,-800,-900];
var columns1 = [ 1005, 1100, 1900, 1200, 1300,1400,1500,1600,1700,1800];
var carX;
var car1X;

var rows = [ 300,380,460];
var rows1 = [ 60, 140, 220];
var carY;
var car1Y;
var carSpeed;
var carImage;
var cars =['images/suv_car.png','images/sedan_car.png',];
var cars1 =['images/suv_car_back.png','images/sedan_car_back.png',];

setInterval(function instances(){
    carX = columns[Math.floor(Math.random() * 10)],
    carY = rows[Math.floor(Math.random() *  6)],
    carSpeed = Math.floor(Math.random() * 15+0.1),
    carImage = cars[Math.floor(Math.random() * 2)],
    allEnemies.push(new car(carX, carY, carSpeed, carImage));
    car1X = columns1[Math.floor(Math.random() * 10)],
    car1Y = rows1[Math.floor(Math.random() *  6)],
    carSpeed = Math.floor(Math.random() * 15+0.1),
    carImage = cars1[Math.floor(Math.random() * 2)],
    allEnemies.push(new car1(car1X, car1Y, carSpeed, carImage));
},500)





var allEnemies = [];


var player = new Player( 500, 630);


var alllives = [ new Lives(10, 780), new Lives(40, 780), new Lives(70, 780), new Lives(100, 780), new Lives(130, 780)];

var allKeys = [ ];


var winningblocks = [ new Winblock(0, 20), new Winblock(100, 20), new Winblock(200, 20), new Winblock(300, 20), new Winblock(400, 20),new Winblock(500, 20), new Winblock(600, 20), new Winblock(700, 20), new Winblock(800, 20), new Winblock(900, 20)];

var points = new Points(850, 820)




document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
