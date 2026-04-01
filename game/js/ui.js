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
          "<p class=\"subcopy\">Every contract now rewards smart team building, correct mission matching, and careful recovery planning.</p>" +
        "</div>" +
        '<div class="start-actions">' +
          '<button class="primary-button" data-action="new-game">New Game</button>' +
          '<button class="ghost-button" data-action="continue-game" ' + continueDisabled + ">Continue</button>" +
          '<button class="ghost-button" data-action="open-settings">Settings</button>' +
        "</div>" +
        '<p class="status-line">' + (state.hasSave ? "Saved guild available." : "No saved guild yet.") + "</p>" +
      "</section>";
  }

  function renderTopBar(state, showEndDay) {
    var progress = window.GameSystems.getGuildProgress(state);
    return '' +
      '<div class="top-strip top-strip--wide">' +
        '<div class="top-strip__stats">' +
          '<div class="gold-chip">' +
            '<span class="chip-label">Gold</span>' +
            "<strong>" + state.gold.toLocaleString() + "</strong>" +
          "</div>" +
          '<div class="gold-chip subdued-chip">' +
            '<span class="chip-label">Guild</span>' +
            "<strong>Level " + state.guildLevel + "</strong>" +
          "</div>" +
          '<div class="gold-chip subdued-chip">' +
            '<span class="chip-label">Progress</span>' +
            "<strong>" + (progress.nextThreshold ? (state.totalGoldSpent + " / " + progress.nextThreshold) : "Max") + "</strong>" +
          "</div>" +
        "</div>" +
        (showEndDay ? '<button class="end-day-button" data-action="end-day">End Day</button>' : "") +
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

  function getPartyAssignment(state, adventurerId) {
    return state.currentParties.find(function (party) {
      return party.members.indexOf(adventurerId) !== -1;
    }) || null;
  }

  function renderAdventurerCard(adventurer, state, interactive) {
    var assignedParty = getPartyAssignment(state, adventurer.id);
    var activeParty = window.GameSystems.getPartyById(state, state.activePartyId);
    var isSelected = assignedParty && activeParty && assignedParty.id === activeParty.id;
    var isAssignedElsewhere = assignedParty && activeParty && assignedParty.id !== activeParty.id;
    var classes = [];
    var status = window.GameSystems.getStatusLabel(adventurer);

    if (isSelected) {
      classes.push("roster-card--selected");
      status = status === "Ready" ? "Party " + assignedParty.id : status + " | Party " + assignedParty.id;
    } else if (isAssignedElsewhere) {
      classes.push("roster-card--assigned-other");
      status = status === "Ready" ? "Party " + assignedParty.id : status + " | Party " + assignedParty.id;
    }

    if (adventurer.status === "tired") {
      classes.push("roster-card--tired");
    } else if (adventurer.status === "injured") {
      classes.push("roster-card--injured");
    }

    return '' +
      '<button class="roster-card ' + classes.join(" ") + '"' +
        (interactive ? ' data-action="toggle-party" data-adventurer-id="' + adventurer.id + '"' : "") +
      ">" +
        '<div class="hero-mark">' + classBadge(adventurer.class) + "</div>" +
        '<div class="roster-card__body">' +
          "<strong>" + escapeHtml(adventurer.name) + "</strong>" +
          "<p>" + escapeHtml(adventurer.class) + " | Power " + powerValue(adventurer) + "</p>" +
          '<p class="stats-line">ATK ' + adventurer.atk + "  DEF " + adventurer.def + "  SPD " + adventurer.spd + "</p>" +
        "</div>" +
        '<span class="selection-pill">' + escapeHtml(status) + "</span>" +
      "</button>";
  }

  function renderHubPanel(state) {
    if (!state.activeHubPanel) {
      return "";
    }

    if (state.activeHubPanel === "tavern") {
      var range = window.GameSystems.getTavernStatRange(state.guildLevel || 1);
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
      }).join("") : '<p class="muted">The tavern is quiet tonight.</p>';

      return '' +
        '<section class="sheet-overlay" data-action="close-panel">' +
          '<div class="sheet-panel" data-stop-click="true">' +
            '<div class="sheet-head"><h3>Tavern</h3><button class="close-x" data-action="close-panel">Close</button></div>' +
            '<p class="muted">Guild level ' + state.guildLevel + " brings recruits with " + range.min + "-" + range.max + " stat rolls.</p>" +
            '<div class="sheet-list">' + offers + "</div>" +
          "</div>" +
        "</section>";
    }

    var adventurers = state.adventurers.map(function (adventurer) {
      return renderAdventurerCard(adventurer, state, false);
    }).join("");

    return '' +
      '<section class="sheet-overlay" data-action="close-panel">' +
        '<div class="sheet-panel" data-stop-click="true">' +
          '<div class="sheet-head"><h3>Roster</h3><button class="close-x" data-action="close-panel">Close</button></div>' +
          '<p class="muted">Tired heroes recover on the next day. Injured heroes need two full day cycles.</p>' +
          '<div class="sheet-list">' + adventurers + "</div>" +
        "</div>" +
      "</section>";
  }

  function renderPartySummary(state, party) {
    var members = window.GameSystems.getPartyMembers(state, party.id);
    var unavailableCount = members.filter(function (member) {
      return member.status !== "ready";
    }).length;
    return '' +
      '<div class="party-summary-card">' +
        "<strong>Party " + party.id + "</strong>" +
        "<small>" + members.length + "/" + window.GameData.maxPartySize + " heroes | " + window.GameSystems.getPartyPower(state, party.id) + " power</small>" +
        "<small>" + (unavailableCount ? unavailableCount + " recovering" : "Ready for assignment") + "</small>" +
      "</div>";
  }

  function renderHub(state) {
    var progress = window.GameSystems.getGuildProgress(state);
    return '' +
      '<section class="screen hub-screen">' +
        renderTopBar(state, true) +
        '<div class="guild-banner panel-card">' +
          '<p class="eyebrow">Guild Level ' + state.guildLevel + " | Day " + state.day + "</p>" +
          "<h2>Your guild is growing stronger</h2>" +
          '<p class="muted">Completed missions: ' + state.progress.missionsCompleted + " | Recruits hired: " + state.progress.recruitedCount + " | Party slots: " + state.maxParties + "</p>" +
          '<p class="muted">Progress: ' + (progress.nextThreshold ? (state.totalGoldSpent + " / " + progress.nextThreshold) : "Max guild level reached") + "</p>" +
          '<p class="muted">Today\'s contracts: ' + state.currentMissions.length + " | New runs keep guild progression but refresh the campaign.</p>" +
          '<div class="party-summary-grid">' +
            state.currentParties.map(function (party) {
              return renderPartySummary(state, party);
            }).join("") +
          "</div>" +
        "</div>" +
        '<div class="hub-actions">' +
          '<button class="action-card" data-action="open-panel" data-panel="tavern">' +
            '<span class="action-card__icon">T</span>' +
            '<span><strong>Tavern</strong><small>Recruit stronger heroes as the tavern improves</small></span>' +
          "</button>" +
          '<button class="action-card" data-action="open-panel" data-panel="roster">' +
            '<span class="action-card__icon">R</span>' +
            '<span><strong>Roster</strong><small>Review parties, injuries, and recovery pressure</small></span>' +
          "</button>" +
          '<button class="action-card action-card--warning" data-action="start-new-run">' +
            '<span class="action-card__icon">N</span>' +
            '<span><strong>Start New Run</strong><small>Reset the current run, keep guild progression, and claim a fresh bonus</small></span>' +
          "</button>" +
          '<button class="action-card" data-action="go-map">' +
            '<span class="action-card__icon">M</span>' +
            '<span><strong>Map</strong><small>Select the next contract region</small></span>' +
          "</button>" +
          '<button class="action-card" data-action="go-guildhall">' +
            '<span class="action-card__icon">G</span>' +
            "<span><strong>Guild Hall</strong><small>" + (state.selectedLocationId ? "Manage parties for the selected mission" : "Choose a location first") + "</small></span>" +
          "</button>" +
        "</div>" +
        renderHubPanel(state) +
        renderBottomNav("hub", state.selectedLocationId) +
      "</section>";
  }

  function renderLocationPanel(state, location) {
    if (!location) {
      return '' +
        '<div class="map-panel panel-card">' +
          "<h3>Choose your next contract</h3>" +
          '<p class="muted">Tap a glowing node to review the region and move into the Guild Hall.</p>' +
        "</div>";
    }

    var missions = window.GameSystems.getMissionsForLocation(state, location.id);
    var missionSummary = missions.length ? missions.map(function (mission) {
      return '' +
        '<div class="contract-preview">' +
          "<strong>" + escapeHtml(mission.name) + "</strong>" +
          '<div class="inline-pill-row">' +
            '<span class="inline-pill inline-pill--' + mission.difficulty.toLowerCase() + '">' + mission.difficulty + " " + mission.dc + "</span>" +
            '<span class="inline-pill inline-pill--modifier">' + escapeHtml((mission.modifier && mission.modifier.tag) || "[Standard]") + "</span>" +
            '<span class="inline-pill inline-pill--focus">' + escapeHtml(window.GameSystems.getStatLabel(mission.primaryStat)) + "</span>" +
          "</div>" +
        "</div>";
    }).join("") : '<p class="muted">No contracts are posted here today. End Day to rotate the mission board.</p>';

    return '' +
      '<div class="map-panel panel-card">' +
        "<p class=\"eyebrow\">" + escapeHtml(window.GameSystems.getNodeTypeMeta(location.type).label) + "</p>" +
        "<h3>" + escapeHtml(location.name) + "</h3>" +
        '<p class="muted">' + escapeHtml(location.flavor) + "</p>" +
        '<div class="contract-preview-list">' + missionSummary + "</div>" +
        '<button class="' + (missions.length ? "primary-button" : "ghost-button") + '" data-action="enter-guildhall"' + (missions.length ? "" : ' disabled aria-disabled="true"') + ">" + (missions.length ? "Travel to Guild Hall" : "No Contracts Today") + "</button>" +
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
        renderTopBar(state, true) +
        '<div class="map-header">' +
          "<h2>World Map</h2>" +
          "<p>Select a location</p>" +
        "</div>" +
        '<div class="map-surface">' + locationCards + "</div>" +
        renderLocationPanel(state, selectedLocation) +
        renderBottomNav("map", state.selectedLocationId) +
      "</section>";
  }

  function renderMissionChoices(missions, currentMission) {
    if (!missions.length) {
      return '<div class="panel-card"><p class="muted">No contracts are available in this region today. End Day to refresh the mission pool.</p></div>';
    }

    return missions.map(function (mission) {
      var active = currentMission && currentMission.id === mission.id ? " mission-card--active" : "";
      return '' +
        '<button class="mission-card' + active + '" data-action="choose-mission" data-mission-id="' + mission.id + '">' +
          '<div class="section-head">' +
            "<h3>" + escapeHtml(mission.name) + "</h3>" +
            '<div class="inline-pill-row">' +
              '<span class="inline-pill inline-pill--' + mission.difficulty.toLowerCase() + '">' + mission.difficulty + "</span>" +
              '<span class="inline-pill inline-pill--modifier">' + escapeHtml((mission.modifier && mission.modifier.tag) || "[Standard]") + "</span>" +
            "</div>" +
          "</div>" +
          '<p class="muted">' + escapeHtml(mission.summary) + "</p>" +
          '<div class="mission-meta"><span>DC ' + mission.dc + "</span><span>Favors " + window.GameSystems.getStatLabel(mission.primaryStat) + "</span><span>Reward " + mission.rewardGold + "g</span></div>" +
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
              "<small>" + escapeHtml(member.class) + " | Power " + powerValue(member) + " | " + window.GameSystems.getStatusLabel(member) + "</small>" +
            "</div>" +
          "</div>");
      }
    }

    return slots.join("");
  }

  function renderRiskWarnings(state, partyId) {
    var warnings = window.GameSystems.getMissionRiskWarnings(state, partyId);
    if (!warnings.length) {
      return "";
    }

    return '' +
      '<div class="warning-stack">' +
        warnings.map(function (warning) {
          return '<p class="warning-note">' + escapeHtml(warning) + "</p>";
        }).join("") +
      "</div>";
  }

  function renderPartyCards(state, mission) {
    return state.currentParties.map(function (party) {
      var partyMembers = window.GameSystems.getPartyMembers(state, party.id);
      var partyPower = window.GameSystems.getPartyPower(state, party.id);
      var active = String(state.activePartyId) === String(party.id);
      var hasUnavailableMembers = partyMembers.some(function (member) {
        return member.status !== "ready";
      });
      var difference = mission ? partyPower - mission.dc : 0;
      var compareClass = difference >= 0 ? "comparison-card--positive" : "comparison-card--negative";

      return '' +
        '<section class="panel-card party-card ' + (active ? "party-card--active" : "") + '">' +
          '<div class="section-head">' +
            "<h3>Party " + party.id + "</h3>" +
            '<button class="mini-button" data-action="select-party" data-party-id="' + party.id + '">' + (active ? "Managing" : "Manage") + "</button>" +
          "</div>" +
          '<p class="muted">Each adventurer can belong to only one party at a time.</p>' +
          '<div class="party-slots">' + renderPartySlots(partyMembers) + "</div>" +
          '<div class="power-card"><span>Total Party Power</span><strong>' + partyPower + "</strong></div>" +
          '<div class="comparison-card ' + compareClass + '">' +
            "<p>Your Power <strong>" + partyPower + "</strong> vs Difficulty <strong>" + (mission ? mission.dc : "--") + "</strong></p>" +
            "<small>" + (hasUnavailableMembers ? "This party cannot deploy while members recover." : (difference >= 0 ? "+" + difference + " advantage" : difference + " disadvantage")) + "</small>" +
          "</div>" +
          renderRiskWarnings(state, party.id) +
          '<div class="party-actions">' +
            '<button class="primary-button" data-action="start-mission" data-party-id="' + party.id + '"' + (!mission ? ' disabled aria-disabled="true"' : "") + ">Run Mission</button>" +
          "</div>" +
        "</section>";
    }).join("");
  }

  function renderGuildHall(state) {
    var location = window.GameSystems.getLocationById(state.selectedLocationId);
    var missions = location ? window.GameSystems.getMissionsForLocation(state, location.id) : [];
    var mission = state.currentMission || missions[0] || null;
    var activeParty = window.GameSystems.getPartyById(state, state.activePartyId);

    return '' +
      '<section class="screen guild-screen">' +
        renderTopBar(state, true) +
        '<div class="map-header guild-header">' +
          "<h2>Guild Hall</h2>" +
          "<p>" + (location ? escapeHtml(location.name) : "Select a location from the map") + "</p>" +
        "</div>" +
        '<div class="mission-stack">' + renderMissionChoices(missions, mission) + "</div>" +
        '<section class="panel-card">' +
          '<div class="section-head"><h3>Assignment Board</h3><small>Active party: ' + (activeParty ? activeParty.id : "-") + "</small></div>" +
          '<p class="muted">Match the mission focus, stack class synergy, and avoid burning your best roster at the wrong time.</p>' +
          (mission ? '<div class="focus-banner">Mission favors: ' + escapeHtml(window.GameSystems.getStatLabel(mission.primaryStat).toUpperCase()) + " | " + escapeHtml((mission.modifier && mission.modifier.tag) || "[Standard]") + "</div>" : '<div class="focus-banner">No contract is active for this region today.</div>') +
        "</section>" +
        '<div class="party-card-list">' + renderPartyCards(state, mission) + "</div>" +
        '<section class="panel-card">' +
          '<div class="section-head"><h3>Available Adventurers</h3><small>Tired and injured heroes cannot be assigned</small></div>' +
          '<div class="roster-list">' +
            state.adventurers.map(function (adventurer) {
              return renderAdventurerCard(adventurer, state, true);
            }).join("") +
          "</div>" +
        "</section>" +
        '<div class="action-row stacked-row">' +
          '<button class="ghost-button" data-action="go-map">Back to Map</button>' +
        "</div>" +
        renderBottomNav("guildHall", state.selectedLocationId) +
      "</section>";
  }

  function renderBreakdownRow(label, value, accentClass) {
    return '' +
      '<div class="breakdown-row">' +
        "<span>" + escapeHtml(label) + "</span>" +
        '<strong class="' + (accentClass || "") + '">' + escapeHtml(String(value)) + "</strong>" +
      "</div>";
  }

  function renderResult(state) {
    var result = state.lastResult;
    if (!result) {
      return '<section class="screen result-screen"><div class="panel-card"><p class="muted">No mission result yet.</p></div></section>';
    }
    var modifier = result.modifier || {
      tag: "[Standard]",
      label: "Standard"
    };
    var modifierRollBonus = typeof result.modifierRollBonus === "number" ? result.modifierRollBonus : 0;

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
          '<p class="eyebrow">' + escapeHtml(result.locationName) + " | Party " + result.partyId + " | " + escapeHtml(modifier.tag) + "</p>" +
          "<h2>" + escapeHtml(result.missionName) + "</h2>" +
          '<div class="outcome-banner">' + escapeHtml(result.outcomeLabel) + "</div>" +
          '<p class="result-report">' + escapeHtml(result.report) + "</p>" +
          '<div class="panel-card result-breakdown">' +
            '<div class="section-head"><h3>Result Breakdown</h3><small>Mission favors ' + escapeHtml(result.primaryStatLabel.toUpperCase()) + "</small></div>" +
            renderBreakdownRow("Base power", result.basePower) +
            renderBreakdownRow("Roll", result.roll) +
            renderBreakdownRow("Luck", (result.luck >= 0 ? "+" : "") + result.luck) +
            renderBreakdownRow("Condition", modifier.label) +
            renderBreakdownRow("Condition bonus", (modifierRollBonus >= 0 ? "+" : "") + modifierRollBonus) +
            renderBreakdownRow("Stat bonus", "+" + result.statBonus) +
            renderBreakdownRow("Synergy bonus", "+" + result.synergyBonus) +
            renderBreakdownRow("Class bonus", "+" + result.classBonus) +
            renderBreakdownRow("Needed", result.dc) +
            renderBreakdownRow("You got", result.total) +
            renderBreakdownRow("Difference", (result.difference >= 0 ? "+" : "") + result.difference, result.difference >= 0 ? "value-positive" : "value-negative") +
          "</div>" +
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
