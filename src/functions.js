const axios = require('axios');
const YAML = require('yaml')
require('dotenv').config()

const baseURL = "https://thecodingtrain.com"

const dyna = {
  challenge: {
    apiUrl: 'https://api.github.com/repos/CodingTrain/website/contents/_CodingChallenges',
    webURLPre: `${baseURL}/CodingChallenges/`
  },
  cabana: {
    apiUrl: 'https://api.github.com/repos/CodingTrain/website/contents/_challenges/coding-in-the-cabana',
    webURLPre: `${baseURL}/challenges/coding-in-the-cabana/`
  },
  p5Tutorial: {
    apiUrl: "https://api.github.com/repos/CodingTrain/website/contents/_beginners/p5js",
    webURLPre: `${baseURL}/beginners/p5js/`
  },
  gitTutorial: {
    apiUrl: "https://api.github.com/repos/CodingTrain/website/contents/_beginners/git-and-github",
    webURLPre: `${baseURL}/beginners/git-and-github/`
  },
  dataapis: {
    apiUrl: "https://api.github.com/repos/CodingTrain/website/contents/_Courses/data-and-apis",
    webURLPre: `${baseURL}/Courses/data-and-apis/`
  },
  guest: {
    apiUrl: "https://api.github.com/repos/CodingTrain/website/contents/_GuestTutorials",
    webURLPre: `${baseURL}/GuestTutorials/`
  }
}

const typeList = {
  challenge: "Coding Challenge",
  cabana: "Coding in the Cabana",
  p5Tutorial: "Code! Programming with p5.js",
  gitTutorial: "Git and Github for Poets",
  dataapis: "Working with Data and APIs in JavaScript",
  guest: "Guest Tutorials"
}


const randomArr = arr => arr[Math.floor(Math.random() * arr.length)]

async function getAll(content) {
  let url = dyna[content].apiUrl;

  let { data: challenges } = await axios.get(url, {
    auth: { username: process.env.GITHUB_USERNAME, password: process.env.GITHUB_PASSWORD }
  })
  challenges = challenges.filter(x => x.name !== 'index.md')
  let challengesWithIndex = []
  for (let ch of challenges) {
    challengesWithIndex[+ch.name.match(/\d+[.\d]*/)[0]] = {
      name: ch.name.slice(4, -3),
      url: ch.download_url
    }
  }
  return challengesWithIndex
}


async function getOne(content, i) {
  if (!dyna[content]) throw new Error("Chale " + content)
  let webURLPre = dyna[content].webURLPre
  try {
    const all = await getAll(content)
    let { url } = all[i]
    let { data } = await axios.get(url, {
      auth: { username: process.env.GITHUB_USERNAME, password: process.env.GITHUB_PASSWORD }
    })
    let challengeYaml = data.split('---')[1];
    let description = YAML.parse(data.split('---').pop());
    let challenge = YAML.parse(challengeYaml)
    return { ...challenge, description, webURL: `${webURLPre}${url.split("/").pop().slice(0, -2)}html` }
  } catch (e) {
    return "error" + e
  }
}

const randomContribution = async (type) => {
  const data = await getAll(type);
  let challengeIndex = randomArr(Object.keys(data))
  const challenge = await getOne(type, challengeIndex)
  if (typeof challenge !== "object") return "error"
  else {
    const challengeRes = {
      name: challenge.title,
      index: challenge.video_number,
      url: challenge.webURL,
      series: typeList[type]
    }
    if (challenge.contributions && typeof challenge.contributions == 'object') return {
      ...randomArr(challenge.contributions),
      challenge: challengeRes
    }
    else if (Math.floor(challengeIndex) == challengeIndex) return await randomContribution(type)
    else {
      const pt1 = await getOne(type, Math.floor(challengeIndex) + 0.1);
      if (pt1.contributions) return {
        ...randomArr(pt1.contributions),
        challenge: challengeRes
      }
      else return randomContribution(type)
    }
  }
}


module.exports = { getAll, getOne, randomContribution, typeList }