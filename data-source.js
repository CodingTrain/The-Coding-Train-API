const axios = require('axios');
const YAML = require('yaml')

async function getAllCodingChallenges() {
  let url = 'https://api.github.com/repos/CodingTrain/website/contents/_CodingChallenges?ref=master'
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

async function getAllCabanaChallenges() {
  let url = 'https://api.github.com/repos/CodingTrain/website/contents/_challenges/coding-in-the-cabana?ref=master'
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

async function getCodingChallenge(i) {
  try {
    const all = await getAllCodingChallenges()
    let { url } = all[i]
    let { data } = await axios.get(url)
    let challengeYaml = data.split('---')[1];
    let description = YAML.parse(data.split('---').pop());
    let challenge = YAML.parse(challengeYaml)
    return { ...challenge, description, webURL: "CodingChallenges/" + url.split("/").pop().slice(0, -2) + "html" }
  } catch {
    return "error"
  }
}
async function getCabanaChallenge(i) {
  try {
    const all = await getAllCabanaChallenges()
    let { url } = all[i]
    let { data } = await axios.get(url)
    let cabanaYaml = data.split('---')[1];
    let description = YAML.parse(data.split('---').pop());
    let cabana = YAML.parse(cabanaYaml)
    return { ...cabana, description, webURL: "challenges/coding-in-the-cabana/" + url.split("/").pop().slice(0, -2) + "html" }
  } catch {
    return "error"
  }
}

module.exports = { getAllCodingChallenges, getCodingChallenge, getAllCabanaChallenges, getCabanaChallenge }