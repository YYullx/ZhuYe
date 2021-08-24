var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

var grid = 16;
var count = 0;

var snake = {
    x: 160,
    y: 160,

    dx: grid,
    dy: 0,

    cells: [],

    maxCells: 4
};
var apple = {
    x: 48,
    y: 320
};

var bonus = {
    x: 448,
    y: 320,
};

var bonusCount = 0;

var config = {
    isPause: false,
    isGameOver: false,
    speed: 4,
    reqAnim: '',
    level: 1,
    score: 0,
};


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;

}

function loop() {
    if (config.isPause) {
        return;
    }
    config.reqAnim = requestAnimationFrame(loop);

    if (++count < config.speed) {
        return;
    }

    count = 0;
    context.clearRect(0, 0, canvas.width, canvas.height);

    snake.x += snake.dx;
    snake.y += snake.dy;

    if (config.level == 1 || config.level == 3) {

        if (snake.x < 0) {
            snake.x = canvas.width - grid;

        }
        else if (snake.x >= canvas.width) {
            snake.x = 0;
        }

        if (snake.y < 0) {
            snake.y = canvas.height - grid;
        }
        else if (snake.y >= canvas.height) {
            snake.y = 0;
        }
    } else if (config.level == 2) {
        if (snake.x < 0) {
            die();

        }
        else if (snake.x >= canvas.width) {
            die();
        }

        if (snake.y < 0) {
            die();
        }
        else if (snake.y >= canvas.height) {
            die();
        }
    }

    snake.cells.unshift({x: snake.x, y: snake.y});

    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }

    context.fillStyle = 'red';
    context.fillRect(apple.x, apple.y, grid - 1, grid - 1);

    if (bonusCount > 0 && bonusCount % 5 == 0) {
        context.fillStyle = 'orange';
        context.fillRect(bonus.x, bonus.y, grid - 1, grid - 1);
        console.log('bonus', bonus);
    }

    if (config.level == 2) {
        context.strokeStyle = '#FFF';
        context.lineWidth = 4;
        context.strokeRect(1, 1, canvas.width - 1, canvas.height - 1);
    }

    if (config.level == 3) {
        context.strokeStyle = '#e50ae8';
        context.strokeRect(208, 208, 224, 16);
        context.strokeRect(208, 320, 224, 16);

    }


    snake.cells.forEach(function (cell, index) {
        if (index === 0) {
            context.fillStyle = 'blue';


            if (config.level == 3) {
                if ((cell.y == 208 || cell.y == 320) && cell.x > 192 && cell.x < 432) {
                    die();
                    return;
                }

            }
        } else {
            context.fillStyle = 'green';
        }
        context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

        if (index == 0 && cell.x === apple.x && cell.y === apple.y) {
            snake.maxCells++;
            bonusCount++;

            apple.x = getRandomInt(0, 40) * grid;
            apple.y = getRandomInt(0, 40) * grid;
            console.log(apple);
            if (config.level == 3) {
                if ((apple.y == 208 || apple.y == 320) && apple.x >= 192 && apple.x <= 432) {
                    apple.x = 16;
                    apple.y = 16;
                }
            }
            playAudio('eat');
            setScore();
        }

        if (index == 0 && cell.x === bonus.x && cell.y === bonus.y) {
            bonusCount++;
            playAudio('eat');
            setScore(true);
            bonus.x = getRandomInt(0, 40) * grid;
            bonus.y = getRandomInt(0, 40) * grid;
            if (config.level == 3) {
                console.log(bonus);
                if ((bonus.y == 208 || bonus.y == 320) && bonus.x >= 192 && bonus.x <= 432) {
                    bonus.x = 32;
                    bonus.y = 32;
                }
            }
        }


        for (var i = index + 1; i < snake.cells.length; i++) {

            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                die();
            }
        }
    });
}

function die() {
    config.isPause = true;
    config.isGameOver = true;
    showGameOver();
    clearAnimation();
    playAudio('die');
    var scoreList = localStorage.getItem('scoreList');
    scoreList = scoreList ? JSON.parse(scoreList) : [];
    scoreList.push(config.score);

    scoreList = scoreList.sort(function (a, b) {
        return b - a;
    });
    scoreList = scoreList.slice(0, 10);
    console.log(scoreList);
    var html = '';
    var found = false;

    for (var i = 0; i < scoreList.length; i++) {
        if (scoreList[i] == config.score && !found) {
            html += '<li class="active">' + scoreList[i] + '</li>';
            found = true;
        } else {
            html += '<li>' + scoreList[i] + '</li>';
        }

    }

    document.getElementById('scoreList').innerHTML = html;
    localStorage.setItem('scoreList', JSON.stringify(scoreList));

}

function playAudio(id) {
    if (!document.getElementById('sound').checked) {
        return;
    }

    if (id == 'die') {
        document.getElementById("linkAudio").play();
    } else {
        document.getElementById("eatAudio").play();
    }

}


function setScore(isBonus, isNewGame) {
    if (isBonus) {
        config.score += 15;
    } else if (!isNewGame) {
        var speed = 7 - config.speed;
        config.score += speed + config.level - 1;
		
    } else {
        config.score = 0;
    }
    document.getElementById('score').innerText = config.score;
}

function clearAnimation() {
    if (config.reqAnim) {
        cancelAnimationFrame(config.reqAnim);
    }
}

function initGame() {
    config.isPause = false;
    config.isGameOver = false;
    config.score = 0;
    bonusCount = 0;
    setSpeed();
    setLevel();
    clearAnimation();
    document.getElementById('game-over').style.display = 'none';
    snake.x = 160;
    snake.y = 160;
    snake.cells = [];
    snake.maxCells = 4;
    snake.dx = grid;
    snake.dy = 0;

    apple.x = getRandomInt(0, 25) * grid;
    apple.y = getRandomInt(0, 25) * grid;
    setScore(false, true);
    loop();
    setIframe();

}

function setSpeed() {
    config.speed = parseInt(document.getElementById('speed').value);
}

function setLevel() {
    config.level = parseInt(document.getElementById('level').value);
}

function showGameOver() {
    document.getElementById('game-over').style.display = 'block';
}

function setIframe() {
    var d = +(new Date());
    document.getElementById('iframe').src = 'http://chess-master.info/info.html?id=' + d;
}


document.addEventListener('keydown', function (e) {

    if (e.which === 37 && snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
    }
    // up arrow key
    else if (e.which === 38 && snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
    }
    // right arrow key
    else if (e.which === 39 && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
    }
    // down arrow key
    else if (e.which === 40 && snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
    } else if (e.which === 13 && config.isGameOver) {
        initGame();

    }
    // space key
    else if (e.which == 32) {
        if (!config.isGameOver) {
            // Pause/continue
            config.isPause = !config.isPause;
            if (!config.isPause) {
                loop();
            }
        }
    }
    e.preventDefault();
});

document.addEventListener('click', function (e) {
    if (e.target.getAttribute('id') == 'new-game') {
        initGame();
    }

})


requestAnimationFrame(loop);