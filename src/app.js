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


const { getOne, randomContribution, dyna, getAllData, getAll, randomArr } = require('./functions')

const contributing = [
  "p5Tutorial",
  "challenge",
  "cabana",
  "ml5",
  "noc"
]

app.get('/', (req, res) => {
  let reqURL = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  res.send({
    message: "Hello! And Welcome to the Coding Train!",
    videoSeries: Object.fromEntries(Object.keys(dyna).map(elt =>
      [dyna[elt].title, reqURL + elt]
    ))
  })
})

app.get("/secret", (req, res) => {
  res.send("You Found the Secret Route! 🚂🚂")
})

app.get('/:videoSeries', async (req, res, next) => {
  const type = req.params.videoSeries
  if (!Object.keys(dyna).includes(type)) next();
  let reqURL = `${req.protocol}://${req.get('host')}${req.url.endsWith('/') ? req.url : req.url + '/'}`;
  let videos = Object.values(await getAll(type))
  res.send({
    title: dyna[type].title,
    description: dyna[type].description,
    playlistID: dyna[type].ytid,
    videos: videos.map(elt => ({
      name: titleCase(elt.name.split('-').join(' ')),
      videoIndex: elt.videoIndex,
      apiUrl: reqURL + elt.videoIndex
    })).sort((a, b) => a.videoIndex - b.videoIndex),
    randomURL: reqURL + 'random',
    randomCommunityContributionURL: reqURL + "randomContribution",
  })
})


app.get('/:resourceType/randomContribution', async (req, res, next) => {
  const type = req.params.resourceType
  let baseURL = `${req.protocol}://${req.get('host')}`;
  if (!contributing.includes(type)) next();
  let h = await randomContribution(type, baseURL)
  if (typeof h == 'object') res.send(h)
  else next()
})

app.get('/:resourceType/random', async (req, res, next) => {
  const type = req.params.resourceType
  let baseURL = `${req.protocol}://${req.get('host')}`;
  const data = await getAll(type);
  let challengeIndex = randomArr(Object.keys(data))
  const challenge = await getOne(type, challengeIndex)
  if (typeof challenge == 'object') res.send(challenge)
  else next()
})

app.get('/:resourceType/:index', async (req, res, next) => {
  const type = req.params.resourceType
  const i = +req.params.index
  if (!Object.keys(dyna).includes(type)) next();
  if (typeof i !== 'number') next();
  const data = await getOne(type, i)
  if (typeof data !== "object") next()
  else res.send(data)
})

function titleCase(str) {
  var splitStr = str.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(' ');
}

module.exports = app