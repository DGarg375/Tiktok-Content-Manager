let videoElmts = document.getElementsByClassName("tiktokDiv");

let nickname1 = document.getElementById("nicknameVideo1");
let nickname2 = document.getElementById("nicknameVideo2");

let reloadButtons = document.getElementsByClassName("reload");
let heartButtons = document.querySelectorAll("div.heart");
let nextButton = document.getElementById("gotoWinner");
nextButton.addEventListener("click", checkWinnerPage);

let preference = {
  "better": -1,
  "worse": -1
};

let likeButton1 = false;
let likeButton2 = false;

for (let i=0; i<2; i++) {
  let reload = reloadButtons[i]; 
  reload.addEventListener("click",function() { reloadVideo(videoElmts[i]) });

heartButtons[i].addEventListener("click", function() {
  heartButtons[i].innerHTML = "<i class='fas fa-heart' color='rgba(238, 29, 82, 0.8)'></i>";
  if(i == 0) {
    likeButton1 = true;
    preference = {
      "better": likedVideo1,
      "worse": likedVideo2
    };
    heartButtons[1].innerHTML = "<i class='far fa-heart' color='rgb(180, 180, 180)'></i>";
  }
  else {
    likeButton2 = true;
    preference = {
      "better": likedVideo2,
      "worse": likedVideo1
    };
    heartButtons[0].innerHTML = "<i class='far fa-heart' color='rgb(180, 180, 180)'></i>";
  }
});
  heartButtons[i].classList.add("unloved");
}

async function getVideosForMatching(url) {
  params = {
    method: 'GET', 
     };
  
  let response = await fetch(url,params);
  if (response.ok) {
    let data = await response.json();
    return data;
  } else {
    throw Error(response.status);
  }
}

async function sendPrefData(url,data) {
  params = {
    method: 'POST', 
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data) };
  console.log("about to send post request");
  
  let response = await fetch(url,params);
  if (response.ok) {
    let data = await response.text();
    return data;
  } else {
    throw Error(response.status);
  }
}

const urls = [];
let likedVideo1 = -1;
let likedVideo2 = -1;

getVideosForMatching("/getTwoVideos")
.then(async function(response) {
  const result = await response;
  urls[0] = await result[0].url;
  urls[1] = await result[1].url;
  nickname1.innerText = `${await result[0].nickname}`;
  nickname2.innerText = `${await result[1].nickname}`; 
  likedVideo1 = await result[0].rowIdNum;
  likedVideo2 = await result[1].rowIdNum;
})
.then(function() {
  for (let i=0; i<2; i++) {
      addVideo(urls[i],videoElmts[i]);
    }
    loadTheVideos();
});

function checkWinnerPage() {
  if(likeButton1 == false && likeButton2 == false) {
    alert("You have to like one of the videos...");
    return;
  }
  sendPrefData("/insertPref", preference)
  .then(function(response) {
    if(response == "continue") {
      window.location = "compare.html";
    }
    else if(response == "pick winner") {
      window.location = "winner.html";
    }
  });
}