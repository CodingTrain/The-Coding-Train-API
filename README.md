# The Coding Train API

<img src="https://thecodingtrain.com/assets/images/header-mobile.jpg" alt="Coding Train Logo"/>

A simple Express API for the Video Tutorials on the Coding Train.

Response Type: `application/json`

## Endpoints:

All endpoints are relative to [`https://the-coding-train-api.vercel.app`](https://the-coding-train-api.vercel.app)

* `GET /` : Details about the API and other endpoints
* `GET /challenge`: Details about Coding Challenges
* `GET /challenge/:id`: Information about Coding Challenge
* `GET /tracks/{:trackid}`: Details about Main Tracks
* `GET /sidetracks/{:trackid}`: Details about Side Tracks


<!-- ### Example Testing Routes
**Open these links in the browser**
* [/challenge/random](https://the-coding-train-api.vercel.app/challenge/random) : Get details about a Random Coding Challenge Video
* [/discord](https://the-coding-train-api.vercel.app/discord) : Get details about the Discord Bot Tutorial Series
* [/challenge/randomContribution](https://the-coding-train-api.vercel.app/challenge/randomContribution) : Get a random Community Contribution on a Coding Challenge Video
* [/cabana/randomContribution](https://the-coding-train-api.vercel.app/cabana/randomContribution) : Get a random Community Contribution on a Coding in the Cabana Video -->


<!-- ## Usage

Here is an p5.js Web Editor Sketch which uses the API
[The Coding Train API Example](https://editor.p5js.org/dipam2006/full/OV4TcmsxF) -->

## Contribution
If any issue is found, please feel free to [create a new github issue](/issues).

You can also contribute to the project by [opening a pull request.](/pulls)

To test this API locally on your computer,
* Clone this repo 
  `git clone https://github.com/CodingTrain/The-Coding-Train-API.git`
* Run `npm start` on the Terminal in the Project Directory
* Open `localhost:4333` in the browser to use the API.


## License
MIT

