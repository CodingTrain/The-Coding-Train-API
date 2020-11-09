# The Coding Train API

<img src="https://camo.githubusercontent.com/e883a4d030ab6273d49d284949ef865049fd6457ecba1bba9956ef6699963317/68747470733a2f2f64726976652e676f6f676c652e636f6d2f75633f6578706f72743d766965772669643d31734137664479426a4132706d6569697762397157476b5452687a3678637a6c69" width="200" alt="Coding Train Character"/>

(Unofficial) API for the Coding Train

Response Type: `application/json`

## Endpoints:

All endpoints are relative to [`https://the-coding-train-api.vercel.app`](https://the-coding-train-api.vercel.app)

* `GET /` : Details about the API and other endpoints
* `GET /:videoplaylist{/:videoIndex}` : Data about particular playlist (or video)

| Actual Name                              | `videoplalist`     |
| ---------------------------------------- | ------------------ |
| Coding Challenges                        | `challenge`        |
| Coding in the Cabana                     | `cabana`           |
| Code! Programming with p5.js             | `p5Tutorial`       |
| Git and Github for Poets                 | `gitTutorial`      |
| Working with Data and APIs in JavaScript | `dataapis`         |
| The Nature of Code                       | `noc`              |
| Teachable Machine Tutorials              | `teachableMachine` |
| Beginners Guide to Machine Learning      | `ml5`              |
| Discord Bot                              | `discord`          |
| Guest Tutorials                          | `guest`            |

* `GET /challenge/randomContribution` : Random Contribution for a Coding Challenge
* `GET /cabana/randomContribution` : Random Contribution for a Coding in the Cabana Video
* `GET /p5Tutorial/randomContribution` : Random Contribution based on p5.js Tutorials 
* `GET /ml5/randomContribution` : Random Community Contribution in Machine Learning with ml5.js 
* `GET /noc/randomContribution` : Random Contribution based on The Nature of Code videos


## Contribution
If any issue (eg. wrong response, etc) is found, please feel free to [create a new github issue](/issues).

You can also contribute to the project by [opening a pull request.](/pulls)

## License
MIT

