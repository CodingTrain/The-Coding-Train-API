const fs = require('fs')
const express = require('express')
const app = express();

const { getAllChallenges, getCodingChallenge } = require('./data-source')

const contributions = JSON.parse(fs.readFileSync('contributions.json').toString())

const port = process.env.PORT || 5090
app.listen(port, () => console.log(`Serving at http://localhost:${port}`))


app.get('/', (req, res) => {
  res.send({
    message: "🌈🚂🚅",
    endpoints: [
      "/cc/random/:count?",
      "/cc/:index"
    ]
  })
})

app.get('/cc/random/:count?', (req, res) => {
  const cons = []
  let count = req.params.count || 1
  for (let i = 0; i < count; i++) {
    cons.push(randomContribution())
  }
  res.send(count == 1 ? cons[0] : cons)
})

app.get('/cc/:index', async (req, res) => {
  const i = +req.params.index
  const data = await getCodingChallenge(i)
  if (typeof data !== "object") res.send({ status: "error" })
  else {
    if (data.contributions) res.send(data.contributions)
    else if (Math.floor(i) == i) res.send([])
    else res.send((await getCodingChallenge(Math.floor(i) + 0.1)).contributions)
  }
})

const randomContribution = () => {
  return contributions[Math.floor(Math.random() * contributions.length)]
}
