(function () {
  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function powerValue(adventurer) {
    return window.GameSystems.calculatePower(adventurer);
  }

  function classBadge(heroClass) {
    return window.GameData.classDetails[heroClass].short;
  }

  function renderParticles() {
    var particles = [];
    for (var index = 0; index < 12; index += 1) {
      particles.push('<span class="particle particle-' + index + '"></span>');
    }
    return particles.join("");
  }

  function renderToast(toast) {
    if (!toast) {
      return "";
    }

    return '<div class="toast">' + escapeHtml(toast.message) + "</div>";
  }

  function renderShell(content, state) {
    return '' +
      '<div class="app-shell">' +
        '<div class="app-aura"></div>' +
        '<div class="app-noise">' + renderParticles() + "</div>" +
        '<main class="app-frame">' +
          content +
          renderToast(state.toast) +
        "</main>" +
      "</div>";
  }

  function renderStart(state) {
    var continueDisabled = !state.hasSave ? 'disabled aria-disabled="true"' : "";
    return '' +
      '<section class="screen start-screen">' +
        '<div class="hero-crest">Guild</div>' +
        '<div class="title-wrap">' +
          '<p class="eyebrow">Dark fantasy mobile MVP</p>' +
          "<h1>Grand Adventures Guild of Cheekclaptopia</h1>" +
          "<p class=\"subcopy\">Guide a small guild from the hub to the map, through missions, and back again with every outcome resolved by a volatile d20.</p>" +
        "</div>" +
        '<div class="start-actions">' +
          '<button class="primary-button" data-action="new-game">New Game</button>' +
          '<button class="ghost-button" data-action="continue-game" ' + continueDisabled + ">Continue</button>" +
          '<button class="ghost-button" data-action="open-settings">Settings</button>' +
        "</div>" +
        '<p class="status-line">' + (state.hasSave ? "Saved guild available." : "No saved guild yet.") + "</p>" +
      "</section>";
  }

  function renderTopGold(state) {
    return '' +
      '<div class="top-strip">' +
        '<div class="gold-chip">' +
          '<span class="chip-label">Gold</span>' +
          "<strong>" + state.gold.toLocaleString() + "</strong>" +
        "</div>" +
        '<div class="gold-chip subdued-chip">' +
          '<span class="chip-label">Roster</span>' +
          "<strong>" + state.adventurers.length + "</strong>" +
        "</div>" +
      "</div>";
  }

  function renderBottomNav(currentScreen, selectedLocationId) {
    var guildDisabled = !selectedLocationId ? 'disabled aria-disabled="true"' : "";
    return '' +
      '<nav class="bottom-nav">' +
        '<button class="nav-button ' + (currentScreen === "hub" ? "is-active" : "") + '" data-action="go-hub">Hub</button>' +
        '<button class="nav-button ' + (currentScreen === "map" ? "is-active" : "") + '" data-action="go-map">Map</button>' +
        '<button class="nav-button ' + (currentScreen === "guildHall" ? "is-active" : "") + '" data-action="go-guildhall" ' + guildDisabled + ">Guild Hall</button>" +
        '<button class="nav-button ' + (currentScreen === "settings" ? "is-active" : "") + '" data-action="open-settings">Settings</button>' +
      "</nav>";
  }

  function renderAdventurerCard(adventurer, selected, interactive) {
    var selectedClass = selected ? " roster-card--selected" : "";
    var actionAttributes = interactive ? ' data-action="toggle-party" data-adventurer-id="' + adventurer.id + '"' : "";
    return '' +
      '<button class="roster-card' + selectedClass + '"' + actionAttributes + ">" +
        '<div class="hero-mark">' + classBadge(adventurer.class) + "</div>" +
        '<div class="roster-card__body">' +
          "<strong>" + escapeHtml(adventurer.name) + "</strong>" +
          "<p>" + escapeHtml(adventurer.class) + " | Power " + powerValue(adventurer) + "</p>" +
          '<p class="stats-line">ATK ' + adventurer.atk + "  DEF " + adventurer.def + "  SPD " + adventurer.spd + "</p>" +
        "</div>" +
        '<span class="selection-pill">' + (selected ? "Assigned" : "Ready") + "</span>" +
      "</button>";
  }

  function renderHubPanel(state) {
    if (!state.activeHubPanel) {
      return "";
    }

    if (state.activeHubPanel === "tavern") {
      var offers = state.tavernOffers.length ? state.tavernOffers.map(function (offer) {
        var power = powerValue(offer.adventurer);
        return '' +
          '<article class="roster-card tavern-card">' +
            '<div class="hero-mark">' + classBadge(offer.adventurer.class) + "</div>" +
            '<div class="roster-card__body">' +
              "<strong>" + escapeHtml(offer.adventurer.name) + "</strong>" +
              "<p>" + escapeHtml(offer.adventurer.class) + " | Power " + power + "</p>" +
              '<p class="stats-line">ATK ' + offer.adventurer.atk + "  DEF " + offer.adventurer.def + "  SPD " + offer.adventurer.spd + "</p>" +
            "</div>" +
            '<button class="mini-button" data-action="recruit" data-offer-id="' + offer.id + '">Hire ' + offer.cost + "g</button>" +
          "</article>";
      }).join("") : '<p class="muted">The tavern has no more candidates tonight.</p>';

      return '' +
        '<section class="sheet-overlay" data-action="close-panel">' +
          '<div class="sheet-panel" data-stop-click="true">' +
            '<div class="sheet-head"><h3>Tavern</h3><button class="close-x" data-action="close-panel">Close</button></div>' +
            '<p class="muted">Recruit one hero at a time and strengthen your guild.</p>' +
            '<div class="sheet-list">' + offers + "</div>" +
          "</div>" +
        "</section>";
    }

    var adventurers = state.adventurers.map(function (adventurer) {
      return renderAdventurerCard(adventurer, state.currentParty.indexOf(adventurer.id) !== -1, false);
    }).join("");

    return '' +
      '<section class="sheet-overlay" data-action="close-panel">' +
        '<div class="sheet-panel" data-stop-click="true">' +
          '<div class="sheet-head"><h3>Roster</h3><button class="close-x" data-action="close-panel">Close</button></div>' +
          '<p class="muted">Your guild can field up to ' + window.GameData.maxPartySize + " heroes per mission.</p>" +
          '<div class="sheet-list">' + adventurers + "</div>" +
        "</div>" +
      "</section>";
  }

  function renderHub(state) {
    var guildLevel = window.GameSystems.getGuildLevel(state);
    return '' +
      '<section class="screen hub-screen">' +
        renderTopGold(state) +
        '<div class="guild-banner panel-card">' +
          '<p class="eyebrow">Guild Level ' + guildLevel + "</p>" +
          "<h2>Your guild is growing stronger</h2>" +
          '<p class="muted">Completed missions: ' + state.progress.missionsCompleted + " | Recruits hired: " + state.progress.recruitedCount + "</p>" +
        "</div>" +
        '<div class="hub-actions">' +
          '<button class="action-card" data-action="open-panel" data-panel="tavern">' +
            '<span class="action-card__icon">T</span>' +
            '<span><strong>Tavern</strong><small>Recruit fresh adventurers</small></span>' +
          "</button>" +
          '<button class="action-card" data-action="open-panel" data-panel="roster">' +
            '<span class="action-card__icon">R</span>' +
            '<span><strong>Roster</strong><small>Review your guild lineup</small></span>' +
          "</button>" +
          '<button class="action-card" data-action="go-map">' +
            '<span class="action-card__icon">M</span>' +
            '<span><strong>Map</strong><small>Select the next contract region</small></span>' +
          "</button>" +
          '<button class="action-card" data-action="go-guildhall">' +
            '<span class="action-card__icon">G</span>' +
            "<span><strong>Guild Hall</strong><small>" + (state.selectedLocationId ? "Prepare the chosen contract" : "Choose a location first") + "</small></span>" +
          "</button>" +
        "</div>" +
        renderHubPanel(state) +
        renderBottomNav("hub", state.selectedLocationId) +
      "</section>";
  }

  function renderLocationPanel(location) {
    if (!location) {
      return '' +
        '<div class="map-panel panel-card">' +
          "<h3>Choose your next contract</h3>" +
          '<p class="muted">Tap a glowing node to review the region and move into the Guild Hall.</p>' +
        "</div>";
    }

    var missions = window.GameSystems.buildMissionsForLocation(location.id);
    return '' +
      '<div class="map-panel panel-card">' +
        "<p class=\"eyebrow\">" + escapeHtml(window.GameSystems.getNodeTypeMeta(location.type).label) + "</p>" +
        "<h3>" + escapeHtml(location.name) + "</h3>" +
        '<p class="muted">' + escapeHtml(location.flavor) + "</p>" +
        '<div class="inline-pill-row">' +
          missions.map(function (mission) {
            return '<span class="inline-pill inline-pill--' + mission.difficulty.toLowerCase() + '">' + mission.difficulty + " " + mission.dc + "</span>";
          }).join("") +
        "</div>" +
        '<button class="primary-button" data-action="enter-guildhall">Travel to Guild Hall</button>' +
      "</div>";
  }

  function renderMap(state) {
    var selectedLocationId = state.selectedMapLocationId || state.selectedLocationId;
    var selectedLocation = window.GameSystems.getLocationById(selectedLocationId);
    var locationCards = window.GameData.locations.map(function (location) {
      var meta = window.GameSystems.getNodeTypeMeta(location.type);
      var active = selectedLocation && selectedLocation.id === location.id ? "node-active" : "";
      return '' +
        '<button class="map-node ' + meta.badge + " " + active + '" data-action="select-location" data-location-id="' + location.id + '" style="left:' + location.x + "%; top:" + location.y + '%;">' +
          "<span>" + meta.label.charAt(0) + "</span>" +
        "</button>";
    }).join("");

    return '' +
      '<section class="screen map-screen">' +
        renderTopGold(state) +
        '<div class="map-header">' +
          "<h2>World Map</h2>" +
          "<p>Select a location</p>" +
        "</div>" +
        '<div class="map-surface">' + locationCards + "</div>" +
        renderLocationPanel(selectedLocation) +
        renderBottomNav("map", state.selectedLocationId) +
      "</section>";
  }

  function renderMissionChoices(missions, currentMission) {
    if (!missions.length) {
      return '<div class="panel-card"><p class="muted">No mission selected yet.</p></div>';
    }

    return missions.map(function (mission) {
      var active = currentMission && currentMission.id === mission.id ? " mission-card--active" : "";
      return '' +
        '<button class="mission-card' + active + '" data-action="choose-mission" data-mission-id="' + mission.id + '">' +
          '<div class="section-head">' +
            "<h3>" + escapeHtml(mission.name) + "</h3>" +
            '<span class="inline-pill inline-pill--' + mission.difficulty.toLowerCase() + '">' + mission.difficulty + "</span>" +
          "</div>" +
          '<p class="muted">' + escapeHtml(mission.summary) + "</p>" +
          '<div class="mission-meta"><span>DC ' + mission.dc + "</span><span>" + mission.rewardGold + " Gold</span></div>" +
        "</button>";
    }).join("");
  }

  function renderPartySlots(partyMembers) {
    var slots = [];
    for (var index = 0; index < window.GameData.maxPartySize; index += 1) {
      var member = partyMembers[index];
      if (!member) {
        slots.push('<div class="party-slot"><span>Empty Slot</span></div>');
      } else {
        slots.push('' +
          '<div class="party-slot party-slot--filled">' +
            '<div class="hero-mark">' + classBadge(member.class) + "</div>" +
            "<div>" +
              "<strong>" + escapeHtml(member.name) + "</strong>" +
              "<small>" + escapeHtml(member.class) + " | Power " + powerValue(member) + "</small>" +
            "</div>" +
          "</div>");
      }
    }

    return slots.join("");
  }

  function renderGuildHall(state) {
    var location = window.GameSystems.getLocationById(state.selectedLocationId);
    var missions = location ? window.GameSystems.buildMissionsForLocation(location.id) : [];
    var partyMembers = window.GameSystems.getPartyMembers(state);
    var partyPower = window.GameSystems.getPartyPower(state);
    var mission = state.currentMission || missions[0] || null;
    var difference = mission ? partyPower - mission.dc : 0;

    return '' +
      '<section class="screen guild-screen">' +
        renderTopGold(state) +
        '<div class="map-header guild-header">' +
          "<h2>Guild Hall</h2>" +
          "<p>" + (location ? escapeHtml(location.name) : "Select a location from the map") + "</p>" +
        "</div>" +
        '<div class="mission-stack">' + renderMissionChoices(missions, mission) + "</div>" +
        '<section class="panel-card">' +
          '<div class="section-head"><h3>Party Formation</h3><small>' + partyMembers.length + "/" + window.GameData.maxPartySize + " selected</small></div>" +
          '<div class="party-slots">' + renderPartySlots(partyMembers) + "</div>" +
          '<div class="power-card"><span>Total Party Power</span><strong>' + partyPower + "</strong></div>" +
          '<div class="comparison-card ' + (difference >= 0 ? "comparison-card--positive" : "comparison-card--negative") + '">' +
            "<p>Your Power <strong>" + partyPower + "</strong> vs Difficulty <strong>" + (mission ? mission.dc : "--") + "</strong></p>" +
            "<small>" + (difference >= 0 ? "+" + difference + " advantage" : difference + " disadvantage") + "</small>" +
          "</div>" +
        "</section>" +
        '<section class="panel-card">' +
          '<div class="section-head"><h3>Available Adventurers</h3><small>Tap to assign or remove</small></div>' +
          '<div class="roster-list">' +
            state.adventurers.map(function (adventurer) {
              return renderAdventurerCard(adventurer, state.currentParty.indexOf(adventurer.id) !== -1, true);
            }).join("") +
          "</div>" +
        "</section>" +
        '<div class="action-row stacked-row">' +
          '<button class="primary-button" data-action="start-mission"' + (!mission ? ' disabled aria-disabled="true"' : "") + ">Start Mission</button>" +
          '<button class="ghost-button" data-action="go-map">Back to Map</button>' +
        "</div>" +
        renderBottomNav("guildHall", state.selectedLocationId) +
      "</section>";
  }

  function renderResult(state) {
    var result = state.lastResult;
    if (!result) {
      return '<section class="screen result-screen"><div class="panel-card"><p class="muted">No mission result yet.</p></div></section>';
    }

    var toneClass = "result-tone--failure";
    if (result.outcome === "criticalSuccess") {
      toneClass = "result-tone--critical";
    } else if (result.outcome === "perfectSuccess") {
      toneClass = "result-tone--perfect";
    } else if (result.outcome === "success") {
      toneClass = "result-tone--success";
    } else if (result.outcome === "partialSuccess") {
      toneClass = "result-tone--partial";
    }

    return '' +
      '<section class="screen result-screen">' +
        '<div class="result-card ' + toneClass + '">' +
          '<p class="eyebrow">' + escapeHtml(result.locationName) + "</p>" +
          "<h2>" + escapeHtml(result.missionName) + "</h2>" +
          '<div class="result-grid">' +
            "<div><span>Roll</span><strong>" + result.roll + "</strong></div>" +
            "<div><span>Luck</span><strong>" + (result.luck >= 0 ? "+" : "") + result.luck + "</strong></div>" +
            "<div><span>Party Power</span><strong>" + result.partyPower + "</strong></div>" +
            "<div><span>DC</span><strong>" + result.dc + "</strong></div>" +
          "</div>" +
          '<div class="total-box"><span>Total Score</span><strong>' + result.total + "</strong></div>" +
          '<div class="outcome-banner">' + escapeHtml(result.outcomeLabel) + "</div>" +
          '<div class="reward-line"><span>Reward</span><strong>' + result.rewardGold + " Gold</strong></div>" +
          '<button class="primary-button" data-action="continue-loop">Continue to Hub</button>' +
        "</div>" +
      "</section>";
  }

  function renderSettings(state) {
    return '' +
      '<section class="screen settings-screen">' +
        '<div class="settings-panel panel-card">' +
          "<h2>Settings</h2>" +
          '<p class="muted">Simple local preferences for this MVP.</p>' +
          '<label class="toggle-row"><span>Music</span><input type="checkbox" data-setting="music" ' + (state.settings.music ? "checked" : "") + "></label>" +
          '<label class="toggle-row"><span>Sound</span><input type="checkbox" data-setting="sound" ' + (state.settings.sound ? "checked" : "") + "></label>" +
          '<button class="danger-button" data-action="reset-progress">Reset Progress</button>' +
          '<button class="primary-button" data-action="back-from-settings">Back</button>' +
        "</div>" +
      "</section>";
  }

  function render(state) {
    var root = document.getElementById("app");
    if (!root) {
      return;
    }

    var screen = "";
    if (state.currentScreen === "start") {
      screen = renderStart(state);
    } else if (state.currentScreen === "hub") {
      screen = renderHub(state);
    } else if (state.currentScreen === "map") {
      screen = renderMap(state);
    } else if (state.currentScreen === "guildHall") {
      screen = renderGuildHall(state);
    } else if (state.currentScreen === "result") {
      screen = renderResult(state);
    } else if (state.currentScreen === "settings") {
      screen = renderSettings(state);
    }

    root.innerHTML = renderShell(screen, state);
  }

  window.GameUI = {
    render: render
  };
}());
