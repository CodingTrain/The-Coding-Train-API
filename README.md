# The Coding Train API

(Unofficial) API for the Coding Train

Response Type: `application/json`

## Endpoints:
- `/challenge/contribution`: Responds with a random community contribution on a coding challenge
  - `count`: number of responses (default=1)

**Example**: 
```bash
GET /challenge/contribution
```
```json
{
  "title": "Contribution Title",
  "author": {
    "name": "Author Name",
    "url": "https://github.com/username"
  },
  "url": "Contribution Link",
  "source": "Source Code",
  "challenge": {
    "name": "Original Challenge Title",
    "index": 2, // Original Challenge index
    "url": "Original Challenge URL"
  }
}
```

- `/challenge/:index`: Responds with a particular Coding Challenge
  - `index`: Coding Challenge index

**Example**: 
```bash
GET /challenge/10.2
```
```json
{
  "title": "Maze Generator with p5.js - Part 2",
  "date": "2016-05-02",
  "parts": [
    // different parts of the challenge
  ],
  "webURL": "CodingChallenges/010.2-maze-dfs-p5.html",
  "challengeIndex": 10.2,
  "contributions": [],
  "referenceLinks": [],
  "videoID": "D8UgRyRnvXU",
  "webEditor": "EBkm4txSA"
}
```

### (WiP, Suggest Improvements!)

## Contributing
This repo is open to Pull Requests.

## License
MIT

