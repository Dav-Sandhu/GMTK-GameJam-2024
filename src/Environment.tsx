import Phaser from "phaser"
import Player from './Player'
import Enemy from './Enemy'

export default class Environment extends Phaser.Scene{

    player: Player | null
    ground: Phaser.Tilemaps.TilemapLayer | null
    walls: Phaser.Tilemaps.TilemapLayer | null
    stack: Phaser.Tilemaps.TilemapLayer | null
    roofs: Phaser.Tilemaps.TilemapLayer | null
    enemy: Enemy | null

    constructor(){
        super()
        this.player = null
        this.ground = null
        this.stack = null
        this.walls = null
        this.roofs = null
        this.enemy = null
    }

    preload ()
    {
        this.load.image('tiles', '/tileset.png')
        this.load.image('player', '/player.png')
        this.load.image('arrow', '/arrow.png')
        this.load.tilemapTiledJSON('map', '/map01.json')
    }

    create ()
    {
        const map = this.add.tilemap('map')
        const tileset = map.addTilesetImage('tileset', 'tiles')

        if (tileset !== null){
            this.ground = map.createLayer('ground', tileset)
            const boundary = map.createLayer('boundary', tileset)
            this.walls = map.createLayer('walls', tileset)

            this.roofs = map.createLayer('roofs', tileset)
            this.stack = map.createLayer('stack', tileset)

            const playerTile = this.ground?.getTileAt(9, 37)
            const enemyTile = this.stack?.getTileAt(13, 1)

            this.player = new Player(
                this.matter.world, 
                playerTile?.getCenterX() || 100, 
                playerTile?.getCenterY() || 100, 
                'player', 
                this, 
                50
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

            boundary?.setCollisionFromCollisionGroup()
            this.walls?.setCollisionFromCollisionGroup()
            this.ground?.setCollisionFromCollisionGroup()

            boundary ? this.matter.world.convertTilemapLayer(boundary) : null
            this.walls ? this.matter.world.convertTilemapLayer(this.walls) : null
            this.ground ? this.matter.world.convertTilemapLayer(this.ground) : null
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
            this.ground?.forEachTile(t => t.tint = 0xffffff)
            const worldPoint = pointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2
            const tile = this.ground?.getTileAtWorldXY(worldPoint.x, worldPoint.y + 8)
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
        if (this.player !== null){
            this.player.movPlayer(delta)

            time * 1 //in order to build you must not have any unused variables

            const layers = [this.stack, this.walls, this.roofs]

            layers.forEach(layer => {
                layer?.forEachTile(tile => {
                    const tileWorldX = tile.getCenterX()
                    const tileWorldY = tile.getCenterY()
                    const playerBounds = this.player?.getBounds()
                    playerBounds ? playerBounds.y += 14 : null
                    playerBounds ? playerBounds.height = 2 : null

                    if (
                        playerBounds && 
                        Phaser.Geom.Intersects.RectangleToRectangle(
                            playerBounds, 
                            new Phaser.Geom.Rectangle(
                                tileWorldX, tileWorldY, tile.width, tile.height
                            )
                        )
                    ){
                        tile.setAlpha(0.5)
                    } else {
                        tile.setAlpha(1)
                    }
                })
            })
        }
    }
}