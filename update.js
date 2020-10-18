
const fs = require("fs")
const { getAllChallenges, getCodingChallenge } = require('./data-source')
const ProgressBar = require('progress');


const main = async () => {
  const contributions = []

  console.log("Starting Update...")
  let all = await getAllChallenges()
  const bar = new ProgressBar(':bar :percent :etas', { total: all.length });
  for (let i = 0; i < all.length; i++) {
    bar.tick();
    let challenge = await getCodingChallenge(all, i)
    // console.log(`${i}% Done`)
    contributions.push(
      ...(challenge.contributions || []).map(
        x => ({
          ...x,
          challenge: {
            title: challenge.title,
            video_id: challenge.video_id
          }
        })
      )
    )
  }
  fs.writeFile('./contributions.json', JSON.stringify(contributions), (err) => {
    if (err) console.log(err)
    else console.log("Completed")
  })
}

main();
