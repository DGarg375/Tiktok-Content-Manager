let button = document.getElementById("continue");
button.addEventListener("click",buttonPress);

let button2 = document.getElementById("goto_myvideos");
button2.addEventListener("click", gotoMyVideos);

async function sendPostRequest(url,data) {
  params = {
    method: 'POST', 
    headers: {'Content-Type': 'application/json'},
    body: data };
  console.log("about to send post request");
  
  let response = await fetch(url,params);
  if (response.ok) {
    let data = await response.text();
    return data;
  } else {
    throw Error(response.status);
  }
}

async function buttonPress() { 
  let username = document.getElementById("user").value;
  let URL = document.getElementById("URL").value;
  let nickname = document.getElementById("nickname").value;
  
  if(username.length == 0 || URL.length == 0 || nickname.length == 0) {
    alert("Please fill all fields...");
    return;
  }
  const input = {
    usrName: username,
    urlName: URL,
    nickName: nickname
  }
  const data = JSON.stringify(input);
  sendPostRequest("/videoData", data)
  .then( async function (response) {
    console.log(await response);
    if(response == "database full") {
      alert("Database Full (limit 8 videos)...");
      window.location = "tiktokpets.html";
      return;
    }
    window.location = 'VideoPreview.html';
  })
  .catch( function(err) {
    console.log("POST request error",err);
  });
};

function mainPage() {
  window.location = '/tiktokpets.html';
}

function gotoMyVideos() {
  window.location = 'MyVideos.html';
}