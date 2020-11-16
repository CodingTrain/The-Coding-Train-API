const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const { getVideo, randomContribution, allPlaylists, getAllVideos, randomArr } = require('./functions')

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

const videoPlaylists = Object.keys(allPlaylists)

const canContribute = [
  "challenge",
  "cabana",
  "ml5",
  "noc"
]


// '/' route
app.get('/', (req, res) => {
  let reqURL = `${req.protocol}://${req.get('host')}${req.url.endsWith('/') ? req.url : req.url + '/'}`;
  res.send({
    message: "Hello! And Welcome to the Coding Train!",
    videoSeries: Object.fromEntries(videoPlaylists.map(elt =>
      [allPlaylists[elt].title, reqURL + elt]
    ))
  })
})

// '/videoPlaylist' route
// Possible videoPlaylist are listed in README.md
app.get('/:videoPlaylist', async (req, res, next) => {
  const type = req.params.videoPlaylist
  if (!videoPlaylists.includes(type)) next();
  let reqURL = `${req.protocol}://${req.get('host')}${req.url.endsWith('/') ? req.url : req.url + '/'}`;
  let videos = Object.values(await getAllVideos(type))
  res.send({
    title: allPlaylists[type].title,
    description: allPlaylists[type].description,
    playlistID: allPlaylists[type].ytid,
    videos: videos.map(elt => ({
      name: titleCase(elt.name.split('-').join(' ')),
      videoIndex: elt.videoIndex,
      apiUrl: reqURL + elt.videoIndex
    })).sort((a, b) => a.videoIndex - b.videoIndex),
    randomVideoURL: reqURL + 'random',
    randomCommunityContributionURL: canContribute.includes(type) ? reqURL + "randomContribution" : undefined,
  })
})

// '/videoPlaylist/randomContribution' route
// Here, possible videoPlaylist would be 'challenge', 'cabana', 'p5Tutorial', 'ml5' and 'noc'
app.get('/:videoPlaylist/randomContribution', async (req, res, next) => {
  const type = req.params.videoPlaylist
  let baseURL = `${req.protocol}://${req.get('host')}`;
  if (!canContribute.includes(type)) next();
  let h = await randomContribution(type, baseURL)
  if (typeof h == 'object') res.send(h)
  else next()
})

// '/videoPlaylist/random' route
// Get random video from certain playlist
// Possible videoPlaylist are listed in README.md
app.get('/:videoPlaylist/random', async (req, res, next) => {
  const type = req.params.videoPlaylist
  const data = await getAllVideos(type);
  let challengeIndex = randomArr(Object.keys(data))
  const challenge = await getVideo(type, challengeIndex)
  if (typeof challenge == 'object') res.send(challenge)
  else next()
})

// 'videoPlaylist/index' route
// Get specific video from a playlist
// Index is according to Coding Train Website
app.get('/:videoPlaylist/:index', async (req, res, next) => {
  const type = req.params.videoPlaylist
  const i = +req.params.index
  if (!videoPlaylists.includes(type)) next();
  if (typeof i !== 'number') next();
  const data = await getVideo(type, i)
  if (typeof data !== "object") next()
  else res.send(data)
})

// Function That Capitalizes Each Word Of A String
function titleCase(str) {
  var splitStr = str.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(' ');
}

module.exports = app