// ============================================================
// Admin.js
// Admin panel logic: form handling, localStorage, data schema
// ============================================================

const STORAGE_KEY = "roblox_punishments";
const REASONS = ["Inappropriate", "Spam", "Profanity", "Harassment", "Scamming", "Privacy", "Adult Content"];

function generateUUID() {
   return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
   });
}

function generateHash() {
   const chars = "abcdef0123456789";
   let h = "";
   for (let i = 0; i < 40; i++) h += chars[Math.floor(Math.random() * chars.length)];
   return h;
}

// Random ms timestamp
function randomDateInRange() {
   const start = Date.UTC(2009, 2, 12, 0, 0, 0);    // Mar = month 2
   const end   = Date.UTC(2010, 6, 31, 23, 59, 59);  // Jul = month 6
   return Math.floor(start + Math.random() * (end - start));
}

// Add ban duration days to a UTC ms timestamp
function addDays(ms, days) {
   return ms + days * 24 * 60 * 60 * 1000;
}

// Determine end date ms from type + begin date ms
function computeEndDate(type, beginMs) {
   const map = {
      "Ban 1 Day":   1,
      "Ban 3 Days":  3,
      "Ban 7 Days":  7,
      "Ban 14 Days": 14,
   };
   if (map[type] !== undefined) return addDays(beginMs, map[type]);
   return null; // Delete / Poison have no end date
}

// ---- LocalStorage ----
function loadPunishments() {
   try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
   } catch { return []; }
}

function savePunishments(list) {
   localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function addPunishment(record) {
   const list = loadPunishments();
   list.push(record);
   savePunishments(list);
}

function deletePunishment(id) {
   const list = loadPunishments().filter(p => p.PUNISHMENT_ID !== id);
   savePunishments(list);
   renderSavedList();
}

function clearAll() {
   if (confirm("Clear all saved punishments?")) {
      localStorage.removeItem(STORAGE_KEY);
      renderSavedList();
   }
}

// ---- Utterances ----
let utteranceCount = 0;

function addUtterance() {
   utteranceCount++;
   const id = utteranceCount;
   const container = document.getElementById("utterancesContainer");
   const div = document.createElement("div");
   div.className = "utterance-row";
   div.id = "utterance-" + id;

   let reasonOptions = REASONS.map(r =>
      `<option value="${r}"${r === "Inappropriate" ? " selected" : ""}>${r}</option>`
   ).join("");

   div.innerHTML = `
      <b>Utterance #${id}</b>
      <button type="button" onclick="removeUtterance(${id})" style="margin-left:6px; font-size:7.5pt;">Remove</button><br>
      <label style="display:inline; font-weight:bold;">Reason: </label>
      <select id="reason-${id}">${reasonOptions}</select>
      <br>
      <label style="display:inline; font-weight:bold;">Offensive Item: </label>
      <input type="text" id="utterance-text-${id}" size="30" placeholder="(can be blank)">
   `;
   container.appendChild(div);
}

function removeUtterance(id) {
   const el = document.getElementById("utterance-" + id);
   if (el) el.remove();
}

function collectUtterances() {
   const rows = document.querySelectorAll(".utterance-row");
   const result = [];
   rows.forEach(row => {
      const idMatch = row.id.match(/utterance-(\d+)/);
      if (!idMatch) return;
      const n = idMatch[1];
      const reasonEl = document.getElementById("reason-" + n);
      const textEl   = document.getElementById("utterance-text-" + n);
      if (reasonEl) {
         result.push({
            ABUSE_TYPE:     reasonEl.value,
            UTTERANCE_TEXT: textEl ? textEl.value.trim() : "",
         });
      }
   });
   return result;
}

// ---- Date toggle ----
document.getElementById("useRandomDate").addEventListener("change", function () {
   document.getElementById("datePickerWrap").style.display = this.checked ? "none" : "block";
});

// ---- Submit ----
function submitAction() {
   const statusEl = document.getElementById("status");
   statusEl.className = "";
   statusEl.textContent = "";

   const typeEl = document.querySelector('input[name="punishmentType"]:checked');
   const type = typeEl ? typeEl.value : "";
   const allowedTypes = ["Ban 1 Day","Ban 3 Days","Ban 7 Days","Ban 14 Days","Delete","Poison"];
   if (!allowedTypes.includes(type)) {
      statusEl.className = "error";
      statusEl.textContent = "Please select a valid action type.";
      return;
   }

   let beginMs;
   const useRandom = document.getElementById("useRandomDate").checked;
   if (useRandom) {
      beginMs = randomDateInRange();
   } else {
      const val = document.getElementById("customDate").value;
      if (!val) {
         statusEl.className = "error";
         statusEl.textContent = "Please pick a date/time, or use random.";
         return;
      }
      // Treat the picked datetime-local value as CT wall-clock time.
      const naiveMs = new Date(val).getTime();
      const ctParts = new Intl.DateTimeFormat("en-US", {
         timeZone: "America/Chicago",
         year: "numeric", month: "2-digit", day: "2-digit",
         hour: "2-digit", minute: "2-digit", second: "2-digit",
         hour12: false,
      }).formatToParts(new Date(naiveMs));
      const gp = type => ctParts.find(p => p.type === type)?.value ?? "0";
      const ctWallMs = new Date(`${gp("year")}-${gp("month")}-${gp("day")}T${gp("hour")}:${gp("minute")}:${gp("second")}`).getTime();
      const ctOffsetMs = naiveMs - ctWallMs;
      beginMs = naiveMs + ctOffsetMs;
      // Clamp: Mar 12 2009 00:00:00 CT - Jul 31 2010 23:59:59 CT
      const minCT = new Date("2009-03-12T00:00:00").getTime() + ctOffsetMs;
      const maxCT = new Date("2010-07-31T23:59:59").getTime() + ctOffsetMs;
      if (beginMs < minCT || beginMs > maxCT) {
         statusEl.className = "error";
         statusEl.textContent = "Date must be between March 12 2009 and July 31 2010 (CT).";
         return;
      }
   }

   const endMs = computeEndDate(type, beginMs); // null for Delete/Poison

   const record = {
      PUNISHMENT_ID:   generateUUID(),
      PUNISHMENT_HASH: generateHash(),
      PUNISHMENT_TYPE: type,
      MESSAGE_TO_USER: document.getElementById("modNote").value.trim(),
      UTTERANCES:      collectUtterances(),
      BEGIN_DATE:      beginMs,
      END_DATE:        endMs,
   };

   addPunishment(record);

   statusEl.textContent = "Action saved. ID: " + record.PUNISHMENT_ID;
   renderSavedList();
}

function formatDate(ms) {
   if (ms === null || ms === undefined) return "(none)";
   const d = new Date(ms);
   const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Chicago",
      month: "numeric", day: "numeric", year: "numeric",
      hour: "numeric", minute: "2-digit", second: "2-digit",
      hour12: true,
   }).formatToParts(d);
   const get = type => parts.find(p => p.type === type)?.value ?? "";
   return `${get("month")}/${get("day")}/${get("year")} ${get("hour")}:${get("minute")}:${get("second")} ${get("dayPeriod")}`;
}

function renderSavedList() {
   const list = loadPunishments();
   const el = document.getElementById("savedList");
   if (!list.length) { el.innerHTML = "<i>No punishments saved.</i>"; return; }

   let html = `<table>
      <tr>
         <th>#</th>
         <th>Action</th>
         <th>Begin</th>
         <th>End</th>
         <th>Message to user</th>
         <th>Utterances</th>
         <th></th>
      </tr>`;

   list.forEach((p, i) => {
      const utts = p.UTTERANCES.map(u => `[${u.ABUSE_TYPE}] ${u.UTTERANCE_TEXT || "(blank)"}`).join("; ") || "(none)";
      html += `<tr>
         <td>${i+1}</td>
         <td>${p.PUNISHMENT_TYPE}</td>
         <td>${formatDate(p.BEGIN_DATE)}</td>
         <td>${formatDate(p.END_DATE)}</td>
         <td>${p.MESSAGE_TO_USER || "(blank)"}</td>
         <td>${utts}</td>
         <td style="font-size:7pt; word-break:break-all;">${p.PUNISHMENT_ID}</td>
         <td><button type="button" onclick="deletePunishment('${p.PUNISHMENT_ID}')">Delete</button></td>
      </tr>`;
   });

   html += "</table>";
   el.innerHTML = html;
}

window.RobloxAdmin = {
   loadPunishments,
   formatDate,
   STORAGE_KEY,
};

// Init
renderSavedList();