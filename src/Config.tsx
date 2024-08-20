import Phaser from "phaser"
import Environment from "./Environment"

export default function Config(ref: React.RefObject<HTMLInputElement>){
    return {
        type: Phaser.AUTO,
        parent: ref.current || "",
        backgroundColor: '#02CCFE',
        roundPixels: true,
        pixelArt: true,
        antialias: false,
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