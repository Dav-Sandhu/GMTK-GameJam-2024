import Phaser from "phaser"
import Player from './Player'

export default class Environment extends Phaser.Scene{

    player: Player | null
    ground: Phaser.Tilemaps.TilemapLayer | null

    constructor(){
        super()
        this.player = null
        this.ground = null
    }

    preload ()
    {
        this.load.image('tiles', '/tileset.png')
        this.load.image('player', '/player.png')
        this.load.tilemapTiledJSON('map', '/map01.json')
    }

    create ()
    {
        const map = this.add.tilemap('map')
        const tileset = map.addTilesetImage('tileset', 'tiles')

        if (tileset !== null){
            this.ground = map.createLayer('ground', tileset)

            this.player = new Player(this.matter.world, 0, 0, 'player', 50)
            this.add.existing(this.player)
            this.player.getInput(this)

            map.createLayer('walls', tileset)
            map.createLayer('roofs', tileset)
        }

        //moves the camera to the map in the center of the screen
        this.cameras.main.setScroll(
            (map.widthInPixels - this.cameras.main.width) / 1.7, 
            (map.heightInPixels - this.cameras.main.height) / 2
        )

        //default camera zoom
        this.cameras.main.zoomTo(2, 0)
        
        //when mouse moves it will highlight the tile it is hovering over, and it will pan if left click hold + move around
        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            
            this.ground?.forEachTile(t => t.tint = 0xffffff)
            const worldPoint = pointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2
            const tile = this.ground?.getTileAtWorldXY(worldPoint.x, worldPoint.y + 8)
            
            if (pointer.isDown && !tile) {
                const panSpeed = 0.15
                this.cameras.main.scrollX -= (pointer.x - pointer.prevPosition.x) * panSpeed
                this.cameras.main.scrollY -= (pointer.y - pointer.prevPosition.y) * panSpeed
            }else {
                const worldPoint = pointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2
                const tile = this.ground?.getTileAtWorldXY(worldPoint.x, worldPoint.y + 8)
                tile ? tile.tint = 0xff0000 : null
            }
        })

        //scroll wheel will zoom in and out 
        this.input.on('wheel', ({ deltaY }: { deltaY: number }) => {
            if (deltaY > 0) {
                this.cameras.main.zoom -= 0.25
            } else {
                this.cameras.main.zoom += 0.25
            }

            this.cameras.main.zoom = Phaser.Math.Clamp(this.cameras.main.zoom, 1, 5)
        })
    }

    update(time: number, delta: number){
        if (this.player !== null){
            this.player.movPlayer(delta)
        }
    }
}