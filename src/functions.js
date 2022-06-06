const axios = require("axios");
const YAML = require("yaml");

const baseURL = "https://thecodingtrain.com";

const allPlaylists = {
  challenge: {
    apiUrl:
      "https://api.github.com/repos/CodingTrain/website/contents/_CodingChallenges",
    URLPrefix: `${baseURL}/CodingChallenges/`,
    title: "Coding Challenge",
    description:
      "Watch Dan take on some viewer submitted Coding Challenges in p5.js and Processing!",
    ytid: "PLRqwX-V7Uu6ZiZxtDDRCi6uhfTH4FilpH",
  },
  cabana: {
    apiUrl:
      "https://api.github.com/repos/CodingTrain/website/contents/_challenges/coding-in-the-cabana",
    URLPrefix: `${baseURL}/challenges/coding-in-the-cabana/`,
    title: "Coding in the Cabana",
    description:
      "The sun out is, the birds are chirping, it’s a beautiful day to code a generative algorithm. Choo choo!",
    ytid: "PLRqwX-V7Uu6bVafiIHN-8LR3MUFDboJdU",
  },
  p5Tutorial: {
    apiUrl:
      "https://api.github.com/repos/CodingTrain/website/contents/_beginners/p5js",
    URLPrefix: `${baseURL}/beginners/p5js/`,
    title: "Code! Programming in p5.js",
    description:
      "This video series focuses on the fundamentals of computer programming (variables, conditionals, iteration, functions & objects) using JavaScript. In particular it leverages the p5.js creative computing environment which is oriented towards visual displays on desktops, laptops, tablets or smartphones. The series is designed for computer programming novices.",
  },
  gitTutorial: {
    apiUrl:
      "https://api.github.com/repos/CodingTrain/website/contents/_beginners/git-and-github",
    URLPrefix: `${baseURL}/beginners/git-and-github/`,
    title: "Git and Github for poets",
    description:
      "This video series is designed to teach you the basics of working with git version control and the GitHub website.",
  },
  dataapis: {
    apiUrl:
      "https://api.github.com/repos/CodingTrain/website/contents/_Courses/data-and-apis",
    title: "Working with Data and APIs in JavaScript",
    URLPrefix: `${baseURL}/Courses/data-and-apis/`,
    description: "Welcome to Working with Data and APIs in Javascript!",
    ytid: "PLRqwX-V7Uu6YxDKpFzf_2D84p0cyk4T7X",
  },
  noc: {
    apiUrl:
      "https://api.github.com/repos/CodingTrain/website/contents/_learning/nature-of-code",
    URLPrefix: `${baseURL}/learning/nature-of-code/`,
    title: "The Nature of Code",
    description: "These videos accompany The Nature of Code book.",
  },
  guest: {
    apiUrl:
      "https://api.github.com/repos/CodingTrain/website/contents/_GuestTutorials",
    URLPrefix: `${baseURL}/GuestTutorials/`,
    title: "Guest Tutorials",
    description:
      "Here you can find all tutorials made by guests on TheCodingTrain.",
  },
  teachableMachine: {
    apiUrl:
      "https://api.github.com/repos/CodingTrain/website/contents/_TeachableMachine",
    URLPrefix: `${baseURL}/TeachableMachine/`,
    title: "The Teachable Machine",
    description:
      "Introducing Teachable Machine 2.0 from Google Creative Lab! Train a computer to recognize your own images, sounds & poses.",
    ytid: "PLRqwX-V7Uu6aJwX0rFP-7ccA6ivsPDsK5",
  },
  ml5: {
    apiUrl:
      "https://api.github.com/repos/CodingTrain/website/contents/_learning/ml5",
    URLPrefix: `${baseURL}/learning/ml5/`,
    title: "Beginners Guide to Machine Learning in JavaScript",
    description: "ml5.js Beginners Guide",
    ytid: "PLRqwX-V7Uu6YPSwT06y_AEYTqIwbeam3y",
  },
  discord: {
    apiUrl:
      "https://api.github.com/repos/CodingTrain/website/contents/_learning/bots/discord",
    URLPrefix: `${baseURL}/learning/bots/discord/`,
    title: "Discord Bot",
    description: "🤖 How to create a Discord bot with discord.js! 🤖",
    ytid: "PLRqwX-V7Uu6avBYxeBSwF48YhAnSn_sA4",
  },
};

/**
 * @type {<T>(arr:T[]) => T}
 * Get random element from an array
 * @param {Array<T>} arr Array
 */
const randomArr = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Get details aboul all videos from a particular playlist
 * @param {string} playlist
 * @returns {Promise<ArrayLike<{name: string, url: string, videoIndex: number}>>}
 */
async function getAllVideos(playlist) {
  if (!allPlaylists[playlist]) return new Error("Playlist Not found");
  let url = allPlaylists[playlist].apiUrl;
  let { data: challenges } = await axios.get(url, {
    auth: { username: "dipamsen" },
  });
  challenges = challenges.filter((x) => x.name !== "index.md");
  let challengesWithIndex = {};
  for (let ch of challenges) {
    const index = +ch.name.match(/\d+[.\d]*/)[0];
    challengesWithIndex[index] = {
      name: ch.name.slice(0, -3),
      url: ch.download_url,
      videoIndex: index,
    };
  }
  return challengesWithIndex;
}

/**
 * Get a particular video by playlist and index
 * @param {string} playlist Playlist ID
 * @param {number} index Index of Video according to The Coding Train Website
 */
async function getVideo(playlist, index) {
  if (!allPlaylists[playlist]) throw new Error("Not found " + playlist);
  let URLPrefix = allPlaylists[playlist].URLPrefix;
  try {
    const allVideos = await getAllVideos(playlist);
    let url = allVideos[index].url;
    let { data: allVideoData } = await axios.get(url, {
      auth: { username: "dipamsen" },
    });
    let videoYaml = allVideoData.split("---")[1];
    let description = allVideoData.split("---").pop();
    let video = YAML.parse(videoYaml);
    video.description = description;
    video.webURL = `${URLPrefix}${url.split("/").pop().slice(0, -2)}html`;
    delete video.redirect_from;
    delete video.repository;
    delete video.can_contribute;
    // remove unnecessary properties from the object
    const {
      video_number,
      links,
      video_id,
      videos,
      web_editor,
      ...restVideoProperties
    } = video;
    let contributions;
    if (restVideoProperties.contributions)
      contributions = restVideoProperties.contributions;
    else if (Math.floor(index) == index) contributions = [];
    else
      contributions = (await getVideo(playlist, Math.floor(index) + 0.1))
        .contributions;
    return {
      ...restVideoProperties,
      videoIndex: video_number,
      referenceLinks: links,
      referenceVideos: videos,
      videoID: video_id,
      webEditor: web_editor,
      contributions,
      playlist: allPlaylists[playlist].title,
    };
  } catch (e) {
    return e;
  }
}

const randomContribution = async (playlist, baseURL) => {
  const data = await getAllVideos(playlist);
  const videoIndex = randomArr(Object.keys(data));
  const video = await getVideo(playlist, videoIndex);
  if (typeof video !== "object") return "error";
  else {
    const ogVideoData = {
      name: video.title,
      index: video.videoIndex,
      url: video.webURL,
      apiUrl: baseURL + "/" + playlist + "/" + video.videoIndex,
      series: allPlaylists[playlist].title,
    };
    if (video.contributions && typeof video.contributions == "object")
      return {
        ...randomArr(video.contributions),
        originalVideo: ogVideoData,
      };
    else if (Math.floor(videoIndex) == videoIndex)
      return await randomContribution(playlist, baseURL);
    else {
      const pt1 = await getVideo(playlist, Math.floor(videoIndex) + 0.1);
      if (pt1.contributions)
        return {
          ...randomArr(pt1.contributions),
          originalVideo: ogVideoData,
        };
      else return await randomContribution(playlist, baseURL);
    }
  }
};

module.exports = {
  getAllVideos,
  getVideo,
  randomContribution,
  allPlaylists,
  randomArr,
};
