
/**
const axios = require('axios')
const cheerio = require('cheerio')

const baseURL = "https://thecodingtrain.com"

async function getAllChallenges() {
  const url = "https://thecodingtrain.com/CodingChallenges/"
  const { data } = await axios.get(url)
  const $ = cheerio.load(data)
  const challengeurls = $('div.video-card > a')
  const titles = $('div.video-card h3')
  const codingChallenges = []
  for (let i = 0; i < challengeurls.length; i++) {
    codingChallenges.push({
      url: baseURL + challengeurls[i].attribs.href,
      title: titles[i].children[0].data
    })
  }
  return codingChallenges
}
const main = async () => {
  const allChallenges = await getAllChallenges()

  let index = 64
  getChallenge(index, allChallenges);
}
async function getChallenge(i, all) {
  const { title, url } = all[i]
  const { data } = await axios.get(url)
  const $ = cheerio.load(data)
  const contributions = $('.contributions ul').children()
  console.log(contributions.html())
}

main();

*/