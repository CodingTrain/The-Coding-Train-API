const fs = require('fs')
const express = require('express')
const app = express();

const contributions = JSON.parse(fs.readFileSync('contributions.json').toString())

const port = process.env.PORT || 5090
app.listen(port, () => console.log(`Serving at http://localhost:${port}`))

app.get('/cc/random/:count?', (req, res) => {
  const cons = []
  let count = req.params.count || 1
  for (let i = 0; i < count; i++) {
    cons.push(randomContribution())
  }
  res.send(count == 1 ? cons[0] : cons)
})

const randomContribution = () => {
  return contributions[Math.floor(Math.random() * contributions.length)]
}
