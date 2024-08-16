import Phaser from "phaser"

export default class Environment extends Phaser.Scene{
    constructor(){
        super()
    }

    preload ()
    {
        this.load.image('tiles', '/iso-64x64-outside.png')
    }

    create ()
    {
        const mapData = new Phaser.Tilemaps.MapData({
            width: 3,
            height: 3,
            tileWidth: 64,
            tileHeight: 32,
            orientation: Phaser.Tilemaps.Orientation.ISOMETRIC,
            format: Phaser.Tilemaps.Formats.ARRAY_2D
        })

        const map = new Phaser.Tilemaps.Tilemap(this, mapData)

        const tileset = map.addTilesetImage('iso-64x64-outside', 'tiles')

        const layer = tileset ? map.createBlankLayer('layer', tileset, 350, 200) : null

        const data = [
            [ 179, 178,  174],
            [ 175, 174, 175 ],
            [ 174, 175, 174 ],
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