import Phaser from "phaser"

export default class Environment extends Phaser.Scene{
    constructor(){
        super()
    }

    preload ()
    {
        this.load.image('tiles', '/tileset.png')
        this.load.tilemapTiledJSON('map', '/map01.json')
    }

    create ()
    {
        const map = this.add.tilemap('map')
        const tileset = map.addTilesetImage('tileset', 'tiles')

        if (tileset !== null){
            map.createLayer('ground', tileset)
            map.createLayer('walls', tileset)
            map.createLayer('roofs', tileset)
        }

        //center the map
        this.cameras.main.setScroll(
            (map.widthInPixels - this.cameras.main.width) / 1.7, 
            (map.heightInPixels - this.cameras.main.height) / 2
        )

        this.cameras.main.zoomTo(2, 0)

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