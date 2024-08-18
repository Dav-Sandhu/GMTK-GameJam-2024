import * as Phaser from 'phaser'
import Environment from './Environment'

export default class Arrow extends Phaser.Physics.Matter.Image{
    scene: Environment

    constructor(
        world: Phaser.Physics.Matter.World, 
        x: number, y: number, 
        texture: string | Phaser.Textures.Texture, 
        scene: Environment){

        super(world, x, y, texture)

        this.scene = scene

        this.scene.time.addEvent({
            delay: 5000, 
            callback: this.destroy,
            callbackScope: this,
            loop: true
        })

        this.setFixedRotation()

        this.scene.matter.world.on('collisionstart', (event: Phaser.Physics.Matter.Events.CollisionStartEvent) => {
            const pairs = event.pairs

            for (let i = 0; i < pairs.length; i++) {
                const pair = pairs[i]
    
                if (pair.bodyA === this.body || pair.bodyB === this.body){
                    this.destroy()
                    break
                }
            }
        })
    }
}