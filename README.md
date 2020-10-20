# The Coding Train API

(Unofficial) API for the Coding Train

Response Type: `application/json`

## Endpoints:

All endpoints are relative to [`https://the-coding-train-api.vercel.app`](https://the-coding-train-api.vercel.app)

* `/` : Details about the API and other endpoints
* `/:videoplaylist{/:videoIndex}` : Data about particular playlist (or video)

| Actual Name                              | `videoplalist`     |
| ---------------------------------------- | ------------------ |
| Coding Challenges                        | `challenge`        |
| Coding in the Cabana                     | `cabana`           |
| Code! Programming with p5.js             | `p5Tutorial`       |
| Git and Github for Poets                 | `gitTutorial`      |
| Working with Data and APIs in JavaScript | `dataapis`         |
| Teachable Machine Tutorials              | `teachableMachine` |
| Guest Tutorials                          | `guest`            |

* `/challenge/randomContribution` : Random Contribution for a Coding Challenge
* `/cabana/randomContribution` : Random Contribution for a Coding in the Cabana Video
* `/p5Tutorial/randomContribution` : Random Contribution based on p5.js Tutorials video


## Contribution
If any issue (eg. wrong response, etc) is found, please feel free to [create a new github issue](/issues).

You can also contribute to the project by [opening a pull request.](/pulls)

## License
MIT

