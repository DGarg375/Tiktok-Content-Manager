getRequest();

let gotoCompare = document.getElementById("playgame");
gotoCompare.addEventListener("click", compareVideos);

let button1 = document.getElementById("newvideo");
button1.addEventListener("click",buttonPress);

let button2 = document.getElementById("playgame");

let deleteButton1 = document.getElementById("delete_button1");
deleteButton1.addEventListener("click", buttonDelete1);

let deleteButton2 = document.getElementById("delete_button2");
deleteButton2.addEventListener("click", buttonDelete2);

let deleteButton3 = document.getElementById("delete_button3");
deleteButton3.addEventListener("click", buttonDelete3);

let deleteButton4 = document.getElementById("delete_button4");
deleteButton4.addEventListener("click", buttonDelete4);

let deleteButton5 = document.getElementById("delete_button5");
deleteButton5.addEventListener("click", buttonDelete5);

let deleteButton6 = document.getElementById("delete_button6");
deleteButton6.addEventListener("click", buttonDelete6);

let deleteButton7 = document.getElementById("delete_button7");
deleteButton7.addEventListener("click", buttonDelete7);

let deleteButton8 = document.getElementById("delete_button8");
deleteButton8.addEventListener("click", buttonDelete8);

async function getList(url) {
  params = {
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
  }
  console.log("about to send get request");

  let response = await fetch(url, params);
  if(response.ok) {
    let data2 = await response.json();
    return data2;
  }
  else {
    throw Error(response.status);
  }
}

async function deleteRequest(url, data) {
	params = {
		method: 'POST',
		headers: {'Content-Type': 'text/plain'},
		body: data
	};
	console.log("Sending Delete request...");
	let response = await fetch(url, params);
	if(response.ok) {
		let data = await response.text();
		return data;
	}
	else {
		throw Error(response.status);
	}
}

async function getRequest () {
  getList("/getList")
  .then(async function(response) {
    console.log(await response);
    layout(await response);
    if(response.length >= 8) {
      button1.disabled = true;
      button2.disabled = false;
      button1.style.opacity = "0.5";
    }
    else {
      button1.disabled = false;
      button2.disabled = true;
      button2.style.opacity = "0.5";
    }
  })
  .catch(function(err){
    console.log("GET request error", err);
  });
}

function buttonPress() {
  window.location = 'tiktokpets.html';
}

function layout(response) {
  let boxLayout = document.getElementsByClassName("video_text_box");
  for(let i = 1; i <= response.length; ++i)  {
    let boxElmt = document.getElementById(`video${i}_div`);
    boxElmt.innerText = `${response[i-1].nickname}`;
    boxLayout[i-1].style.border="1.5px solid grey";
  }
}

function buttonDelete1() {
  let box1 = document.getElementById("video1_div");
  let boxText1 = box1.innerText;
  deleteRequest("/deleteData",boxText1)
  .then(function(response) {
    window.location = 'MyVideos.html';
    console.log(response);
  })
  .catch(function(err) {
    console.log(err);
  });
}

function buttonDelete2() {
  let box2 = document.getElementById("video2_div");
  let boxText2 = box2.innerText;
  deleteRequest("/deleteData",boxText2)
  .then(function(response) {
    window.location = 'MyVideos.html';
    console.log(response);
  })
  .catch(function(err) {
    console.log(err);
  });
}

function buttonDelete3() {
  let box3 = document.getElementById("video3_div");
  let boxText3 = box3.innerText;
  deleteRequest("/deleteData",boxText3)
  .then(function(response) {
    window.location = 'MyVideos.html';
    console.log(response);
  })
  .catch(function(err) {
    console.log(err);
  });
}

function buttonDelete4() {
  let box4 = document.getElementById("video4_div");
  let boxText4 = box4.innerText;
  deleteRequest("/deleteData",boxText4)
  .then(function(response) {
    window.location = 'MyVideos.html';
    console.log(response);
  })
  .catch(function(err) {
    console.log(err);
  });
}

function buttonDelete5() {
  let box5 = document.getElementById("video5_div");
  let boxText5 = box5.innerText;
  deleteRequest("/deleteData",boxText5)
  .then(function(response) {
    window.location = 'MyVideos.html';
    console.log(response);
  })
  .catch(function(err) {
    console.log(err);
  });
}

function buttonDelete6() {
  let box6 = document.getElementById("video6_div");
  let boxText6 = box6.innerText;
  deleteRequest("/deleteData",boxText6)
  .then(function(response) {
    window.location = 'MyVideos.html';
    console.log(response);
  })
  .catch(function(err) {
    console.log(err);
  });
}

function buttonDelete7() {
  let box7 = document.getElementById("video7_div");
  let boxText7 = box7.innerText;
  deleteRequest("/deleteData",boxText7)
  .then(function(response) {
    window.location = 'MyVideos.html';
    console.log(response);
  })
  .catch(function(err) {
    console.log(err);
  });
}

function buttonDelete8() {
  let box8 = document.getElementById("video8_div");
  let boxText8 = box8.innerText;
  deleteRequest("/deleteData",boxText8)
  .then(function(response) {
    window.location = 'MyVideos.html';
    console.log(response);
  })
  .catch(function(err) {
    console.log(err);
  });
}

function compareVideos() {
  window.location = "compare.html";
}