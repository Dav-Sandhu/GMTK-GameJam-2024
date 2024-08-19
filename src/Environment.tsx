import Phaser from "phaser"
import Player from './Player'
import Enemy from './Enemy'

export default class Environment extends Phaser.Scene{

    player: Player | null
    layers: Array<Phaser.Tilemaps.TilemapLayer | null>
    enemy: Enemy | null

    constructor(){
        super()
        this.player = null
        this.enemy = null
        this.layers = []
    }

    preload ()
    {
        this.load.image('tiles', '/tileset.png')
        this.load.spritesheet('player', '/player.png', { frameWidth: 16, frameHeight: 16 })
        this.load.image('arrow', '/arrow.png')
        this.load.tilemapTiledJSON('map', '/map01.json')
    }

    create ()
    {
        this.layers = []
        const map = this.add.tilemap('map')
        const tileset = map.addTilesetImage('tileset', 'tiles')

        if (tileset !== null){

            for (let i = 1; i < 7; i++) {
                const layer = map.createLayer('Tile Layer ' + i, tileset)
                if (layer) {
                    layer.setDepth((i - 1) * 10)
                    this.layers.push(layer)
                } else {
                    this.layers.push(null)
                }
            }

            const playerTile = this.layers[0]?.getTileAt(9, 37) || null
            const enemyTile = this.layers[0]?.getTileAt(9, 2) || null

            this.player = new Player(
                this.matter.world, 
                playerTile?.getCenterX() || 100, 
                playerTile?.getCenterY() || 100, 
                'player', 
                this, 
                50,
                10
            )
            this.add.existing(this.player)
            this.cameras.main.startFollow(this.player)

            this.enemy = new Enemy(
                this.matter.world, 
                enemyTile?.getCenterX() || 80, 
                enemyTile?.getCenterY() || 60, 
                'player', 
                this, 
                this.player
            )
            this.add.existing(this.enemy)

            this.layers[1]?.setCollisionFromCollisionGroup()
            this.layers[1] ? this.matter.world.convertTilemapLayer(this.layers[1]) : null

            this.layers[2]?.setCollisionFromCollisionGroup()
            this.layers[2] ? this.matter.world.convertTilemapLayer(this.layers[2]) : null

            this.enemy?.setDepth(25)
            this.player?.sprite?.setDepth(25)
        }

        //moves the camera to the map in the center of the screen
        this.cameras.main.setScroll(
            (map.widthInPixels - this.cameras.main.width) / 1.25, 
            (map.heightInPixels - this.cameras.main.height) / 1.25
        )

        //default camera zoom
        this.cameras.main.zoomTo(2, 0)
        
        //when mouse moves it will highlight the tile it is hovering over
        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            this.layers[0]?.forEachTile(t => t.tint = 0xffffff)
            const worldPoint = pointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2
            const tile = this.layers[0]?.getTileAtWorldXY(worldPoint.x, worldPoint.y + 8)
            tile ? tile.tint = 0xff0000 : null
            
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

        if (this.player){
            this.player.movPlayer(delta)

            time * 1 //in order to build you must not have any unused variables
            
            const playerX = this.player.x
            const playerY = this.player.y + 6 //the 6 offset to go from origin to location of collision shape

            const tile = this.layers[1]?.getTileAtWorldXY(playerX, playerY)
            const tileLeft = this.layers[1]?.getTileAtWorldXY(playerX + 8, playerY - 4)

            if (tile || tileLeft){
                this.player?.sprite?.setDepth(1) //player is behind a block
            }else{
                this.player?.sprite?.setDepth(25) //player is in front of a block
            }
        }
    }
}