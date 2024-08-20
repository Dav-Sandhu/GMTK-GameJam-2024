import * as Phaser from 'phaser'
import Arrow from './Arrow'
import Player from './Player'
import Environment from './Environment'

export default class Enemy extends Phaser.Physics.Matter.Image {
    player: Player
    scene: Environment
    world: Phaser.Physics.Matter.World

    constructor(
        world: Phaser.Physics.Matter.World, 
        x: number, y: number, 
        texture: string | Phaser.Textures.Texture, 
        scene: Environment, player: Player) {

        super(world, x, y, texture)

        this.player = player
        this.scene = scene
        this.world = world
        this.setFixedRotation()
        this.setFrame(0)

        this.scene.time.addEvent({
            delay: 5000, 
            callback: this.shoot,
            callbackScope: this,
            loop: true
        })
    }

    shoot() {
        const dir = new Phaser.Math.Vector2(
            this.player.x - this.x,
            this.player.y - this.y,
        ).normalize()

        const arrowX = this.x + dir.x * 20
        const arrowY = this.y + dir.y * 20

        const arrow = new Arrow(this.world, arrowX, arrowY, 'arrow', this.scene)
        this.scene.add.existing(arrow)
        arrow.setDepth(40)

        const angle = Phaser.Math.Angle.Between(this.x, this.y, this.player.x, this.player.y) + Phaser.Math.DegToRad(180)
        arrow.setRotation(angle)

        const forceMagnitude = 0.0001
        const force = dir.clone().scale(forceMagnitude)
        arrow.applyForce(force)
    }
}
