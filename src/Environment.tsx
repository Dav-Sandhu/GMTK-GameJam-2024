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
                [8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
                [8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
                [8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
                [8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
                [8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
                [8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
                [8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
                [8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
                [8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
                [8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
            ], 
            block: [
                [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
                [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
                [ -1, -1, 1, 1, 1, -1, -1, -1, -1, -1 ],
                [ -1, -1, -1, 9, 9, 9, -1, -1, -1, -1 ],
                [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
                [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
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
                tile !== -1 ? block?.putTileAt(tile, x, y) : null
            }) 

            y++
        })

        this.cameras.main.zoomTo(5, 0)

        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (pointer.isDown) {
                const panSpeed = 0.15
                this.cameras.main.scrollX -= (pointer.x - pointer.prevPosition.x) * panSpeed;
                this.cameras.main.scrollY -= (pointer.y - pointer.prevPosition.y) * panSpeed;
            }
        })

        this.input.on('wheel', ({ deltaY }: { deltaY: number }) => {
            if (deltaY > 0) {
                this.cameras.main.zoom -= 0.25
            } else {
                this.cameras.main.zoom += 0.25
            }

            this.cameras.main.zoom = Phaser.Math.Clamp(this.cameras.main.zoom, 1, 5)
        })
    }
}