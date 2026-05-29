 // =========================
// SERVICE WORKER
// =========================
if ("serviceWorker" in navigator) {

  window.addEventListener("load", () => {

    navigator.serviceWorker
      .register("service-worker.js")

      .then(() => {
        console.log("Service Worker Registered");
      });

  });

}
// =========================
// GLOBAL VARIABLES
// =========================

let userLatitude = null;
let userLongitude = null;

let placeName = "Unknown Location";

let completeServicesHTML = "";

let hospitalServicesHTML = "";
let policeServicesHTML = "";
let roadsideServicesHTML = "";
let nearbyHospitals = [];
const savedEmergency =

JSON.parse(
  localStorage.getItem(
    "lastEmergency"
  )
);

// =========================
// INTERNET STATUS
// =========================

function updateInternetStatus() {

  const statusBox =
    document.getElementById("offlineStatus");

  if (navigator.onLine) {

    statusBox.innerHTML =
      "🟢 Online Mode Active";

    statusBox.className =
      "online-mode";
  }

  else {

    statusBox.innerHTML =
      "🔴 Offline Emergency Mode Activated";

    statusBox.className =
      "offline-mode";
  }
}

window.addEventListener(
  "online",
  updateInternetStatus
);

window.addEventListener(
  "offline",
  updateInternetStatus
);

updateInternetStatus();

// =========================
// AI VOICE ALERT
// =========================

function speakAlert(message) {

  const speech =
    new SpeechSynthesisUtterance(message);

  speech.lang = "en-US";

  speech.volume = 1;

  speech.rate = 1;

  speech.pitch = 1;

  window.speechSynthesis.speak(speech);
}

// =========================
// LIVE GPS LOCATION
// =========================

navigator.geolocation.getCurrentPosition(

  async (position) => {

    userLatitude = position.coords.latitude;
    userLongitude = position.coords.longitude;
    localStorage.setItem(
  "lastLatitude",
  userLatitude
);

localStorage.setItem(
  "lastLongitude",
  userLongitude
);

    try {

      // =========================
      // REVERSE GEOCODING
      // =========================

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLatitude}&lon=${userLongitude}`
      );

      const data = await response.json();

      placeName = data.display_name;
      localStorage.setItem(
  "lastLocationName",
  placeName
);
  // =========================
// HOSPITALS
// =========================

try {

  const hospitalResponse = await fetch(

    `https://overpass-api.de/api/interpreter?data=
    [out:json];
    (
      node["amenity"="hospital"]
      (around:5000,${userLatitude},${userLongitude});
    );
    out;`

  );

  const hospitalData =
    await hospitalResponse.json();
    console.log(hospitalData);

  nearbyHospitals =
    hospitalData.elements;

  let hospitalHTML = `

  <div class="status-card">

  <h2>
  🏥 Nearby Hospitals
  </h2>

  `;

  if (
    hospitalData.elements.length === 0
  ) {

    hospitalHTML += `

    <p>
    🏥 Emergency Medical Center
    </p>

    <p>
    📞 Ambulance: 108
    </p>

    `;

  }

  else {

    hospitalData.elements
      .slice(0, 5)
      .forEach(hospital => {

        hospitalHTML += `

        <p>

        <a
        href="https://www.google.com/maps?q=${hospital.lat},${hospital.lon}"
        target="_blank"
        style="color:#60a5fa; text-decoration:none;"
        >

        🏥
        ${hospital.tags.name
          || "Nearby Hospital"}

        </a>

        </p>

        `;

      });

  }

  hospitalHTML += `</div>`;

  hospitalServicesHTML =
    hospitalHTML;

}

catch(error) {

  hospitalServicesHTML = `

  <div class="status-card">

  <h2>
  🏥 Emergency Medical Support
  </h2>

  <p>
  🏥 Nearby hospitals unavailable
  </p>

  <p>
  📞 Ambulance Number: 108
  </p>

  </div>

  `;

}
    // =========================
// POLICE
// =========================

try {

  const policeResponse = await fetch(

    `https://overpass-api.de/api/interpreter?data=
    [out:json];
    (
      node["amenity"="police"]
      (around:5000,${userLatitude},${userLongitude});
    );
    out;`

  );

  const policeData =
    await policeResponse.json();

  let policeHTML = `

  <div class="status-card">

  <h2>
  🚓 Nearby Police Stations
  </h2>

  `;

  if (
    policeData.elements.length === 0
  ) {

    policeHTML += `

    <p>
    🚓 Local Police Control Room
    </p>

    <p>
    📞 Emergency Number: 100
    </p>

    `;

  }

  else {

    policeData.elements
      .slice(0, 5)
      .forEach(police => {

        policeHTML += `

        <p>
        <a
href="https://www.google.com/maps?q=${police.lat},${police.lon}"
target="_blank"
style="color:#60a5fa; text-decoration:none;"
>

🚓
${police.tags.name
  || "Police Station"}

</a>

       

        </p>

        `;
        

      });

  }

  policeHTML += `</div>`;

  policeServicesHTML =
    policeHTML;

}

catch(error) {

  policeServicesHTML = `

  <div class="status-card">

  <h2>
  🚓 Emergency Police Support
  </h2>

  <p>
  🚓 Nearby police unavailable
  </p>

  <p>
  📞 Call Emergency: 100
  </p>

  </div>

  `;

}

     
// =========================
// VEHICLE SERVICES
// =========================

try {

  const roadsideResponse = await fetch(

    `https://overpass-api.de/api/interpreter?data=
    [out:json];
    (
      node["shop"="car_repair"]
      (around:5000,${userLatitude},${userLongitude});

      node["shop"="motorcycle"]
      (around:5000,${userLatitude},${userLongitude});
    );
    out;`

  );

  const roadsideData =
    await roadsideResponse.json();

  let roadsideHTML = `

  <div class="status-card">

  <h2>
  🔧 Vehicle Recovery & Repair
  </h2>

  `;

  if (
    roadsideData.elements.length === 0
  ) {

    roadsideHTML += `

    <p>
    🔧 Emergency Roadside Assistance
    </p>

    <p>
    📞 Helpline Support Available
    </p>

    `;

  }

  else {

    roadsideData.elements
      .slice(0, 6)
      .forEach(service => {

        roadsideHTML += `

        <p>

        <a
        href="https://www.google.com/maps?q=${service.lat},${service.lon}"
        target="_blank"
        style="color:#60a5fa; text-decoration:none;"
        >

        🔧
        ${service.tags.name
          || "Vehicle Repair Shop"}

        </a>

        </p>

        `;

      });

  }

  roadsideHTML += `</div>`;

  roadsideServicesHTML =
    roadsideHTML;

}

catch(error) {

  roadsideServicesHTML = `

  <div class="status-card">

  <h2>
  🔧 Emergency Vehicle Assistance
  </h2>

  <p>
  🔧 Nearby repair services unavailable
  </p>

  <p>
  📞 Roadside emergency support active
  </p>

  </div>

  `;

}

      // =========================
      // COMPLETE HTML
      // =========================

      completeServicesHTML =

        hospitalServicesHTML +

        policeServicesHTML +

        roadsideServicesHTML;

      // =========================
      // LOCATION UI
      // =========================
    const savedLocationName =

  localStorage.getItem(
    "lastLocationName"
  );
      document.getElementById("locationBox").innerHTML = `

      📍 <strong>Location Detected</strong><br><br>

      🏠 ${placeName}<br><br>

      🌍 Latitude:
      ${userLatitude.toFixed(4)}<br>

      🌍 Longitude:
      ${userLongitude.toFixed(4)}

      `;

      // =========================
      // GOOGLE MAP BUTTON
      // =========================

      document.getElementById("mapButtonContainer").innerHTML = `

      <a
      href="https://www.google.com/maps?q=${userLatitude},${userLongitude}"
      target="_blank"
      class="map-btn"
      >

      🗺 Open in Google Maps

      </a>

      `;

    }

    catch(error) {
      const savedLocationName =

localStorage.getItem(
  "lastLocationName"
);

const savedLat =
  localStorage.getItem("lastLatitude");

const savedLon =
  localStorage.getItem("lastLongitude");

document.getElementById("locationBox").innerHTML = `

⚠ Offline Emergency Mode

<br><br>

📍 Last Known Location

<br><br>

${savedLocationName || "Unavailable"}

<br><br>

🌍 Latitude:
${savedLat || "Unavailable"}

<br><br>

🌍 Longitude:
${savedLon || "Unavailable"}

`;

}

  },

  (error) => {

  console.log(
    "GPS Permission Error:",
    error
  );

  document.getElementById(
    "locationBox"
  ).innerHTML = `

  ⚠ GPS Permission Needed

  <br><br>

  Please allow location access in browser settings

  `;

},

  {
    enableHighAccuracy: false,
timeout: 5000,
maximumAge: 60000
  }

);

// =========================
// MAIN APP
// =========================

window.onload = function() {
  if (savedEmergency) {

  document.getElementById(
    "result"
  ).innerHTML = `

  <div class="status-card">

  <h3 class="alert">
  ⚠ Last Emergency Record
  </h3>

  <p>
  <strong>Time:</strong>
  ${savedEmergency.time}
  </p>

  <p>
  <strong>Severity:</strong>
  ${savedEmergency.severity}
  </p>

  <p>
  <strong>Location:</strong>
  ${savedEmergency.location}
  </p>

  </div>

  `;
}

  // =========================
  // NOTIFICATION PERMISSION
  // =========================

  if ("Notification" in window) {

    Notification.requestPermission();

  }

  // =========================
  // SPEAK ALERT
  // =========================

  function speakAlert(message) {

    const speech =
      new SpeechSynthesisUtterance(message);

    speech.lang = "en-US";

    speech.rate = 1;

    speech.pitch = 1;

    speech.volume = 1;

    window.speechSynthesis.speak(speech);

  }

  // =========================
  // SHOW NOTIFICATION
  // =========================

  function showNotification(title, body) {

    if (Notification.permission === "granted") {

      new Notification(title, {

        body: body,

        icon:
"https://cdn-icons-png.flaticon.com/512/565/565547.png"

      });

    }

  }

  // =========================
  // EMERGENCY SMS
  // =========================

  function generateEmergencySMS(contactName) {

    const smsHTML = `

    <div class="sms-card">

    <h3>
    📩 Emergency Alert Sent
    </h3>

    <p>
    <strong>To:</strong>
    ${contactName}
    </p>

    <p>

    🚨 Possible accident detected.

    📍 ${placeName}

    🗺 https://www.google.com/maps?q=${userLatitude},${userLongitude}

    Emergency assistance activated.

    </p>

    </div>

    `;

    document.getElementById("smsPreview").innerHTML =
      smsHTML;

  }

  // =========================
  // CONTACT STORAGE
  // =========================

  let savedContacts =

    JSON.parse(
      localStorage.getItem("safeSyncContacts")
    ) || [];

  // =========================
  // DISPLAY CONTACTS
  // =========================

  function displayContacts() {

    let contactsHTML = "";

    savedContacts.forEach((contact, index) => {

      contactsHTML += `

      <div class="status-card">

      <p>
      👤 ${contact.name}
      </p>

      <p>
      📞 ${contact.number}
      </p>

      <button onclick="editContact(${index})">
      Edit
      </button>

      <button onclick="deleteContact(${index})">
      Delete
      </button>

      </div>

      `;

    });

    document.getElementById("savedContacts").innerHTML =
      contactsHTML;

  }

  displayContacts();

  // =========================
  // DELETE CONTACT
  // =========================

  window.deleteContact = function(index) {

    let enteredPin =
      prompt("Enter your security PIN");

    if (
      enteredPin !== savedContacts[index].pin
    ) {

      alert("Incorrect PIN");

      return;

    }

    savedContacts.splice(index, 1);

    localStorage.setItem(

      "safeSyncContacts",

      JSON.stringify(savedContacts)

    );

    displayContacts();

    alert("Contact Deleted");

  };

  // =========================
  // EDIT CONTACT
  // =========================

  window.editContact = function(index) {

    let enteredPin =
      prompt("Enter your security PIN");

    if (
      enteredPin !== savedContacts[index].pin
    ) {

      alert("Incorrect PIN");

      return;

    }

    let newName = prompt(
      "Edit Contact Name",
      savedContacts[index].name
    );

    let newNumber = prompt(
      "Edit Phone Number",
      savedContacts[index].number
    );

    if (newName && newNumber) {

      savedContacts[index].name =
        newName;

      savedContacts[index].number =
        newNumber;

      localStorage.setItem(

        "safeSyncContacts",

        JSON.stringify(savedContacts)

      );

      displayContacts();

      alert("Contact Updated");

    }

  };

  // =========================
  // SAVE CONTACT
  // =========================

  document.getElementById("saveContactBtn").onclick =
    function() {

      const name =
        document.getElementById("contactName").value;

      const number =
        document.getElementById("contactNumber").value;

      let pin =
        prompt("Create a 4-digit security PIN");

      if (!name || !number || !pin) {

        alert("Please enter all details");

        return;

      }

      savedContacts.push({

        name: name,
        number: number,
        pin: pin

      });

      localStorage.setItem(

        "safeSyncContacts",

        JSON.stringify(savedContacts)

      );

      displayContacts();

      document.getElementById("contactName").value = "";
      document.getElementById("contactNumber").value = "";

      alert("Contact Saved Successfully");

    };

  // =========================
  // DRIVING MODE
  // =========================

  let drivingActive = false;

  let drivingInterval = null;

  document.getElementById("driveBtn").onclick =
    function() {

      if (!drivingActive) {

        drivingActive = true;

        document.getElementById("driveBtn").innerHTML =
          "🛑 Stop Driving Mode";

        document.getElementById("result").innerHTML = `

        <div class="status-card">

        <h3 class="info">
        🚗 Driving Mode Activated
        </h3>

        <p id="liveSpeed">
        Current Speed: 0 km/h
        </p>

        </div>

        `;

        drivingInterval = setInterval(function() {

          let drivingStates = [

            0, 0, 10,
            20, 35, 50,
            65, 82, 95

          ];

          if (!window.speedIndex) {

            window.speedIndex = 0;

          }

          if (
            window.speedIndex >=
            drivingStates.length
          ) {

            window.speedIndex = 0;

          }

          let liveSpeed =
            drivingStates[window.speedIndex];

          window.speedIndex++;
          let vehicleStatus = "";
let driverState = "";

if (liveSpeed === 0) {

  vehicleStatus =
    "🚘 Vehicle Parked";

  driverState =
    "Driver Resting";
}

else if (liveSpeed < 30) {

  vehicleStatus =
    "🚦 Slow Traffic";

  driverState =
    "Driver Calm";
}

else if (liveSpeed < 70) {

  vehicleStatus =
    "🛣 Normal Driving";

  driverState =
    "Driver Focused";
}

else {

  vehicleStatus =
    "⚠ High Speed Detected";

  driverState =
    "⚠ Driver Stress Risk";

  speakAlert(
    "Warning. High speed detected. Please drive carefully."
  );
}

document.getElementById("liveSpeed").innerHTML =

`
Current Speed:
${liveSpeed} km/h

<br><br>

<strong>Status:</strong>
${vehicleStatus}

<br><br>

<strong>Driver State:</strong>
${driverState}
`;


        }, 2000);

      }

      else {

        clearInterval(drivingInterval);

        drivingActive = false;

        document.getElementById("driveBtn").innerHTML =
          "🚗 Start Driving Mode";

      }

    };
    // =========================
// VOICE ASSISTANT
// =========================

const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;

if (SpeechRecognition) {

  const recognition =
    new SpeechRecognition();

  recognition.lang = "en-US";

  recognition.continuous = false;

  recognition.interimResults = false;

  document.getElementById("voiceBtn").onclick =
    function() {

      recognition.start();

      document.getElementById("result").innerHTML = `

      <div class="status-card">

      <h3 class="info">
      🎤 Listening...
      </h3>

      <p>
      Speak your emergency request
      </p>

      </div>

      `;
    };

  recognition.onresult = function(event) {

    const command =
      event.results[0][0].transcript.toLowerCase();

    // =========================
    // HOSPITAL COMMAND
    // =========================

    if (command.includes("hospital")) {

      speakAlert(
        "Showing nearby hospitals"
      );

      document.getElementById("result").innerHTML = `

      <div class="status-card">

      <h3 class="alert">
      🏥 Nearby Hospitals
      </h3>

      ${hospitalServicesHTML}

      </div>

      `;
    }

    // =========================
    // POLICE COMMAND
    // =========================

    else if (command.includes("police")) {

      speakAlert(
        "Showing nearby police stations"
      );

      document.getElementById("result").innerHTML = `

      <div class="status-card">

      <h3 class="alert">
      🚓 Nearby Police Stations
      </h3>

      ${policeServicesHTML}

      </div>

      `;
    }

    // =========================
    // MECHANIC COMMAND
    // =========================

    else if (
      command.includes("mechanic") ||
      command.includes("repair")
    ) {

      speakAlert(
        "Showing nearby repair services"
      );

      document.getElementById("result").innerHTML = `

      <div class="status-card">

      <h3 class="alert">
      🔧 Nearby Vehicle Services
      </h3>

      ${roadsideServicesHTML}

      </div>

      `;
    }

    // =========================
    // EMERGENCY COMMAND
    // =========================

    else if (
      command.includes("emergency") ||
      command.includes("help")
    ) {

      speakAlert(
        "Emergency assistance activated"
      );

      document.getElementById("result").innerHTML = `

      <div class="status-card">

      <h3 class="alert">
      🚨 Emergency Assistance Activated
      </h3>

      ${completeServicesHTML}

      </div>

      `;
    }

    // =========================
    // UNKNOWN COMMAND
    // =========================

    else {

      speakAlert(
        "Command not recognized"
      );

      document.getElementById("result").innerHTML = `

      <div class="status-card">

      <h3 class="alert">
      ❌ Command Not Recognized
      </h3>

      <p>
      Try saying:
      </p>

      <ul>

      <li>Find hospital</li>

      <li>Call police</li>

      <li>Need mechanic</li>

      <li>Emergency help</li>

      </ul>

      </div>

      `;
    }

  };

}

else {

  alert(
    "Speech Recognition not supported in this browser"
  );

}

  // =========================
  // ACCIDENT HISTORY
  // =========================

  let accidentHistory = [];
  // =========================
// ANALYTICS VARIABLES
// =========================

let totalAccidents = 0;

let criticalCases = 0;

let mediumCases = 0;

let lowCases = 0;
  // =========================
  // =========================
// MANUAL EMERGENCY BUTTON
// =========================

document.getElementById("manualBtn").onclick =
  function() {

    speakAlert(
      "Manual emergency SOS activated"
    );

    showNotification(
      "🚨 Emergency SOS",
      "Manual emergency assistance activated"
    );

    let emergencyContact =

      savedContacts.length > 0

      ?

      savedContacts[0]

      :

      {
        name: "No Contact Saved",
        number: "Add Contact"
      };

    document.getElementById("result").innerHTML = `

    <div class="status-card">

    <h3 class="alert">
    🚨 Manual Emergency SOS Activated
    </h3>

    <p>
    <strong>Location:</strong>
    ${placeName}
    </p>

    <p class="info">
    📍 Live GPS location shared
    </p>

    <p class="info">
    🚑 Ambulance assistance notified
    </p>

    <p class="info">
    🚓 Police assistance notified
    </p>

    <p class="info">
    📞 Emergency contact informed
    </p>

    <p>
    <strong>Emergency Contact:</strong>
    ${emergencyContact.name}
    </p>

    <br>

    <a href="tel:108">
    <button>
    🚑 Call Ambulance
    </button>
    </a>

    <a href="tel:100">
    <button>
    🚓 Call Police
    </button>
    </a>

    <a href="tel:${emergencyContact.number}">
    <button>
    📞 Call Contact
    </button>
    </a>

    <hr>

    ${completeServicesHTML}

    </div>

    `;

    generateEmergencySMS(
      emergencyContact.name
    );
const emergencyData = {

  time:
    new Date().toLocaleString(),

  severity:
    severity,

  location:
    placeName,

  latitude:
    userLatitude,

  longitude:
    userLongitude,

  hospital:
    selectedHospital.name,

  riskScore:
    riskScore,

  driverCondition:
    driverCondition

};

localStorage.setItem(
  "lastEmergency",
  JSON.stringify(emergencyData)
);

  };

  // =========================
  // HOSPITAL DATABASE
  // =========================

  const hospitals = [

    {
      name: "Apollo Trauma Center",
      type: "Critical Care",
      distance: "2 km"
    },

    {
      name: "City Emergency Hospital",
      type: "Emergency",
      distance: "4 km"
    },

    {
      name: "GreenLife Clinic",
      type: "Basic Care",
      distance: "1.5 km"
    }

  ];

  // =========================
  // ACCIDENT BUTTON
  // =========================

  document.getElementById("accidentBtn").onclick =
    function() {
      let currentHour = new Date().getHours();
      let nightRisk = false;

if (
  currentHour >= 22 ||
  currentHour <= 5
) {
  nightRisk = true;
}
      let speed =
        Math.floor(Math.random() * 100) + 20;

      let impact =
        Math.floor(Math.random() * 10) + 1;

      let tilt =
        Math.floor(Math.random() * 90);

      let emergencyContact =

        savedContacts.length > 0

        ?

        savedContacts[
          Math.floor(
            Math.random() *
            savedContacts.length
          )
        ]

        :

        {
          name: "No Contact Saved",
          number: "Add Contact"
        };

      let severity = "";
      let severityClass = "";
      let riskScore = 0;
      let recommendation = "";
      // =========================
// AI DRIVER CONDITION
// =========================

let driverCondition = "";

let fatigueChance =
  Math.floor(Math.random() * 100);

if (fatigueChance > 75) {

  driverCondition =
    "😴 Driver fatigue detected";

}

else if (fatigueChance > 50) {

  driverCondition =
    "⚠ Driver stress detected";

}

else {

  driverCondition =
    "✅ Driver condition normal";

}

      if (
        (speed > 80 && impact > 6) ||
        (impact > 8 && tilt > 60)
      ) {


        severity = "Critical";

        severityClass = "critical";

        riskScore =
          Math.floor(Math.random() * 10) + 90;

        recommendation =
          "Critical accident detected.";

      }

      else if (
        speed > 40 ||
        impact > 4 ||
        tilt > 45
      ) {

        severity = "Medium";

        severityClass = "medium";

        riskScore =
          Math.floor(Math.random() * 20) + 60;

        recommendation =
          "Medical observation recommended.";

      }

      else {

        severity = "Low";

        severityClass = "low";

        riskScore =
          Math.floor(Math.random() * 30) + 30;

        recommendation =
          "Minor impact detected.";

      }

      speakAlert(

        `${severity} accident detected.
        ${recommendation}`

      );

      showNotification(

        "🚨 SafeSync AI Alert",

        `${severity} accident detected`

      );
      let selectedHospital = {

  name: "Offline Emergency Hospital"

};

if (nearbyHospitals.length > 0) {

  let nearestHospital =
    nearbyHospitals[0];

  let shortestDistance =
    Infinity;

  nearbyHospitals.forEach(hospital => {

    const distance = Math.sqrt(

      Math.pow(
        hospital.lat - userLatitude,
        2
      ) +

      Math.pow(
        hospital.lon - userLongitude,
        2
      )

    );

    if (distance < shortestDistance) {

      shortestDistance =
        distance;

      nearestHospital =
        hospital;

    }

  });
selectedHospital = {

  name:
    nearestHospital.tags.name
    || "Nearby Hospital",

  lat:
    nearestHospital.lat || userLatitude,

  lon:
    nearestHospital.lon || userLongitude

};
 

}
     
// =========================
// UPDATE ANALYTICS
// =========================

totalAccidents++;

if (severity === "Critical") {

  criticalCases++;

}

else if (severity === "Medium") {

  mediumCases++;

}

else {

  lowCases++;

}

document.getElementById("analyticsBox").innerHTML = `

<p>
Total Accidents:
${totalAccidents}
</p>

<p>
Critical Cases:
${criticalCases}
</p>

<p>
Medium Cases:
${mediumCases}
</p>

<p>
Low Cases:
${lowCases}
</p>

`;

      accidentHistory.unshift({

        severity: severity,
        location: placeName

      });

      let historyHTML = `

      <hr>

      <h3>
      📊 Recent Accident History
      </h3>

      `;

      accidentHistory.forEach(function(item, index) {

        historyHTML += `

        <p>

        ${index + 1}.
        ${item.severity}
        -
        ${item.location}

        </p>

        `;

      });

      document.getElementById("result").innerHTML = `

      <div class="status-card">

      <h3 class="alert">
      🚨 Possible Accident Detected
      </h3>

      <p>
      <strong>Vehicle Speed:</strong>
      ${speed} km/h
      </p>

      <p>
      <strong>Impact Force:</strong>
      ${impact}/10
      </p>

      <p>
      <strong>Location:</strong>
      ${placeName}
      </p>

      <p>
      <strong>Severity:</strong>

      <span class="${severityClass}">
      ${severity}
      </span>
      </p>

      <p>
      <strong>AI Recommendation:</strong>
      ${recommendation}
      </p>
      <p>

<strong>AI Safety Tip:</strong>

${severity === "Critical"

? "🚑 Stay still and wait for emergency responders."

: severity === "Medium"

? "⚠ Move to a safe roadside area and seek medical observation."

: "✅ Minor impact detected. Drive carefully and monitor vehicle condition."

}

</p>

      <p>
      <strong>Risk Score:</strong>
      ${riskScore}%
      </p>
      
      <p>
<strong>AI Confidence:</strong>
${Math.floor(Math.random() * 20) + 80}%
</p>
      <p>
<strong>AI Driver Analysis:</strong>

${nightRisk
  ? "🌙 Night driving risk detected"
  : "☀ Safe daylight driving"}
</p>
<p>
<strong>AI Safety Status:</strong>

${
  riskScore > 80
  ? "🔴 High Risk Driving"
  : riskScore > 50
  ? "🟠 Moderate Risk"
  : "🟢 Safe Driving"
}

</p>


     <p>

<strong>
Recommended Hospital:
</strong>

<a
href="https://www.google.com/maps?q=${selectedHospital.lat},${selectedHospital.lon}"
target="_blank"
style="
color:#60a5fa;
text-decoration:none;
font-weight:bold;
"
>

${selectedHospital.name}

</a>

</p>

      <p>
      <strong>Emergency Contact:</strong>
      ${emergencyContact.name}
      </p>

      <p id="countdownText">
      🚨 Sending emergency alert in
<span id="timer">10</span>
seconds...
      </p>

      <button id="cancelBtn">
      I'm Safe
      </button>

      <br><br>

      <a href="tel:108">
      <button>
      🚑 Call Ambulance
      </button>
      </a>

      <a href="tel:100">
      <button>
      🚓 Call Police
      </button>
      </a>

      <a href="tel:${emergencyContact.number}">
      <button>
      📞 Call Contact
      </button>
      </a>

      <hr>

      ${completeServicesHTML}

      ${historyHTML}
      <hr>

<button id="downloadReportBtn">

📄 Download Incident Report

</button>

      </div>

      `;

      generateEmergencySMS(
        emergencyContact.name
      );
      let seconds = 10;

const timerInterval =
setInterval(() => {

  seconds--;

  const timerElement =
    document.getElementById("timer");

  if (timerElement) {

    timerElement.innerHTML =
      seconds;

  }

  if (seconds <= 0) {

    clearInterval(timerInterval);

    speakAlert(
      "Emergency alert sent successfully."
    );

    showNotification(
      "🚨 SOS SENT",
      "Emergency services notified"
    );

  }

}, 1000);

// =========================
// CANCEL SOS
// =========================

document.getElementById("cancelBtn").onclick =
function() {

  clearInterval(timerInterval);

  document.getElementById("result").innerHTML = `

  <div class="status-card">

  <h3 class="success">
  ✅ Emergency Cancelled
  </h3>

  <p>
  User confirmed safety.
  </p>

  <p>
  AI monitoring resumed successfully.
  </p>

  </div>

  `;

  speakAlert(
    "Emergency cancelled successfully."
  );

};
// =========================
// DOWNLOAD INCIDENT REPORT
// =========================

document.getElementById(
  "downloadReportBtn"
).onclick = function() {

  const report = `

SAFE SYNC AI
EMERGENCY INCIDENT REPORT

--------------------------------

Date:
${new Date().toLocaleString()}

Location:
${placeName}

Vehicle Speed:
${speed} km/h

Impact Force:
${impact}/10

Severity:
${severity}

Risk Score:
${riskScore}%

Driver Condition:
${driverCondition}

Recommended Hospital:
${selectedHospital.name}

Emergency Contact:
${emergencyContact.name}

--------------------------------

Generated by SafeSync AI

`;

  const blob = new Blob(
    [report],
    { type: "text/plain" }
  );

  const link =
    document.createElement("a");

  link.href =
    URL.createObjectURL(blob);

  link.download =
    "SafeSync_Incident_Report.txt";

  link.click();

};


// =========================
// CANCEL EMERGENCY
// =========================

document.getElementById("cancelBtn").onclick =
function() {

  document.getElementById("result").innerHTML = `

  <div class="status-card">

  <h3 class="success">
  ✅ Emergency Cancelled
  </h3>

  <p>
  User confirmed safety.
  </p>

  <p>
  AI monitoring resumed successfully.
  </p>

  </div>

  `;

  speakAlert(
    "Emergency cancelled successfully."
  );

};

    };

};
// =========================
// AI CHATBOT
// =========================

document.getElementById("chatSendBtn").onclick =
function() {

  let userMessage =
    document.getElementById("chatInput")
    .value
    .toLowerCase();

  let botReply = "";

  // =========================
  // AI RESPONSES
  // =========================

  if (
    userMessage.includes("hospital")
  ) {

    botReply =`

    🏥 Nearby Hospitals:

    ${hospitalServicesHTML}

    `;  

  }

  else if (
    userMessage.includes("police")
  ) {

    botReply =`

    🚓 Nearby Police Stations:

    ${policeServicesHTML}

    `;
     
  }

  else if (
    userMessage.includes("location")
  ) {

    botReply =
      `📍 Your current location is:
      ${placeName}`;

  }
  else if (
    userMessage.includes("repair") ||
    userMessage.includes("mechanic")
  ) {

    botReply = `

    🔧 Nearby Vehicle Services:

    ${roadsideServicesHTML}

    `;

  }

  else if (
    userMessage.includes("ambulance")
  ) {

    botReply =
      "🚑 Call ambulance immediately using 108.";

  }

  else if (
    userMessage.includes("safe")
  ) {

    botReply =
      "✅ Stay calm. Help is on the way.";

  }

  else {

    botReply =
      "🤖 SafeSync AI could not understand your request.";

  }

  // =========================
  // SHOW CHAT
  // =========================

  document.getElementById("chatBox").innerHTML += `

  <div class="status-card">

  <p>
  🧑 You:
  ${userMessage}
  </p>

  <p>
  🤖 AI:
  ${botReply}
  </p>

  </div>

  `;

  // CLEAR INPUT

  document.getElementById("chatInput").value = "";

};
