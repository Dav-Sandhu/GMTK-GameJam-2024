import Phaser from "phaser"

export default class Environment extends Phaser.Scene{
    constructor(){
        super()
    }

    preload ()
    {
        this.load.image('tiles', '/tileset.png')
    }

    create ()
    {
        const mapData = new Phaser.Tilemaps.MapData({
            width: 10,
            height: 10,
            tileWidth: 16,
            tileHeight: 8,
            orientation: Phaser.Tilemaps.Orientation.ISOMETRIC,
            format: Phaser.Tilemaps.Formats.ARRAY_2D
        })

        const map = new Phaser.Tilemaps.Tilemap(this, mapData)

        const tileset = map.addTilesetImage('tileset', 'tiles')

        const floor = tileset ? map.createBlankLayer('floor', tileset, 400, 300) : null
        const block = tileset ? map.createBlankLayer('block', tileset, 400, 300) : null

        const data = { 
            floor: [
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0 ,0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 0 ,0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 0 ,0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 0 ,0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 0 ,0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 0 ,0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 0 ,0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 0 ,0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 0 ,0, 0, 0, 0, 0 ]
            ], 
            block: [
                [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
                [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
                [ -1, -1, 1, -1, -1, -1, -1, -1, -1, -1 ],
                [ -1, -1, -1, 3, -1, -1, -1, -1, -1, -1 ],
                [ -1, -1, -1, -1, 1, -1, -1, -1, -1, -1 ],
                [ -1, -1, -1, -1, -1, 3, -1, -1, -1, -1 ],
                [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
                [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
                [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
                [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ]
            ]
        }

        let y = 0

        data.floor.forEach(row => {
            row.forEach((tile, x) => {
                floor?.putTileAt(tile, x, y)
            })

            y++
        })

        y = 0

        data.block.forEach(row => {
            row.forEach((tile, x) => {
                tile !== -1 ? block?.putTileAt(tile, x, y) : ""
            }) 

            y++
        })
    }
}