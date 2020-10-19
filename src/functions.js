const axios = require('axios');
const YAML = require('yaml')

const baseURL = "https://thecodingtrain.com"

const dyna = {
  challenge: {
    apiUrl: 'https://api.github.com/repos/CodingTrain/website/contents/_CodingChallenges?ref=master',
    webURLPre: `${baseURL}/CodingChallenges/`
  },
  cabana: {
    apiUrl: 'https://api.github.com/repos/CodingTrain/website/contents/_challenges/coding-in-the-cabana?ref=master',
    webURLPre: `${baseURL}/challenges/coding-in-the-cabana/`
  }
}

const randomArr = arr => arr[Math.floor(Math.random() * arr.length)]
async function getAll(content) {
  let url = dyna[content].apiUrl;

  let { data: challenges } = await axios.get(url)
  challenges = challenges.filter(x => x.name !== 'index.md')
  let challengesWithIndex = []
  for (let ch of challenges) {
    challengesWithIndex[+ch.name.match(/\d+[.\d]+/)[0]] = {
      name: ch.name.slice(4, -3),
      url: ch.download_url
    }
  }
  return challengesWithIndex
}


async function getOne(content, i) {
  let webURLPre = dyna[content].webURLPre
  try {
    const all = await getAll(content)
    let { url } = all[i]
    let { data } = await axios.get(url)
    let challengeYaml = data.split('---')[1];
    let description = YAML.parse(data.split('---').pop());
    let challenge = YAML.parse(challengeYaml)
    return { ...challenge, description, webURL: `${webURLPre}${url.split("/").pop().slice(0, -2)}html` }
  } catch {
    return "error"
  }
}

const randomContribution = async (type) => {
  const data = await getAll(type);
  let challengeIndex = randomArr(Object.keys(data))
  const challenge = await getOne(type, challengeIndex)
  if (typeof challenge !== "object") return { status: "error" }
  else {
    if (challenge.contributions) return {
      ...randomArr(challenge.contributions),
      challenge: { name: challenge.title, index: challenge.video_number, url: challenge.webURL }
    }
    else if (Math.floor(challengeIndex) == challengeIndex) return await randomContribution()
    else return {
      ...randomArr((await getOne(type, Math.floor(challengeIndex) + 0.1)).contributions),
      challenge: { name: challenge.title, index: challenge.video_number, url: baseURL + challenge.webURL }
    }
  }
}


module.exports = { getAll, getOne, randomContribution }