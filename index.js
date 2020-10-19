const fs = require('fs')
const express = require('express')
const app = express();

const { getAllChallenges, getCodingChallenge } = require('./data-source')

// const contributions = JSON.parse(fs.readFileSync('contributions.json').toString())

const baseURL = "https://thecodingtrain.com/"

const port = process.env.PORT || 5090
app.listen(port, () => console.log(`Serving at http://localhost:${port}`))


app.get('/', (req, res) => {
  res.send({
    message: "🌈🚂🚅",
    endpoints: [
      "/challenge/contribution",
      "/challenge/:index"
    ]
  })
})

app.get('/challenge/contribution', async (req, res) => {
  let h = await randomContribution()
  res.send(h)
})

app.get('/challenge/:index', async (req, res) => {
  const i = +req.params.index
  const data = await getCodingChallenge(i)
  if (typeof data !== "object") res.send({ status: "error" })
  else {
    const { redirect_from, repository, video_number, links, video_id, web_editor, ...challenge } = data
    if (challenge.contributions) res.send({
      ...challenge,
      challengeIndex: video_number,
      referenceLinks: links,
      videoID: video_id,
      webEditor: web_editor
    })
    else if (Math.floor(i) == i) res.send({
      ...challenge,
      challengeIndex: video_number,
      referenceLinks: links,
      videoID: video_id,
      webEditor: web_editor,
      contributions: []
    })
    else res.send({
      ...challenge,
      challengeIndex: video_number,
      referenceLinks: links,
      videoID: video_id,
      webEditor: web_editor,
      contributions: (await getCodingChallenge(Math.floor(i) + 0.1)).contributions
    })
  }
})

const randomContribution = async () => {
  const data = await getAllChallenges();
  let challengeIndex = Object.keys(data)[Math.floor(Math.random() * Object.keys(data).length)]
  const challenge = await getCodingChallenge(challengeIndex)
  if (typeof challenge !== "object") return { status: "error" }
  else {
    if (challenge.contributions) return {
      ...randomArr(challenge.contributions),
      challenge: { name: challenge.title, index: challenge.video_number, url: baseURL + challenge.webURL }
    }
    else if (Math.floor(challengeIndex) == challengeIndex) return await randomContribution()
    else return {
      ...randomArr((await getCodingChallenge(Math.floor(challengeIndex) + 0.1)).contributions),
      challenge: { name: challenge.title, index: challenge.video_number, url: baseURL + challenge.webURL }
    }
  }
}
const randomArr = items => items[Math.floor(Math.random() * items.length)];
