# The Coding Train API

(Unofficial) API for the Coding Train

Response Type: `application/json`

## Endpoints:
- `/challenge/contribution`: Responds with a random community contribution on a coding challenge
- `/challenge/:index`: Responds with a particular Coding Challenge
  - `index`: Coding Challenge index
- `/cabana/contribution`: Responds with a random community contribution on a Coding in the Cabana challenge
- `/cabana/:index`: Responds with a particular Cabana Challenge
  - `index`: Coding in the Cabana index

**Example**: 
```bash
GET /challenge/contribution
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

