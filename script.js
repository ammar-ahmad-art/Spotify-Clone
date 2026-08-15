let songs = [];
let currentsong = new Audio();

// Function to Fetch songs from the folder
async function Songsfetch(lnk) {
    songs.length = 0;
    let fetches = await fetch("http://127.0.0.1:5500/songs/" + lnk);
    let text = await fetches.text();

    let div = document.createElement("div");
    div.innerHTML = text;
    let ass = div.getElementsByTagName("a");
    for (let index = 0; index < ass.length; index++) {
        const element = ass[index];
        if (element.href.endsWith(".mp3")) {
            let name = element.textContent.trim();
            name = name.split(".")[0];
            songs.push(name);
        }
    }
    Songsdisplay(songs);
}

// Function to Display songs in the Library
async function Songsdisplay(songs) {
    let songsli = document.querySelector(".songslist ul");
    songsli.innerHTML = "";
    for (const song of songs) {
        songsli.innerHTML += ` <li>
        <img src="music.svg" alt="">
        <p>${song}</p>
        </li> `;
    }
}

// Function to play Songs
async function Songplayer(lnk) {
    document.querySelectorAll(".songslist li").forEach((e) => {
        e.addEventListener("click", () => {
            let Select = e.querySelector("p").innerText;
            Select += ".mp3";
            currentsong.src = "http://127.0.0.1:5500/songs/" + lnk + "/" + Select;
            currentsong.play();
        });
    });
}

// Function to fetch folder from songs
async function Foldersfetch() {
    let folders = await fetch("http://127.0.0.1:5500/songs/");
    let folderstxt = await folders.text();
    let div = document.createElement("div");
    div.innerHTML = folderstxt;
    let foldersname = [];
    let fd = div.querySelectorAll("a");
    fd.forEach((e) => {
        fd = e.innerText;
        fd = fd.replace("/", "");
        fd = fd.split("/")[0].replace("815", "");
        foldersname.push(fd);
    });
    return foldersname;
}

async function showf(fd) {
    let show = document.querySelector(".left .cards");
    for (const element of fd) {
        if (element === ".." || element === "songs" || element === "~") continue;
        show.innerHTML += `<div class="card">
                    <img src="covers/${element}.jpg" alt="">
                    <p>${element}</p> </div>`;
    }
}

async function Folder() {
    let fd = await Foldersfetch();
    let showfolder = await showf(fd);

    let lnk;
    document.querySelectorAll(".cards .card").forEach((e) => {
        e.addEventListener("click", () => {
            lnk = e.querySelector("p").innerText;
            lnk = lnk.split("7");
            lnk = lnk[0];
            Main(lnk);
            async function Main(lnk) {
                let songs = await Songsfetch(lnk);
                let Select = await Songplayer(lnk);
            }
        });
    });
}
Folder();

// Event Listener to play/pause the song
document.querySelector(".playbar .play").addEventListener("click", () => {
    if (currentsong.paused) {
        currentsong.play();
    } else {
        currentsong.pause();
    }
});

// Volume Change
const volume = document.querySelector(".volume");
volume.addEventListener("input", (e) => {
    currentsong.volume = e.target.value / 100;
});

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


 // Listen for timeupdate event
    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songinfo").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`
    })


