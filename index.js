(function () {
  const STATUS_URL = "http://172.17.177.79:5000/status";

  function applyBadge(el, data) {
    if (!el) return;

    const status = (data.status || "NORMAL").toUpperCase();
    const flood = Number(data.flood_pct ?? 0);
    const normal = Number(data.normal_pct ?? 0);

    if (status === "FLOOD") {
      // level based on flood %
      let level = "low";
      if (flood >= 70) level = "high";
      else if (flood >= 40) level = "medium";

      // supports both: .flood-alert and .flood-badge
      const baseClass = el.classList.contains("flood-badge") ? "flood-badge" : "flood-alert";
      el.className = `${baseClass} ${level}`;
      el.innerHTML = `<i class="fas fa-exclamation-triangle"></i> FLOOD ${flood}%`;
      // if it's badge with span inside
      if (baseClass === "flood-badge") el.innerHTML = `<i class="fas fa-exclamation-triangle"></i><span>FLOOD ${flood}%</span>`;
    } else {
      const baseClass = el.classList.contains("flood-badge") ? "flood-badge" : "flood-alert";
      el.className = `${baseClass} normal`;
      el.innerHTML = `<i class="fas fa-check-circle"></i> NORMAL ${normal}%`;
      if (baseClass === "flood-badge") el.innerHTML = `<i class="fas fa-check-circle"></i><span>NORMAL ${normal}%</span>`;
    }
  }

  async function updateStatus() {
    const floodAlert = document.getElementById("floodAlert");
    const locationFloodBadge = document.getElementById("locationFloodBadge");

    try {
      const res = await fetch(STATUS_URL, { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();

      applyBadge(floodAlert, data);
      applyBadge(locationFloodBadge, data);
    } catch (e) {
      // show OFFLINE on both if fetch fails
      [document.getElementById("floodAlert"), document.getElementById("locationFloodBadge")].forEach(el => {
        if (!el) return;
        const baseClass = el.classList.contains("flood-badge") ? "flood-badge" : "flood-alert";
        el.className = `${baseClass} offline`;
        el.innerHTML = `<i class="fas fa-wifi"></i> OFFLINE`;
        if (baseClass === "flood-badge") el.innerHTML = `<i class="fas fa-wifi"></i><span>OFFLINE</span>`;
      });
      console.log("Status update failed:", e);
    }
  }

  // ✅ IMPORTANT: run after page is loaded
  window.addEventListener("load", () => {
    updateStatus();
    setInterval(updateStatus, 1000);
  });
})();