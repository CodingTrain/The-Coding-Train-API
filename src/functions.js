const axios = require('axios');
const YAML = require('yaml')
require('dotenv').config()

const baseURL = "https://thecodingtrain.com"

const dyna = {
  challenge: {
    apiUrl: 'https://api.github.com/repos/CodingTrain/website/contents/_CodingChallenges',
    webURLPre: `${baseURL}/CodingChallenges/`,
    title: "Coding Challenge",
    description: "Watch Dan take on some viewer submitted Coding Challenges in p5.js and Processing!",
    ytid: "PLRqwX-V7Uu6ZiZxtDDRCi6uhfTH4FilpH"
  },
  cabana: {
    apiUrl: 'https://api.github.com/repos/CodingTrain/website/contents/_challenges/coding-in-the-cabana',
    webURLPre: `${baseURL}/challenges/coding-in-the-cabana/`,
    title: "Coding in the Cabana",
    description: "The sun out is, the birds are chirping, it’s a beautiful day to code a generative algorithm. Choo choo!",
    ytid: "PLRqwX-V7Uu6bVafiIHN-8LR3MUFDboJdU"
  },
  p5Tutorial: {
    apiUrl: "https://api.github.com/repos/CodingTrain/website/contents/_beginners/p5js",
    webURLPre: `${baseURL}/beginners/p5js/`,
    title: "Code! Programming in p5.js",
    description: "This video series focuses on the fundamentals of computer programming (variables, conditionals, iteration, functions & objects) using JavaScript. In particular it leverages the p5.js creative computing environment which is oriented towards visual displays on desktops, laptops, tablets or smartphones. The series is designed for computer programming novices."
  },
  gitTutorial: {
    apiUrl: "https://api.github.com/repos/CodingTrain/website/contents/_beginners/git-and-github",
    webURLPre: `${baseURL}/beginners/git-and-github/`,
    title: "Git and Github for poets",
    description: "This video series is designed to teach you the basics of working with git version control and the GitHub website."
  },
  dataapis: {
    apiUrl: "https://api.github.com/repos/CodingTrain/website/contents/_Courses/data-and-apis",
    title: "Working with Data and APIs in JavaScript",
    webURLPre: `${baseURL}/Courses/data-and-apis/`,
    description: "Welcome to Working with Data and APIs in Javascript!",
    ytid: "PLRqwX-V7Uu6YxDKpFzf_2D84p0cyk4T7X"
  },
  noc: {
    apiUrl: "https://api.github.com/repos/CodingTrain/website/contents/_learning/nature-of-code",
    webURLPre: `${baseURL}/learning/nature-of-code/`,
    title: "The Nature of Code",
    description: "These videos accompany The Nature of Code book."
  },
  guest: {
    apiUrl: "https://api.github.com/repos/CodingTrain/website/contents/_GuestTutorials",
    webURLPre: `${baseURL}/GuestTutorials/`,
    title: "Guest Tutorials",
    description: "Here you can find all tutorials made by guests on TheCodingTrain."
  },
  teachableMachine: {
    apiUrl: "https://api.github.com/repos/CodingTrain/website/contents/_TeachableMachine",
    webURLPre: `${baseURL}/TeachableMachine/`,
    title: "The Teachable Machine",
    description: "Introducing Teachable Machine 2.0 from Google Creative Lab! Train a computer to recognize your own images, sounds & poses.",
    ytid: "PLRqwX-V7Uu6aJwX0rFP-7ccA6ivsPDsK5"
  },
  ml5: {
    apiUrl: "https://api.github.com/repos/CodingTrain/website/contents/_learning/ml5",
    webURLPre: `${baseURL}/learning/ml5`,
    title: "Beginners Guide to Machine Learning in JavaScript",
    description: "ml5.js Beginners Guide",
    ytid: "PLRqwX-V7Uu6YPSwT06y_AEYTqIwbeam3y"
  }
}

const randomArr = arr => arr[Math.floor(Math.random() * arr.length)]

async function getAll(content) {
  let url = dyna[content].apiUrl;

  let { data: challenges } = await axios.get(url, {
    auth: { username: process.env.GITHUB_USERNAME, password: process.env.GITHUB_PASSWORD }
  })
  challenges = challenges.filter(x => x.name !== 'index.md')
  let challengesWithIndex = {}
  for (let ch of challenges) {
    challengesWithIndex[+ch.name.match(/\d+[.\d]*/)[0]] = {
      name: ch.name.slice(0, -3),
      url: ch.download_url,
      videoIndex: +ch.name.match(/\d+[.\d]*/)[0]
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
    console.log(url)
    let { data } = await axios.get(url, {
      auth: { username: process.env.GITHUB_USERNAME, password: process.env.GITHUB_PASSWORD }
    })
    let challengeYaml = data.split('---')[1];
    let description
    try {
      description = YAML.parse(data.split('---').pop());
    } catch {
      description = ""
    }
    let challenge = YAML.parse(challengeYaml)
    return { ...challenge, description, webURL: `${webURLPre}${url.split("/").pop().slice(0, -2)}html` }
  } catch (e) {
    return "error" + e
  }
}


async function getAllData(content) {
  let newObj = [];
  let oldObj = await getAll(content);
  for (let i = 1; i <= Object.keys(oldObj).length; i++) {
    let x = await getOne(content, i)
    newObj.push({
      index: x.video_number,
      name: x.title,
    })
  }
  return newObj
}

const randomContribution = async (type, baseURL) => {
  const data = await getAll(type);
  let challengeIndex = randomArr(Object.keys(data))
  const challenge = await getOne(type, challengeIndex)
  if (typeof challenge !== "object") return "error"
  else {
    const challengeRes = {
      name: challenge.title,
      index: challenge.video_number,
      url: challenge.webURL,
      apiUrl: baseURL + '/' + type + '/' + challenge.video_number,
      series: dyna[type].title
    }
    if (challenge.contributions && typeof challenge.contributions == 'object') return {
      ...randomArr(challenge.contributions),
      originalVideo: challengeRes
    }
    else if (Math.floor(challengeIndex) == challengeIndex) return await randomContribution(type, baseURL)
    else {
      const pt1 = await getOne(type, Math.floor(challengeIndex) + 0.1);
      if (pt1.contributions) return {
        ...randomArr(pt1.contributions),
        originalVideo: challengeRes
      }
      else return randomContribution(type, baseURL)
    }
  }
}


module.exports = { getAll, getOne, getAllData, randomContribution, dyna }