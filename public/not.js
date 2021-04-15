var v1 = ['Red', 'Bombshell', 'Black', 'Green', 'Yellow', 'Circus', 'Blue', 'Chinchilla', 'Indigo', 'Brown', 'Concocted', 'Turkish', 'Terrible', 'Laughing', 'Orange', 'Purple', 'Pink', 'Surrendered', 'Cheese-colored'];
var v2 = 'NoTube';

var ran = Math.round(Math.random() * 10);
document.title = v1[ran] + ' ' + v2;

//global scope (video id)
let videoLID;


//-----------------------------------------------------------------\\
const socket = io.connect();
let id =  '';

socket.on('connect', (data) => {
  id = socket.id;
  console.log(id);
})

let search;
let scroll=0;
let link = [];

//query
function query() {
  //get query
  search = document.getElementById('search').value;

  //var urlS = 'https://www.youtube.com/results?search_query='+search;

  socket.emit('search', { query: search, id: id });
  console.log(search, id)
  document.body.innerHTML='<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div> <p>Loading... Please wait (web scraping takes a while)</p>';
}

//more data
function more() {
  scroll++;
  socket.emit('more', { query: search, id: id, scrollamount: scroll});
  document.getElementById('morelds').innerHTML='<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>';
}

function relect() {
  //get value
  var select = document.getElementById('select').value;

  document.body.innerHTML = `
  <!-- 1. The <iframe> (and video player) will replace this <div> tag. -->
   <div id="player"></div>

   <iframe src='asdf.html?id=${select}' height='620' width='1020'></iframe>
   <script src='not.js'></script>
 `;
}

//query data
socket.on('results', (data) => {
  document.body.innerHTML = `
    <ul id='results'></ul>
    <form id='selectF'>
      <input id='select' placeholder='Select Index'>
      <input type='submit' value='Watch!' onclick='relect()'>
    </form>

    <button onclick='more()'>More Results</button>
    <div class="lds-roller" id='morelds'></div>
    <script src='not.js'></script>
  `;

  let a = 0;
  console.log(link);
  for (let i=0; i<data.length; i++) {
    if (data[i].includes("https://www.youtube.com/watch?v=")) {
      // var ul = document.getElementById("results");
      // var li = document.createElement("li");
      // li.innerHTML = `<a href='${data[i]}'>${data[i]}</a>`;
      // li.setAttribute("id", "res"); // added line
      // ul.appendChild(li);
      link.push(data[i]);
    } else {
      // try {
      var ul = document.getElementById("results");
      var li = document.createElement("li");
      li.innerHTML = `<a>${data[i]}: ${link[a]}</a>`;
      li.setAttribute("class", "res"); // added line
      ul.appendChild(li);
      a++;
    }
  };
  //console.log(data)
})

socket.on('moreresults', (data)=>{
  var d = document.getElementById('results');
  var link = [];
  let a = 0;

  for (let i=0; i<data.length; i++) {
    if (data[i].includes("https://www.youtube.com/watch?v=")) {
      // var ul = document.getElementById("results");
      // var li = document.createElement("li");
      // li.innerHTML = `<a href='${data[i]}'>${data[i]}</a>`;
      // li.setAttribute("id", "res"); // added line
      // ul.appendChild(li);
      link.push(data[i]);
    } else {
      var li1 = document.createElement("li");
      li1.innerHTML = `<a>${data[i]}: ${link[a]}</a>`;
      li1.setAttribute("class", "res"); // added line
      d.appendChild(li1);
      a++
    }
  };
});

socket.on('queryerr', (data) => {
  console.log(`Error: ${data}`);
});



// link click
// console.log('hi')
// var items = document.querySelectorAll("#results li"),
//     tab = [], index;
//
// //add values to tab
// for (let i=0; i<items.length; i++) {
//   tab.push(items[i].innerHTML);
// }
//
// //add onclick values to li and get their value
// for (let i=0; i<items.length; i++) {
//   console.log('hi');
//   items[i].onclick = function() {
//     var index = tab.indexOf(this.innerHTML);
//     var selected_un = this.innerHTML;
//     //get only the video id
//     var selected = selected_un.substr((selected_un.length-link[index].length), link[index].length);
//     alert(selected);
//
//     document.body.innerHTML = `
//       <!-- 1. The <iframe> (and video player) will replace this <div> tag. -->
//       <div id="player"></div>
//
//       <script>
//         // 2. This code loads the IFrame Player API code asynchronously.
//         var tag = document.createElement('script');
//
//         tag.src = "https://www.youtube.com/iframe_api";
//         var firstScriptTag = document.getElementsByTagName('script')[0];
//         firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
//
//         // 3. This function creates an <iframe> (and YouTube player)
//         //    after the API code downloads.
//         var player;
//         function onYouTubeIframeAPIReady() {
//           player = new YT.Player('player', {
//             height: '390',
//             width: '640',
//             videoId: 'yrqyol4B1RU',
//             events: {
//               'onReady': onPlayerReady,
//               'onStateChange': onPlayerStateChange
//             }
//           });
//         }
//
//         // 4. The API will call this function when the video player is ready.
//         function onPlayerReady(event) {
//           event.target.playVideo();
//         }
//
//         // 5. The API calls this function when the player's state changes.
//         //    The function indicates that when playing a video (state=1),
//         //    the player should play for six seconds and then stop.
//         var done = false;
//         function onPlayerStateChange(event) {
//           if (event.data == YT.PlayerState.PLAYING && !done) {
//             setTimeout(stopVideo, 6000);
//             done = true;
//           }
//         }
//         function stopVideo() {
//           player.stopVideo();
//         }
//       </script>
//     `;
//
//   }
// }


//check for window close to disconnect them
window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  socket.emit('disconnected', ID);
});
