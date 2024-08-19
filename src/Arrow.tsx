import * as Phaser from 'phaser'
import Environment from './Environment'
import Player from './Player'

export default class Arrow extends Phaser.Physics.Matter.Image{
    scene: Environment

    constructor(
        world: Phaser.Physics.Matter.World, 
        x: number, y: number, 
        texture: string | Phaser.Textures.Texture, 
        scene: Environment) {

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
            for (const pair of event.pairs) {
                if (pair.bodyA == this.body || pair.bodyB == this.body){
                    const otherBody = pair.bodyA == this.body ? pair.bodyB : pair.bodyA

                    if (otherBody.gameObject instanceof Player) {
                        const player = otherBody.gameObject as Player
                        player.health -= 1
                    }

                    this.destroy()
                    break
                }
            }
        })
    }
}
