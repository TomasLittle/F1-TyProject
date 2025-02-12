async function createDriverCards() {
  var latestDrivers = await fetchLatestDrivers();

  latestDrivers.forEach(generateDriverCardHtml);
}

async function fetchLatestDrivers() {
  return fetch('https://api.openf1.org/v1/drivers?meeting_key=latest&session_key=latest')
    .then(response => response.json())
    .then(jsonContent => {
      console.log(jsonContent);
      return jsonContent;
    });
}

function generateDriverCardHtml(driver) {
  var divDrivers = document.getElementById("divDrivers");
  var divCardElement = document.createElement("div");

  divCardElement.setAttribute("class", "col cardStyling")
  divCardElement.innerHTML = `
    <div class="card" style="width: 11rem; background-color: transparent; border-color: transparent">
      <img src="${driver.headshot_url}" class="card-img-top">
      <div class="card-body" style="background-color: white; opacity: 90%">
        <h7 class="card-title">${driver.full_name}</h7>      
        <a href="#" class="btn btn-primary">Go somewhere</a>
      </div>
    </div>
  `;

  divDrivers.appendChild(divCardElement);

}


