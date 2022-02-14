import { World } from '../../mod.ts';
import { Game } from './src/scenes/Game.ts';

const pong = new World({
    title: "test",
    width: 1300,
    height: 800,
    resizable: true,
}, [Game]);
await pong.start();