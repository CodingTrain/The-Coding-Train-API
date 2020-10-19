# The Coding Train API

(Unofficial) API for the Coding Train

Response Type: `application/json`

## Endpoints:


**Example**: 
```bash
GET /challenge/randomContribution
```
```jsonc
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


**Example**: 
```bash
GET /challenge/3
```
```jsonc
{
  "title": "Snake Game",
  "date": "2016-05-02",
  "parts": [
    // different parts of the challenge
  ],
  "webURL": "CodingChallenges/abcdef",
  "challengeIndex": 3,
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

