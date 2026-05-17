window.onload = function() {

  let activeTimer = null;

  // =========================
  // Hospital Database
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
  // GPS Locations
  // =========================

  const locations = [

    "OMR Highway, Chennai",

    "Bangalore-Mysore Expressway",

    "GST Road, Chennai",

    "Electronic City Flyover",

    "Outer Ring Road, Bengaluru"

  ];

  // =========================
  // Emergency Contacts
  // =========================

  const contacts = [

    {
      name: "Father",
      number: "+91 9876543210"
    },

    {
      name: "Mother",
      number: "+91 9123456780"
    }

  ];

  // =========================
  // Accident History
  // =========================

  let accidentHistory = [];

  // =========================
  // Manual SOS Button
  // =========================

  document.getElementById("manualBtn").onclick = function() {

    document.getElementById("result").innerHTML =

      `
      <div class="status-card">

      <h3 class="alert">
      🚨 Manual Emergency SOS Activated
      </h3>

      <p>
      <strong>User Status:</strong>
      User manually requested emergency assistance.
      </p>

      <p class="info">
      📍 Live location shared
      </p>

      <p class="info">
      🚑 Ambulance service notified
      </p>

      <p class="info">
      📲 Emergency contacts informed
      </p>

      <p class="success">
      ✅ Emergency response activated successfully
      </p>

      </div>
      `;
  };

  // =========================
  // Accident Simulation
  // =========================

  document.getElementById("accidentBtn").onclick = function() {

    if (activeTimer) {
      clearInterval(activeTimer);
      activeTimer = null;
    }

    // Random Data Generation

    let speed =
      Math.floor(Math.random() * 100) + 20;

    let impact =
      Math.floor(Math.random() * 10) + 1;

    let tilt =
      Math.floor(Math.random() * 90);

    let randomLocation = locations[
      Math.floor(Math.random() * locations.length)
    ];

    let emergencyContact = contacts[
      Math.floor(Math.random() * contacts.length)
    ];

    // =========================
    // AI Logic
    // =========================

    let severity = "";

    let severityClass = "";

    let riskScore = 0;
let recommendation = "";
    if(
  (speed > 80 && impact > 6) ||
  (impact > 8 && tilt > 60)
) {

  severity = "Critical";

  severityClass = "critical";

  riskScore =
    Math.floor(Math.random() * 10) + 90;

  recommendation =
    "Avoid vehicle movement until emergency team arrives.";

}
else if(
  speed > 40 ||
  impact > 4 ||
  tilt > 45
) {

  severity = "Medium";

  severityClass = "medium";

  riskScore =
    Math.floor(Math.random() * 20) + 60;

  recommendation =
    "Medical observation recommended. Ambulance support advised.";

}
else {

  severity = "Low";

  severityClass = "low";

  riskScore =
    Math.floor(Math.random() * 30) + 30;

  recommendation =
    "Minor impact detected. Drive carefully and monitor condition.";

}
    // =========================
    // Smart Hospital Selection
    // =========================

    let selectedHospital = {};

    let response = "";

    if(severity === "Low") {

      selectedHospital = hospitals[2];

      response =
        "Nearby clinic notified";

    }
    else if(severity === "Medium") {

      selectedHospital = hospitals[1];

      response =
        "Ambulance service alerted";

    }
    else {

      selectedHospital = hospitals[0];

      response =
        "Police + Trauma Center + Ambulance alerted";

    }

    // =========================
    // Store Accident History
    // =========================

    accidentHistory.unshift({

      severity: severity,

      location: randomLocation

    });

    // Keep only latest 5 records

    if(accidentHistory.length > 5) {

      accidentHistory.pop();

    }

    // =========================
    // Create History HTML
    // =========================

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
      <strong>${item.severity}</strong>
      -
      ${item.location}

      </p>
      `;
    });

    // =========================
    // Countdown
    // =========================

    let countdown = 10;

    document.getElementById("result").innerHTML =

      `
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
      <strong>Vehicle Tilt:</strong>
      ${tilt}°
      </p>

      <p>
      <strong>Live GPS Location:</strong>
      ${randomLocation}
      </p>

      <p>
      <strong>AI Severity Analysis:</strong>

      <span class="${severityClass}">
      ${severity}
      </span>
      <p>
<strong>AI Safety Recommendation:</strong>

<span class="info">
${recommendation}
</span>
</p>

      <span class="${severityClass}">
      ${riskScore}%
      </span>
      </p>

      <p>
      <strong>Recommended Hospital:</strong>
      ${selectedHospital.name}
      </p>

      <p>
      <strong>Hospital Type:</strong>
      ${selectedHospital.type}
      </p>

      <p>
      <strong>Distance:</strong>
      ${selectedHospital.distance}
      </p>

      <p>
      <strong>Emergency Contact:</strong>
      ${emergencyContact.name}
      </p>

      <p>
      <strong>Contact Number:</strong>
      ${emergencyContact.number}
      </p>

      <p id="countdownText" class="alert">
      Sending emergency alert in
      ${countdown} seconds...
      </p>

      <button id="cancelBtn">
      I'm Safe
      </button>

      </div>

      ${historyHTML}
      `;

    // =========================
    // Countdown Logic
    // =========================

    activeTimer = setInterval(function() {

      countdown--;

      const countdownEl = document.getElementById("countdownText");
      if (countdownEl) {
        countdownEl.innerHTML =
          `Sending emergency alert in
          ${countdown} seconds...`;
      }

      if(countdown <= 0) {

        clearInterval(activeTimer);
        activeTimer = null;

        const countdownEl2 = document.getElementById("countdownText");
        if (countdownEl2) {
          countdownEl2.innerHTML = "Emergency alert sent successfully.";
        }

        let emergencyFlow = `

        <hr>

        <p id="step1" class="info">
        📍 Sharing live location...
        </p>

        <p id="step2" class="info"
        style="display:none;">
        🚑 Contacting emergency services...
        </p>

        <p id="step3" class="info"
        style="display:none;">
        📲 Informing emergency contacts...
        </p>

        <p id="finalStep" class="success"
        style="display:none;">
        ✅ Emergency response activated successfully
        </p>
        `;

        document.getElementById("result").innerHTML +=
          emergencyFlow;

        // Step 1

        setTimeout(function() {

            const step1 = document.getElementById("step1");
          const step2 = document.getElementById("step2");
          if (step1) step1.innerHTML = `✅ Live location shared: ${randomLocation}`;
          if (step2) step2.style.display = "block";

        }, 1500);

        // Step 2

        setTimeout(function() {

          const step2 = document.getElementById("step2");
          const step3 = document.getElementById("step3");
          if (step2) step2.innerHTML = `✅ ${response}`;
          if (step3) step3.style.display = "block";

        }, 3000);

        // Step 3

        setTimeout(function() {

          const step3 = document.getElementById("step3");
          const finalStep = document.getElementById("finalStep");
          if (step3) step3.innerHTML = `✅ Emergency contact informed: ${emergencyContact.name}`;
          if (finalStep) finalStep.style.display = "block";

        }, 4500);

      }

    }, 1000);

    // =========================
    // Cancel False Alarm
    // =========================

    document.addEventListener("click", function(e) {

      if(
        e.target &&
        e.target.id === "cancelBtn"
      ) {

        clearInterval(activeTimer);
        activeTimer = null;

        document.getElementById("result").innerHTML =

          `
          <div class="status-card">

          <h3 class="alert">
          False Alarm Cancelled
          </h3>

          <p>
          User confirmed safety.
          </p>

          </div>
          `;
      }

    });

  };

};
