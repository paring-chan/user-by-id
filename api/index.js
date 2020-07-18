const express = require('express')

const app = express()

const fetch = require('node-fetch')
const Snowflake = require('../utils/Snowflake')

const users = { }

app.get('/', function(req, res){
  res.send({ hello: "world" })
})
app.get('/:id', async function(req, res) {
  const user = Snowflake.deconstruct(req.params.id)
  if(user.timestamp ===  1420070400000) return res.send({ error: 'Invalid Snowflake' })
  res.send(await getUser(req.params.id))
})

module.exports = {
  path: '/api',
  handler: app
}

async function getUser(id){
  return await fetch(`https://discord.com/api/users/${id}`, {
    headers: {
      Authorization: `Bot ${process.env.TOKEN}`
    }
  }).then(async r=> {
    const data = await r.json()
    if(r.status !== 200) return { code: r.status, message: data.message }
    return { code: r.status, data: { id: data.id, username: data.username, avatar: data.avatar ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}` : `https://cdn.discordapp.com/embed/avatars/${data.discriminator % 5}.png`, discriminator: data.discriminator, badges: badgesArray(data.public_flags), bot: data.bot === true }}
  })
}

function badgesArray(flags){
  const flagList = {
    DISCORD_EMPLOYEE: 1 << 0,
    DISCORD_PARTNER: 1 << 1,
    HYPESQUAD_EVENTS: 1 << 2,
    BUGHUNTER_LEVEL_1: 1 << 3,
    HOUSE_BRAVERY: 1 << 6,
    HOUSE_BRILLIANCE: 1 << 7,
    HOUSE_BALANCE: 1 << 8,
    EARLY_SUPPORTER: 1 << 9,
    TEAM_USER: 1 << 10,
    SYSTEM: 1 << 12,
    BUGHUNTER_LEVEL_2: 1 << 14,
    VERIFIED_BOT: 1 << 16,
    VERIFIED_DEVELOPER: 1 << 17
  }
  return Object.keys(flagList).filter(bit => flagList[bit] & flags);
}