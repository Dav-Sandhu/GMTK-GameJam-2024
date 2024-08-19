import * as Phaser from 'phaser'
import Environment from './Environment'

export default class Player extends Phaser.Physics.Matter.Image {
    scene: Environment
    speed: number
    mov: Phaser.Math.Vector2
    health: number
    maxHealth: number
    sprite: Phaser.GameObjects.Sprite
    healthBar: Phaser.GameObjects.Graphics

    constructor(
        world: Phaser.Physics.Matter.World, 
        x: number, y: number, 
        texture: string | Phaser.Textures.Texture, 
        scene: Environment,
        speed: number, health: number
    ) {
        super(world, x, y, texture)

        this.scene = scene
        this.speed = speed
        this.health = health
        this.maxHealth = health
        this.mov = new Phaser.Math.Vector2(0, 0)

        this.setRectangle(8, 2, { isStatic: false })
        this.setOrigin(0.5, 14/16)
        this.setFixedRotation()
        this.setFrame(0)
        this.setVisible(false)

        // Create the sprite for animations
        this.sprite = this.scene.add.sprite(x, y, texture)
        this.sprite.setOrigin(0.5, 14/16)

        this.healthBar = this.scene.add.graphics()
        this.healthBar.setDepth(100)
        this.updateHealthBar()

        this.scene.matter.world.on('collisionstart', (event: Phaser.Physics.Matter.Events.CollisionStartEvent) => {
            for (const pair of event.pairs) {
                if (pair.bodyA == this.body || pair.bodyB == this.body) {
                    const otherBody = pair.bodyA == this.body ? pair.bodyB : pair.bodyA

                    const otherY = otherBody.gameObject?.body.position.y ?? -1
                    const otherX = otherBody.gameObject?.body.position.x ?? -1

                    if (this.y < otherY || (this.y == otherY && this.x >= otherX)) {
                        this.sprite.setDepth(1) // Player is behind the object
                    } else {
                        this.sprite.setDepth(40) // Player is in front of the object
                    }

                    break
                }
            }
        })

        if (!this.scene.anims.exists('walk-right') ||
            !this.scene.anims.exists('walk-left') ||
            !this.scene.anims.exists('walk-up') ||
            !this.scene.anims.exists('walk-down')) {

            this.scene.anims.create({
                key: 'walk-right',
                frames: this.scene.anims.generateFrameNumbers('player', { frames: [1, 2, 3, 4, 5, 6] }),
                frameRate: 8,
                repeat: -1
            })

            this.scene.anims.create({
                key: 'walk-left',
                frames: this.scene.anims.generateFrameNumbers('player', { frames: [33, 34, 35, 36, 37, 38] }),
                frameRate: 8,
                repeat: -1
            })

            this.scene.anims.create({
                key: 'walk-up',
                frames: this.scene.anims.generateFrameNumbers('player', { frames: [65, 66, 67, 68, 69, 70] }),
                frameRate: 8,
                repeat: -1
            })

            this.scene.anims.create({
                key: 'walk-down',
                frames: this.scene.anims.generateFrameNumbers('player', { frames: [97, 98, 99, 100, 101, 102] }),
                frameRate: 8,
                repeat: -1
            })
        }

        this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            const worldPoint = pointer.positionToCamera(this.scene.cameras.main) as Phaser.Math.Vector2
            const layer = this.scene.layers[0]
        
            if (layer) {
                const tile = layer.getTileAtWorldXY(worldPoint.x, worldPoint.y + 8)

                if (tile && pointer.isDown) {
                    const targetX = tile.getCenterX()
                    const targetY = tile.getCenterY()
                    this.mov = new Phaser.Math.Vector2(targetX - this.x, targetY - this.y).normalize()
                }
            }
        })

        this.scene.input.on('pointerup', () => {
            this.mov.reset()
        })
    }

    updateHealthBar() {
        this.healthBar.clear()

        //red bar showing lost health
        this.healthBar.fillStyle(0xff0000)
        this.healthBar.fillRect(this.x - 8, this.y - 20, 16, 2)

        //green health bar
        this.healthBar.fillStyle(0x00ff00)
        this.healthBar.fillRect(this.x - 8, this.y - 20, 16 * (this.health / this.maxHealth), 2)

        if (this.health <= 0) {
            this.scene.scene.restart()
        }
    }

    movPlayer(delta: number) {
        const {x, y} = this.mov.clone().scale(this.speed * (delta / 1000))
        this.setVelocity(x, y)

        this.sprite.setDepth(this.getDepth())

        // Sync the sprite position with the Matter image
        this.sprite.setPosition(this.x, this.y)
        this.updateHealthBar()

        if (this.mov.lengthSq() != 0) {
            this.sprite.anims.play(this.mov.x > 0 ? 'walk-right' : 'walk-left', true)
        } else {
            this.sprite.setFrame(0)
        }
    }

    getTilesWithinBounds(layer: Phaser.Tilemaps.TilemapLayer | null): Array<Phaser.Tilemaps.Tile> {
        const spriteWidth = this.width
        const spriteHeight = this.height

        const leftX = this.x - (this.width * 0.5)
        const topY = this.y + (this.height * (14/16))

        return layer?.getTilesWithinWorldXY(leftX, topY, spriteWidth, spriteHeight) ?? []
    }

    getCurrentTile(layer: Phaser.Tilemaps.TilemapLayer | null): Phaser.Tilemaps.Tile | undefined {
        const bottomX = this.x + (this.width * 0.5)
        const bottomY = this.y - (this.height * (14/16))

        return layer?.getTileAtWorldXY(bottomX, bottomY)
    }

    getDepth(): number {
        const currentTile = this.getCurrentTile(this.scene.layers[0])

        if (!currentTile) {
            return 25
        }

        const tilesLayer1 = this.getTilesWithinBounds(this.scene.layers[1])
        const tilesLayer2 = this.getTilesWithinBounds(this.scene.layers[2])

        return [...tilesLayer1, ...tilesLayer2].some((tile) =>
            tile.index != -1 && (tile.y < currentTile.y || (tile.x > currentTile.x && tile.y == currentTile.y))
        ) ? 1 : 25
    }
}
