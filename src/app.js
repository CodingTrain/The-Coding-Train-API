const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

require('dotenv').config();

const middlewares = require('./middlewares');
const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());


const { getOne, randomContribution } = require('./functions')

const typeList = {
  challenge: "Coding Challenge",
  cabana: "Coding in the Cabana"
}

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
      challengeIndex: video_number,
      referenceLinks: links,
      referenceVideos: videos,
      videoID: video_id,
      webEditor: web_editor,
      contributions,
      type: typeList[type]
    })
  }
})

app.get('/:resourceType/randomContribution', async (req, res, next) => {
  const type = req.params.resourceType
  if (!Object.keys(typeList).includes(type)) next();
  res.send(await randomContribution(type))
})

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app