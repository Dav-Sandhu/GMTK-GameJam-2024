import Phaser from "phaser"
import Environment from "./Environment"

export default function Config(ref: React.RefObject<HTMLInputElement>){
    return {
        type: Phaser.AUTO,
        parent: ref.current || "",
        pixelArt: true,
        antialias: false,
        backgroundColor: '#000000',
        width: 800,
        height: 600,
        physics: {
            default: 'matter',
            matter: {
            gravity: { y: 0, x: 0 },
            //debug: true,
            },
        },
        scene: Environment,
    }
}