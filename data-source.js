const axios = require('axios');
const YAML = require('yaml')

async function getAllChallenges() {
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


async function getCodingChallenge(i) {
  try {
    const all = await getAllChallenges()
    let { url } = all[i]
    let { data } = await axios.get(url)
    let contributionsYaml = data.split('---')[1];
    let contributions = YAML.parse(contributionsYaml)
    return contributions
  } catch {
    return "error"
  }
}

module.exports = { getAllChallenges, getCodingChallenge }