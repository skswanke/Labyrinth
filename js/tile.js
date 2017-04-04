class Tile {
    constructor(numPaths, rotation, corner, treasure, locked) {
        this.numPaths = numPaths
        this.rotation = rotation
        this.corner = corner
        this.treasure = treasure
        this.locked = locked
    }
    rotate() {
        this.rotation = (this.rotation + 1) % 4
    }
}