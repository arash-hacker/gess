#!/usr/bin/env node
const axios = require('axios');
const ejs = require('ejs');
const fs = require('fs');
(async () => {
    let stats = (await axios('https://api.chess.com/pub/player/arash/stats')).data
    let profile = (await axios('https://api.chess.com/pub/player/arash')).data
    console.log(profile, stats)
    fs.writeFileSync('profile.svg',
        await ejs.renderFile('./profile.ejs', { stats, profile }))
})()
