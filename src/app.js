const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());


const { getOne, randomContribution, typeList } = require('./functions')


app.get('/', (req, res) => {
  res.send({
    message: "🌈🚂🚅",
    endpoints: [
      "/challenge/randomContribution",
      "/challenge/:index",
      "/cabana/randomContribution"
    ]
  })
})

const contributing = [
  "p5Tutorial",
  "challenge",
  "cabana",
  "guest"
]

app.get('/:resourceType/randomContribution', async (req, res, next) => {
  const type = req.params.resourceType
  if (!contributing.includes(type)) next();
  let h = await randomContribution(type)
  if (typeof h == 'object') res.send(h)
  else next()
})

app.get('/:resourceType/:index', async (req, res, next) => {
  const type = req.params.resourceType
  const i = +req.params.index
  if (!Object.keys(typeList).includes(type)) next();
  if (typeof i !== 'number') next();
  const data = await getOne(type, i)
  if (typeof data !== "object") next()
  else {
    const { redirect_from, repository, video_number, links, video_id, videos, web_editor, ...challenge } = data
    let contributions;
    if (challenge.contributions) contributions = challenge.contributions
    else if (Math.floor(i) == i) contributions = []
    else contributions = (await getOne(type, Math.floor(i) + 0.1)).contributions
    res.send({
      ...challenge,
      videoIndex: video_number,
      referenceLinks: links,
      referenceVideos: videos,
      videoID: video_id,
      webEditor: web_editor,
      contributions,
      series: typeList[type]
    })
  }
})

module.exports = app