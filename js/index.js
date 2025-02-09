async function onLoad() {
  var btnDrivers = document.getElementById('btnDrivers');
  btnDrivers.disabled = true;

  const tracks = await this.fetchTracks();
  populateDdlTracks(tracks);
}

function populateDdlTracks(tracks) {
  var ddlTracks = document.getElementById('ddlTracks');
  
  tracks.forEach(track => {
    var listItem = document.createElement('li');    

    listItem.classList.add("dropdown-item");
    listItem.innerText = track.circuit_short_name;
    listItem.onclick = () => this.populateDdlDrivers(track.circuit_short_name, track.session_key);

    ddlTracks.appendChild(listItem);
  });
}

async function fetchTracks() {
  return fetch('https://api.openf1.org/v1/sessions?session_name=Race&year=2024')
    .then(response => response.json())
    .then(jsonContent => {
      console.log(jsonContent);
      return jsonContent;
    });        
}

async function populateDdlDrivers(trackName, session_key) {
  console.log(trackName, session_key);
  
  var drivers = await this.fetchDrivers(session_key);
  var ddlDrivers = document.getElementById('ddlDrivers');

  drivers.forEach(driver => {
    var listItem = document.createElement('li');    

    listItem.classList.add("dropdown-item");
    listItem.innerText = driver.first_name + " " + driver.last_name;

    //These on click events are not ideal.
    listItem.onclick = () => this.generateResults(driver.driver_number, session_key);

    ddlDrivers.appendChild(listItem);
  });

  var btnDrivers = document.getElementById('btnDrivers');
  btnDrivers.disabled = false;
}

async function fetchDrivers(session_key) {
  return fetch('https://api.openf1.org/v1/drivers?session_key=' + session_key)
    .then(response => response.json())
    .then(jsonContent => {
      console.log(jsonContent);
      return jsonContent;
    });
}

async function generateResults(driver_number, session_key) {
  var fastestLap = getFastestLap(driver_number, session_key);

  var driverInfo = fetchDriverInfo(driver_number, session_key);
  var trackInfo = fetchTrackInfo(session_key);

  createHtml(driverInfo, trackInfo, fastestLap);
}

async function getFastestLap(driver_number, session_key) {
  const laps = fetchFastestLap(driver_number, session_key)

  var fastestLap = null;

  laps.forEach(lap => {
    if (lap.lap_duration < fastestLap) {
      fastestLap = lap.lap_duration;
    } else if (fastestLap == null) {
      fastestLap = lap.lap_duration;
    }
  });

  return fastestLap;
}

async function fetchFastestLap(driver_number, session_key) {
  return await fetch('https://api.openf1.org/v1/drivers?driver_number=' + driver_number + '&session_key=' + session_key)
    .then(response => response.json())
    .then(jsonContent => {
      console.log(jsonContent);
      return jsonContent;
    });
}