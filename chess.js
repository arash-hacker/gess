#!/usr/bin/env node

const { Chess } =require( "chess.js");
const fs =require( 'fs');
const ejs =require( 'ejs');
const fetch =require( 'node-fetch');

(async () => {
    let pgn = await (await fetch('https://api.chess.com/pub/player/arash/games/2021/09')).json();
    // console.log('>>>',pgn)
    let pgnList = pgn.games[pgn.games.length - 2].pgn.split('\n');
    pgnList[22] = pgnList[22]
        .replace(/\{\[\%clk \d+:\d+:\d+(\.\d)?\]\}/g, '')
        .replace(/\d+\.\.\./g, '')
        .replace(/\s+/g, ' ');
    let animation = {}
    for (const [key, defaulted] of Object.entries({ size: 40, delay: 0.5, duration: 1 })) {
        if (Number.isNaN(Number(animation[key])))
            animation[key] = defaulted
        if (animation[key] < 0)
            animation[key] = defaulted
    }

    const board = new Chess()
    board.loadPgn(pgnList.join('\n'))
    const moves = board.history({ verbose: true })
    const meta = board.header()
    console.log(">>", meta)
    const result = Object.fromEntries(meta.Result.split("-").map((score, i) => [i ? "black" : "white", Number(score) || 0]))

   let svg = await ejs.renderFile('./chess.ejs', { meta, moves, animation, result, theme:{b:"green", w:"red"}})
    fs.writeFileSync('chess.svg', svg)
})()


