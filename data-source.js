const axios = require('axios');
const YAML = require('yaml')

async function getAllChallenges() {
  let url = 'https://api.github.com/repos/CodingTrain/website/contents/_CodingChallenges?ref=master'
  let { data: challenges } = await axios.get(url)
  return challenges.filter(x => x.name !== 'index.md').map(x => ({ name: x.name.slice(4, -3), url: x.download_url }))
}

async function getCodingChallenge(all, i) {
  let { url } = all[i]
  let { data } = await axios.get(url)
  let contributionsYaml = data.split('---')[1];
  let contributions = YAML.parse(contributionsYaml)
  return contributions
}

module.exports = { getAllChallenges, getCodingChallenge }