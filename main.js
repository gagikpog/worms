import { Game } from './game.js';

/** @type { HTMLCanvasElement | null }*/
const canvas = document.querySelector('#canvas');
const ctx = canvas && canvas.getContext('2d');

if (canvas && ctx) {
    const game = new Game({canvas, ctx});
    mainLoop(game);
}

function mainLoop(game) {
    game.clear();
    game.update();
    game.draw();
    setTimeout(mainLoop, 50, game);
}