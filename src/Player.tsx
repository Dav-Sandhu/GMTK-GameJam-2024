import * as Phaser from 'phaser'
import Environment from './Environment'

export default class Player extends Phaser.Physics.Matter.Image{
    
    scene: Environment
    speed: number
    mov_x: number
    mov_y: number

    constructor(
        world: Phaser.Physics.Matter.World, 
        x: number, y: number, 
        texture: string | Phaser.Textures.Texture, 
        scene: Environment,
        speed: number){
        
        super(world, x, y, texture)

        this.scene = scene

        this.speed = speed
        this.mov_x = 0
        this.mov_y = 0

        this.setRectangle(8, 2, { isStatic: false })
        this.setOrigin(0.5, 14/16)
        this.setFixedRotation()

        this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            const worldPoint = pointer.positionToCamera(this.scene.cameras.main) as Phaser.Math.Vector2
            const tile = this.scene.ground?.getTileAtWorldXY(worldPoint.x, worldPoint.y + 8)

            if (tile && pointer.isDown) {
                const targetX = tile.getCenterX()
                const targetY = tile.getCenterY()
                const direction = new Phaser.Math.Vector2(targetX - this.x, targetY - this.y).normalize()

                this.mov_x = direction.x
                this.mov_y = direction.y
            }
        })

        this.scene.input.on('pointerup', () => {
            this.mov_x = 0
            this.mov_y = 0
        })
    }

    movPlayer(delta: number){
        this.setVelocity(this.mov_x * this.speed * (delta / 1000), this.mov_y * this.speed * (delta / 1000))
    }
}