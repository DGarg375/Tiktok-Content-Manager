let divElmt = document.getElementById("tiktokDiv");

let winnerNickname = document.getElementById("nicknameWinnerVideo");

let reloadButton = document.getElementById("reload");

reloadButton.addEventListener("click",function () {
  reloadVideo(tiktokDiv);
});

async function winnerGetRequest(url) {
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

showWinningVideo()

function showWinningVideo() {
  winnerGetRequest("/getWinner")
  .then(async function(response) {
    addVideo(await response.url, divElmt);
    loadTheVideos();
    winnerNickname.innerText = `${await response.nickname}`;
  });
}
