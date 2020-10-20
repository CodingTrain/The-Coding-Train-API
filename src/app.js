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


const { getOne, randomContribution, dyna, getAllData, getAll } = require('./functions')

const contributing = [
  "p5Tutorial",
  "challenge",
  "cabana",
  "guest"
]

app.get('/', (req, res) => {
  let reqURL = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  res.send({
    message: "Hello! And Welcome to the Coding Train!",
    mainEndpoint: reqURL + ":videoSeriesName{/:videoIndex}",
    videoSeries: {
      "Coding Challenges": reqURL + "challenge",
      "Coding in the Cabana": reqURL + "cabana",
      "Code! Programming with p5.js": reqURL + "p5Tutorial",
      "Git and Github for Poets": reqURL + "gitTutorial",
      "Working with Data and APIs in JavaScript": reqURL + "dataapis",
      "Teachable Machine": reqURL + "teachableMachine",
      "Guest Tutorials": reqURL + "guest"
    }
  })
})

app.get('/:videoSeries', async (req, res, next) => {
  const type = req.params.videoSeries
  if (!Object.keys(dyna).includes(type)) next();
  let reqURL = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  let videos = Object.values(await getAll(type))
  res.send({
    title: dyna[type].title,
    description: dyna[type].description,
    videos: videos.map(elt => ({
      name: titleCase(elt.name.split('-').join(' ')),
      videoIndex: elt.videoIndex,
      apiUrl: reqURL + '/' + elt.videoIndex
    }))
  })
})


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
  if (!Object.keys(dyna).includes(type)) next();
  if (typeof i !== 'number') next();
  const data = await getOne(type, i)
  if (typeof data !== "object") next()
  else {
    const { redirect_from, repository, video_number, links, video_id, can_contribute, videos, web_editor, ...challenge } = data
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
      series: dyna[type].title
    })
  }
})

function titleCase(str) {
  var splitStr = str.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(' ');
}

module.exports = app