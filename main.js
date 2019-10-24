
(function() {
    var resourceCache = {};
    var loading = [];
    var readyCallbacks = [];
    function load(urlOrArr) {
        if(urlOrArr instanceof Array) {
            urlOrArr.forEach(function(url) {
                _load(url);
            });
        } else {
            _load(urlOrArr);
        }
    }
    function _load(url) {
        if(resourceCache[url]) {
            return resourceCache[url];
        } else {
            var img = new Image();
            img.onload = function() {
                resourceCache[url] = img;

                if(isReady()) {
                    readyCallbacks.forEach(function(func) { func(); });
                }
            };
            resourceCache[url] = false;
            img.src = url;
        }
    }
    function get(url) {
        return resourceCache[url];
    }
    function isReady() {
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
        readyCallbacks.push(func);
    }
    window.Resources = {
        load: load,
        get: get,
        onReady: onReady,
        isReady: isReady
    };
})();
var Engine = (function(global) {
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 1010;
    canvas.height = 855;
    doc.body.appendChild(canvas);
    function main() {
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;
        update(dt);
        render();
        lastTime = now;
        win.requestAnimationFrame(main);
    }

    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    function update(dt) {
        updateEntities(dt);

    }

    function updateEntities(dt) {
        allEnemies.forEach(function(car) {
            car.update(dt);
        });
        allEnemies.forEach(function(car1) {
            car1.update(dt);
        });
        player.update();
        winningblocks.forEach(function(Winblock) {
            Winblock.update();
        });
        points.update();
    }

    function render() {

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
            numRows = 9,
            numCols = 10,
            row, col;


        ctx.clearRect(0,0,canvas.width,canvas.height)

        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {

                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        allEnemies.forEach(function(car) {
            car.render();
        });
        allEnemies.forEach(function(car1) {
            car1.render();
        });
        player.render();

        alllives.forEach(function(lives){
            lives.render();
        });

        allKeys.forEach(function(key) {
            key.render();
        });
        points.render();
    }

    function reset() {

    }

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


let modal = document.querySelector(".start-game");
let overlay = document.querySelector(".overlay");
let gameover = document.querySelector(".game-over");
let winnerModal = document.querySelector(".winner");


var playerPoints = 0;
var playerLives = 3;
function startGame(){
    modal.classList.add("hide");
    overlay.classList.add("hide");


    playerPoints = 0;
}


function gameOver(){
    overlay.classList.add("show");
    gameover.classList.add("show");
}


function resetGame(){
    window.location.reload(true);
}


function checkLives(){
    if (alllives.length === 0){
        gameOver()
    }
}


function youWin(){
    overlay.classList.add("show");
    winnerModal.classList.add("show");
}


var car = function(x, y, speed = 1, carimage) {

    this.x = x;
    this.y = y;
    this.location = ( x, y);
    this.speed = speed;

    this.sprite = carimage;
};


car.prototype.update = function(dt) {

    this.x += 50 * this.speed * dt;

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

car.prototype.render = function() {

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

};


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
