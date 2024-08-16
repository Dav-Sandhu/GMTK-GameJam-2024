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
            width: 3,
            height: 3,
            tileWidth: 16,
            tileHeight: 8,
            orientation: Phaser.Tilemaps.Orientation.ISOMETRIC,
            format: Phaser.Tilemaps.Formats.ARRAY_2D
        })

        const map = new Phaser.Tilemaps.Tilemap(this, mapData)

        const tileset = map.addTilesetImage('tileset', 'tiles')

        const layer = tileset ? map.createBlankLayer('layer', tileset, 350, 200) : null

        const data = [
            [ 0, 0, 0],
            [ 0, 0, 0 ],
            [ 0, 0, 0 ],
        ]

        let y = 0

        data.forEach(row => {

            row.forEach((tile, x) => {

                layer?.putTileAt(tile, x, y)

            })

            y++

        })
    }
}