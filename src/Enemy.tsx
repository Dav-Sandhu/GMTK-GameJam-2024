import * as Phaser from 'phaser'
import Arrow from './Arrow'
import Player from './Player'
import Environment from './Environment'

export default class Enemy extends Phaser.Physics.Matter.Image{

    player: Player | null
    scene: Environment
    world: Phaser.Physics.Matter.World

    constructor(
        world: Phaser.Physics.Matter.World, 
        x: number, y: number, 
        texture: string | Phaser.Textures.Texture, 
        scene: Environment, player: Player){

        super(world, x, y, texture)

        this.scene = scene
        this.world = world
        this.setFixedRotation()
        this.setFrame(0)

        this.player = player

        this.scene.time.addEvent({
            delay: 5000, 
            callback: this.shoot,
            callbackScope: this,
            loop: true
        })
    }

    shoot() {
        if (this.player !== null) {
            const dirX = this.player.x - this.x
            const dirY = this.player.y - this.y
    
            const magnitude = Math.sqrt(dirX * dirX + dirY * dirY)
            const normalizedDirX = dirX / magnitude
            const normalizedDirY = dirY / magnitude
    
            const arrowX = this.x + normalizedDirX * 20
            const arrowY = this.y + normalizedDirY * 20 
    
            const arrow = new Arrow(this.world, arrowX, arrowY, 'arrow', this.scene)
            this.scene.add.existing(arrow)
            arrow?.setDepth(40)
    
            const angle = Phaser.Math.Angle.Between(this.x, this.y, this.player.x, this.player.y) + Phaser.Math.DegToRad(180)
            arrow.setRotation(angle)
    
            const forceMagnitude = 0.0001
            const force = new Phaser.Math.Vector2(normalizedDirX * forceMagnitude, normalizedDirY * forceMagnitude)
            arrow.applyForce(force)
        }
    }

}