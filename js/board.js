class Board {
    constructor() {
        this.board = []
        this.visited = []
        this.playerCanMove = []
        this.outerTile
        this.arrangeBoard()
    }

    parsePaths(tile) {
        if (tile.numPaths === 2) {
            if (tile.rotation % 2 === 0) {
                return [true, false, true, false]
            } else {
                return [false, true, false, true]
            }
        } else if (tile.numPaths === 3) {
            if (tile.rotation === 0) {
                return [true, true, true, false]
            } else if (tile.rotation === 1) {
                return [false, true, true, true]
            } else if (tile.rotation === 2) {
                return [true, false, true, true]
            } else {
                return [true, true, false, true]
            }
        } else {
            if (tile.rotation === 0) {
                return [false, true, true, false]
            } else if (tile.rotation === 1) {
                return [false, false, true, true]
            } else if (tile.rotation === 2) {
                return [true, false, false, true]
            } else {
                return [true, true, false, false]
            }
        }
    }

    canMove(startX, startY, endX, endY) {
        if (endX < 0 || endX > 6 || endY < 0 || endY > 6)
            return false

        var startTile = this.board[startX][startY]
        var finishTile = this.board[endX][endY]

        var startPaths = this.parsePaths(startTile)
        var finishPaths = this.parsePaths(finishTile)

        if (startX === endX && startY < endY) {
            if (startPaths[1] === true && finishPaths[3] === true) {
                return true
            }
        } else if (startX === endX && startY > endY) {
            if (startPaths[3] === true && finishPaths[1] === true) {
                return true
            }
        } else if (startY === endY && startX < endX) {
            if (startPaths[2] === true && finishPaths[0] === true) {
                return true
            }
        } else if (startY === endY && startX > endX) {
            if (startPaths[0] === true && finishPaths[2] === true) {
                return true
            }
        }
        return false
    }

    isVisited(arr) {
        return this.visited.some(function (i) {
            return JSON.stringify(i) === JSON.stringify(arr)
        })
    }

    isPlayerCanMove(arr) {
        return this.playerCanMove.some(function (i) {
            return JSON.stringify(i) === JSON.stringify(arr)
        })
    }

    pathfinder(startX, startY) {
        this.visited.push([startX, startY])
        this.playerCanMove.push([startX, startY])
        if (!this.isVisited([startX - 1, startY]) && this.canMove(startX, startY, startX - 1, startY)) {
            this.playerCanMove.push([startX - 1, startY])
            this.pathfinder(startX - 1, startY)
        }
        if (!this.isVisited([startX + 1, startY]) && this.canMove(startX, startY, startX + 1, startY)) {
            this.playerCanMove.push([startX + 1, startY])
            this.pathfinder(startX + 1, startY)
        }
        if (!this.isVisited([startX, startY - 1]) && this.canMove(startX, startY, startX, startY - 1)) {
            this.playerCanMove.push([startX, startY - 1])
            this.pathfinder(startX, startY - 1)
        }
        if (!this.isVisited([startX, startY + 1]) && this.canMove(startX, startY, startX, startY + 1)) {
            this.playerCanMove.push([startX, startY + 1])
            this.pathfinder(startX, startY + 1)
        }
    }

    shiftboard(x, y) {
        var edgeTile;
        if (x === 0) {
            edgeTile = this.board[6][y]
            for (var i = 6; i > 0; i--) {
                this.board[i][y] = this.board[i - 1][y]
            }
            this.board[0][y] = this.outerTile
            this.outerTile = edgeTile
        } else if (x === 6) {
            edgeTile = this.board[0][y]
            for (var i = 1; i < 7; i++) {
                this.board[i - 1][y] = this.board[i][y]
            }
            this.board[6][y] = this.outerTile
            this.outerTile = edgeTile
        } else if (y === 0) {
            edgeTile = this.board[x][6]
            for (var i = 6; i > 0; i--) {
                this.board[x][i] = this.board[x][i - 1]
            }
            this.board[x][0] = this.outerTile
            this.outerTile = edgeTile
        } else if (y === 6) {
            edgeTile = this.board[x][0]
            for (var i = 1; i < 7; i++) {
                this.board[x][i - 1] = this.board[x][i]
            }
            this.board[x][6] = this.outerTile
            this.outerTile = edgeTile
        }
    }

    randDirection() {
        return Math.floor(Math.random() * (3 - 0 + 1) + 0)
    }

    findNextTile(twos, threes, fours) {
        var nextTile = 0;
        if (twos && threes && fours)
            nextTile = Math.floor(Math.random() * (4 - 2 + 1) + 2)
        else if (twos && threes)
            nextTile = Math.round(Math.random()) + 1
        else if (threes && fours)
            nextTile = Math.floor(Math.random() * (4 - 3 + 1) + 3)
        else if (twos && fours)
            nextTile = Math.round(Math.random()) * 2 + 2
        else if (twos)
            nextTile = 2
        else if (threes)
            nextTile = 3
        else
            nextTile = 4

        return nextTile
    }

    arrangeBoard() {
        var twosCount = 0
        var twosMax = 12
        var threesCount = 0
        var threesMax = 6
        var foursCount = 0
        var foursMax = 16
        var lockedCount = 0
        var lockedOrder = [
            [4, 0],
            [3, 1],
            [3, 1],
            [4, 1],
            [3, 0],
            [3, 0],
            [3, 1],
            [3, 2],
            [3, 0],
            [3, 3],
            [3, 2],
            [3, 2],
            [4, 3],
            [3, 3],
            [3, 3],
            [4, 2]
        ]
        var treasuresCount = 1
        var randTreasures = 0
        var randTreasureMax = 6
        var cornerCount = 0;
        for (var i = 0; i < 7; i++) {
            for (var j = 0; j < 7; j++) {
                var newTile
                if (i % 2 === 0 && j % 2 === 0) {
                    if ((i === 0 || i === 6) && (j === 0 || j === 6)) {
                        newTile = new Tile(lockedOrder[lockedCount][0], lockedOrder[lockedCount][1], cornerCount, null, true)
                        cornerCount++
                    } else {
                        newTile = new Tile(lockedOrder[lockedCount][0], lockedOrder[lockedCount][1], null, treasuresCount, true)
                        treasuresCount++
                    }
                    lockedCount++
                } else {
                    var nextTile = this.findNextTile(twosCount < twosMax, threesCount < threesMax, foursCount < foursMax)

                    if (nextTile === 2 && twosCount < twosMax) {
                        newTile = new Tile(2, this.randDirection(), null, null, false)
                        twosCount++
                    } else if (nextTile === 3 && threesCount < threesMax) {
                        newTile = new Tile(3, this.randDirection(), null, treasuresCount, false)
                        treasuresCount++
                        threesCount++
                    } else if (nextTile === 4 && foursCount < foursMax) {
                        if (randTreasures < randTreasureMax && foursCount % 2 == 0) {
                            newTile = new Tile(4, this.randDirection(), null, treasuresCount, false)
                            randTreasures++
                            treasuresCount++
                        } else {
                            newTile = new Tile(4, this.randDirection(), null, null, false)
                        }
                        foursCount++
                    }
                }

                if (!this.board[i]) this.board[i] = []
                this.board[i][j] = newTile
            }
        }
        var outerTile
        if (twosCount < twosMax) {
            outerTile = new Tile(2, this.randDirection(), null, null, false)
        }
        if (threesCount < threesMax) {
            outerTile = new Tile(3, this.randDirection(), null, treasuresCount, false)
        }
        if (foursCount < foursMax) {
            if (randTreasures < randTreasureMax) {
                outerTile = new Tile(4, this.randDirection(), null, treasuresCount, false)
            } else {
                outerTile = new Tile(4, this.randDirection(), null, null, false)
            }
        }
        this.outerTile = outerTile
    }
}