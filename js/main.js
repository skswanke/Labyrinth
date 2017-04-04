var board = new Board()
var hand1 = new Hand()
var hand2 = new Hand()
var player1Position = [0, 0]
var player2Position = [6, 6]
var playerTurn = true
var turnStage = 0

// Knuth Shuffle 
// http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function handDealer() {
    var initTreasures = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
    var shuffledTreasures = shuffle(initTreasures)

    for (var i = 0; i < shuffledTreasures.length; i++) {
        if (i.mod(2) === 0) {
            hand1.addCard(shuffledTreasures[i])
        } else {
            hand2.addCard(shuffledTreasures[i])
        }
    }
    hand1.drawCard()
    hand2.drawCard()
}

// Mathematical Modulo Operator 
// http://javascript.about.com/od/problemsolving/a/modulobug.htm
Number.prototype.mod = function (n) {
    return ((this % n) + n) % n
}

function shiftPlayer(player, direction) {
    if (player === 1) {
        if (direction === 0)
            player1Position[0] = (player1Position[0] - 1).mod(7)
        else if (direction === 2)
            player1Position[0] = (player1Position[0] + 1).mod(7)
        else if (direction === 1)
            player1Position[1] = (player1Position[1] + 1).mod(7)
        else if (direction === 3)
            player1Position[1] = (player1Position[1] - 1).mod(7)
    }
    if (player === 2) {
        if (direction === 0)
            player2Position[0] = (player2Position[0] - 1).mod(7)
        else if (direction === 2)
            player2Position[0] = (player2Position[0] + 1).mod(7)
        else if (direction === 1)
            player2Position[1] = (player2Position[1] + 1).mod(7)
        else if (direction === 3)
            player2Position[1] = (player2Position[1] - 1).mod(7)
    }
}

function validShift(x, y) {
    if ((x === 0 || x === 6) && y.mod(2) === 1)
        return true
    if ((y === 0 || y === 6) && x.mod(2) === 1)
        return true
    return false
}

function handleClick(target) {
    if (target.parentElement.classList.contains("cell")) {
        var targetId = target.parentElement.id
        var idSplit = targetId.split("")
        var x = parseInt(idSplit[0])
        var y = parseInt(idSplit[1])
        if (turnStage === 1 && board.isPlayerCanMove([x, y])) {
            if (playerTurn) {
                player1Position = [x, y]
            } else {
                player2Position = [x, y]
            }

            checkTreasure()
            turnStage = 0
            playerTurn = !playerTurn
            draw()
        } else if (turnStage === 0 && validShift(x, y)) {
            if (player1Position[1] === y && x === 6) {} else if (player1Position[1] === y && x === 0) {
                shiftPlayer(1, 2)
            } else if (player1Position[0] === x && y === 6) {
                shiftPlayer(1, 3)
            } else if (player1Position[0] === x && y === 0) {
                shiftPlayer(1, 1)
            }

            if (player2Position[1] === y && x === 6)
                shiftPlayer(2, 0)
            else if (player2Position[1] === y && x === 0)
                shiftPlayer(2, 2)
            else if (player2Position[0] === x && y === 6)
                shiftPlayer(2, 3)
            else if (player2Position[0] === x && y === 0)
                shiftPlayer(2, 1)

            board.shiftboard(parseInt(idSplit[0]), parseInt(idSplit[1]))

            while (board.playerCanMove.length > 0)
                board.playerCanMove.pop()
            while (board.visited.length > 0)
                board.visited.pop()

            if (playerTurn)
                board.pathfinder(player1Position[0], player1Position[1])
            else
                board.pathfinder(player2Position[0], player2Position[1])

            turnStage = 1
            draw()
        }
    }
}

function clearTreasure() {
    imgs = document.getElementsByClassName("treasure")
    for (var i = 0; i < imgs.length; i++) {
        var img = imgs[i]
        if (img)
            img.parentElement.removeChild(img)
    }
}

function checkTreasure() {
    if (playerTurn) {
        var tile = board.board[player1Position[0]][player1Position[1]]
        if (tile.treasure === hand1.currentCard) {
            tile.treasure = null
            hand1.drawCard()
            div = document.getElementById(player1Position[0].toString() + player1Position[1].toString())
            draw()
        }
    } else {
        var tile = board.board[player2Position[0]][player2Position[1]]
        if (tile.treasure === hand2.currentCard) {
            tile.treasure = null
            hand2.drawCard()
            draw()
        }
    }
}

function checkWin() {
    if (player1Position[0] === 0 && player1Position[1] === 0 && hand1.currentCard === null)
        window.location.href = "redwin.html"
    else if (player2Position[0] === 6 && player2Position[1] === 6 && hand2.currentCard === null)
        window.location.href = "bluewin.html"
}

function draw() {
    checkWin()
    clearTreasure()
    for (var i = 0; i < 7; i++) {
        for (var j = 0; j < 7; j++) {
            var div = document.getElementById(i.toString() + j.toString())
            var img = div.getElementsByTagName("img")[0]
            img.src = "images/" + board.board[i][j].numPaths.toString() + ".png"
            img.style.transform = "rotate(" + (board.board[i][j].rotation * 90).toString() + "deg)"
            if (board.isPlayerCanMove([i, j]) && turnStage === 1) {
                img.style.backgroundColor = "#90ee90"
            } else {
                img.style.backgroundColor = ''
            }
            if (board.board[i][j].locked && !div.classList.contains("locked"))
                div.className += " locked"
            if (board.board[i][j].treasure) {
                var treasure
                if (div.getElementsByClassName("treasure")[0]) {
                    treasure = div.getElementsByClassName("treasure")[0]
                } else {
                    treasure = document.createElement("img")
                }
                treasure.src = "images/treasures/" + board.board[i][j].treasure.toString() + ".svg"
                treasure.width = 40
                treasure.height = 40
                if (!treasure.classList.contains("treasure"))
                    treasure.className += "treasure"
                div.appendChild(treasure)
            } else {
                if (div.getElementsByClassName("treasure")[0])
                    treasure = div.removeChild(div.getElementsByClassName("treasure")[0])
            }
        }
    }
    var div = document.getElementById("outer-cell")
    var img = div.getElementsByTagName("img")[0]
    var outerTile = board.outerTile
    img.src = "images/" + outerTile.numPaths.toString() + ".png"
    img.style.transform = "rotate(" + (outerTile.rotation * 90).toString() + "deg)"
    if (outerTile.treasure) {
        var treasure
        if (div.getElementsByClassName("treasure")[0]) {
            treasure = div.getElementsByClassName("treasure")[0]
        } else {
            treasure = document.createElement("img")
        }
        treasure.src = "images/treasures/" + outerTile.treasure.toString() + ".svg"
        treasure.width = 40
        treasure.height = 40
        if (!treasure.classList.contains("treasure"))
            treasure.className += "treasure"
        div.appendChild(treasure)
    }

    var instructions = document.getElementById("instructions")
    if (turnStage === 0) {
        instructions.innerText = "Place the tile"
    } else if (turnStage === 1) {
        instructions.innerText = "Move your peg"
    }

    var currentTreasureImg = document.getElementById("current-treasure")
    var indicator = document.getElementById("turn-indicator")
    if (playerTurn) {
        if (hand1.currentCard) {
            currentTreasureImg.hidden = false
            currentTreasureImg.src = "images/treasures/" + hand1.currentCard.toString() + ".svg"
        } else {
            currentTreasureImg.hidden = true
        }

        indicator.innerText = "Red's Turn"
        indicator.style.color = "red"
    } else {
        if (hand2.currentCard) {
            currentTreasureImg.hidden = false
            currentTreasureImg.src = "images/treasures/" + hand2.currentCard.toString() + ".svg"
        } else {
            currentTreasureImg.hidden = true
        }
        indicator.innerText = "Blue's Turn"
        indicator.style.color = "blue"
    }
    var div1 = document.getElementById(player1Position[0].toString() + player1Position[1].toString())
    var div2 = document.getElementById(player2Position[0].toString() + player2Position[1].toString())
    if (document.getElementById("red")) {
        if (!div1.querySelector("#red")) {
            div1.appendChild(document.getElementById("red"))
        }
    } else {
        var player1 = document.createElement("img")
        player1.src = "images/red.svg"
        player1.width = 80
        player1.height = 80
        player1.id = "red"
        div1.appendChild(player1)
    }
    if (document.getElementById("blue")) {
        if (!div2.querySelector("#blue"))
            div2.appendChild(document.getElementById("blue"))
    } else {
        var player2 = document.createElement("img")
        player2.src = "images/blue.svg"
        player2.width = 80
        player2.height = 80
        player2.id = "blue"
        div2.appendChild(player2)
    }
}

function main() {
    handDealer()
    board.pathfinder(0, 0)
    draw()
}

window.onkeyup = function (e) {
    var key = e.keyCode ? e.keyCode : e.which
    if (key === 82 && turnStage === 0) {
        board.outerTile.rotate()
    }
    document.getElementById("outer-cell").getElementsByTagName("img")[0].style.transform = "rotate(" + (board.outerTile.rotation * 90).toString() + "deg)"
}

document.addEventListener('click', function (e) {
    e = e || window.event
    var target = e.target || e.srcElement
    handleClick(target)
}, false)

window.onload = main