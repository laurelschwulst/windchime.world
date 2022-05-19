let videoDatas = [
  {
    name: "Anna Reutinger",
    place: "San Anselmo, CA",
    gmtOffset: -7,
    src:
      "https://stream-uc2-bravo.dropcam.com:443/nexus_aac/e2d3307eebaf433b81f14f048a0352e7/playlist.m3u8?public=As0LOLu0fQ",
    type: "application/x-mpegURL",
    poster: "snapshot-anna.jpg"
  },
  {
    name: "Anna Sew Hoy + Giles Miller + family",
    place: "Los Angeles, CA",
    gmtOffset: -7,
    src:
      "https://stream-uc2-alfa.dropcam.com:443/nexus_aac/b2e3165f6f90434c80254fb1ebc4ec2e/playlist.m3u8?public=NVnP3EmAA3",
    type: "application/x-mpegURL",
    poster: "snapshot-anna-giles.jpg"
  },
  {
    name: "Lucia Leuci",
    place: "Milan, Italy",
    gmtOffset: 1,

    src:
      "https://stream-ue1-bravo.dropcam.com:443/nexus_aac/0136a6d6863e413c90db5e224187e101/playlist.m3u8?public=byvNVd0QDR",
    type: "application/x-mpegURL",
    poster: "snapshot-lucia.jpg"
  },
  {
    name: "Willa Smart",
    place: "Davis, CA",
    gmtOffset: -7,

    src:
      "https://stream-ue1-delta.dropcam.com:443/nexus_aac/6878aa86fa8b44f7ae91a15666e3e650/playlist.m3u8?public=ofUkJbNeHL",
    type: "application/x-mpegURL",
    poster: "snapshot-willa.jpg"
  },
  {
    name: "Weiyi Li",
    place: "Beijing, China",
    src: [
      "https://seashell.family/videos/weiyi-2am.mp4",
      "https://seashell.family/videos/weiyi-6am.mp4",
      "https://seashell.family/videos/weiyi-10am.mp4",
      "https://seashell.family/videos/weiyi-2pm.mp4",
      "https://seashell.family/videos/weiyi-6pm.mp4",
      "https://seashell.family/videos/weiyi-10pm.mp4"
    ],
    gmtOffset: 8
  },
  {
    name: "Oliver Hull",
    place: "Melbourne, Australia",
    src: [
      "https://seashell.family/videos/oliver-10pm.mp4",
      "https://seashell.family/videos/oliver-6am.mp4",
      "https://seashell.family/videos/oliver-10am.mp4",
      "https://seashell.family/videos/oliver-2pm.mp4",
      "https://seashell.family/videos/oliver-6pm.mp4",
      "https://seashell.family/videos/oliver-10pm.mp4"
    ],
    gmtOffset: 10,
    volume: 0.8
  },
  {
    name: "Lola Orge Benech",
    place: "Buenos Aires, Argentina",
    src: [
      "https://seashell.family/videos/lola-7am.mp4",
      "https://seashell.family/videos/lola-11am.mp4",
      "https://seashell.family/videos/lola-2pm.mp4",
      "https://seashell.family/videos/lola-6pm.mp4",
      "https://seashell.family/videos/lola-7pm.mp4",
      "https://seashell.family/videos/lola-8pm.mp4",
      "https://seashell.family/videos/lola-10pm.mp4"
    ],
    gmtOffset: -3,
    volume: 0.01
  },
  {
    name: "Mark Beasley",
    place: "San Pedro, CA",
    src: "https://wind.duskjacket.com/dash/cumbre.mpd",
    type: "application/dash+xml",
    poster: "snapshot-mark.jpg",
    gmtOffset: -7,
    volume: 0.6
  },
  {
    name: "Monica Hofstadter",
    place: "Brooklyn, NY",
    gmtOffset: -4,
    src: "",
    type: "application/x-mpegURL",
    poster: ""
  },
  {
    name: "Hiroki Yamasaki",
    place: "Okazaki, Japan",
    gmtOffset: 9,
    src: "",
    type: "application/x-mpegURL",
    poster: ""
  },
  {
    name: "Raque Ford",
    place: "Jeffersonville, NY",
    gmtOffset: -4,
    src: "",
    type: "application/x-mpegURL",
    poster: ""
  }
];

function getVideoSource(videoOptions, gmtOffset) {
  const d = new Date();
  let hour = d.getUTCHours();

  let progressThroughDay = ((hour + gmtOffset + 24) % 24) / 24;
  let currentVid = Math.floor(progressThroughDay * videoOptions.length);
  return videoOptions[currentVid];
}
const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get("cam");
let camN = parseInt(myParam, 10) || 0;
let videoData = videoDatas[camN];

let videojselement = document.getElementById("vid1");

if (Array.isArray(videoData.src)) {
  let src = getVideoSource(videoData.src, videoData.gmtOffset);
  videojselement.outerHTML = ` 
  <video-js 
  controls
    id="vid1">
      <source src="${src}"/>
  </video-js>`;
} else {
  let src = videoData.src;
  console.log(videoData.type);
  videojselement.outerHTML = ` 
  <video-js 
    poster="${videoData.poster}"
    id="vid1">
      <source src="${src}" type="${videoData.type}"/>
  </video-js>`;
}

var player = videojs("vid1");

let shade = document.getElementById("shade");
let shadeTop = document.getElementById("shade-top");
let shadeBottom = document.getElementById("shade-bottom");

window.setInterval(() => updateTime(), 5000);
updateTime();
shadeTop.innerHTML = videoData.name;

function updateTime() {
  shadeBottom.innerHTML = `<span> ${videoData.place} </span>
  <time> ${calcTime(videoData.gmtOffset)} </time>`;
}
function calcTime(offset) {
  // create Date object for current location
  var d = new Date();
  var utc = d.getTime() + d.getTimezoneOffset() * 60000;
  var nd = new Date(utc + 3600000 * offset);
  return nd
    .toLocaleString("en-US", {
      hour: "numeric",
      hour12: true,
      minute: "numeric"
    })
    .replace(" ", "");
}
let on = false;
if (Array.isArray(videoData.src)) {
  player.on("loadedmetadata", function () {
    let seek = Math.random() * 0.5 * player.duration();
    player.currentTime(seek);
  });
}
document.addEventListener("click", () => {
  if (!on) {
    player.play();
    if (videoData.volume) {
      player.volume(videoData.volume);
    }

    shade.className = "open";
  } else {
    player.pause();
    shade.className = "closed";
  }
  on = !on;
});

const hours = new Date().getHours();
const isDayTime = hours > 6 && hours < 20;
if (isDayTime) {
  document.body.classList.add("day");
} else {
  document.body.classList.add("night");
}
