import * as Phaser from 'phaser'
import Environment from './Environment'

export default class Player extends Phaser.Physics.Matter.Image{
    speed: number
    mov_x: number
    mov_y: number

    constructor(
        world: Phaser.Physics.Matter.World, 
        x: number, y: number, 
        texture: string | Phaser.Textures.Texture, 
        speed: number){
        
        super(world, x, y, texture)

        this.speed = speed
        this.mov_x = 0
        this.mov_y = 0
    }

    movPlayer(delta: number){
        this.setVelocity(this.mov_x * this.speed * (delta / 1000), this.mov_y * this.speed * (delta / 1000))
    }

    getInput(scene: Environment){
        scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            const worldPoint = pointer.positionToCamera(scene.cameras.main) as Phaser.Math.Vector2
            const tile = scene.ground?.getTileAtWorldXY(worldPoint.x, worldPoint.y + 8)

            if (tile && pointer.isDown) {
                const targetX = tile.getCenterX()
                const targetY = tile.getCenterY()
                const direction = new Phaser.Math.Vector2(targetX - this.x, targetY - this.y).normalize()

                this.mov_x = direction.x
                this.mov_y = direction.y
            }
        })

        scene.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
            this.mov_x = 0
            this.mov_y = 0
        })
    }
}