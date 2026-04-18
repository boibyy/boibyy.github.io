// ============================================================
// ban-screen.js
// Reads the latest (or target) punishment from localStorage
// and injects the correct ban screen content into the page.
//
// Usage: include this script on the ban screen page.
// It reads from localStorage key "roblox_punishments".
//
// To display a specific punishment, add ?id=UUID to the URL.
// Otherwise it displays the most recently added punishment.
// ============================================================

(function () {
   const STORAGE_KEY = "roblox_punishments";
  
   function loadPunishments() {
      try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
      catch { return []; }
   }

   function getPunishment() {
      const list = loadPunishments();
      if (!list.length) return null;
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");
      if (id) return list.find(p => p.PUNISHMENT_ID === id) || null;
      return list[list.length - 1];
   }

   function formatDate(ms) {
      if (ms === null || ms === undefined) return "";
      const d = new Date(ms);
      let h = d.getUTCHours(), m = d.getUTCMinutes(), s = d.getUTCSeconds();
      const ampm = h >= 12 ? "PM" : "AM";
      h = h % 12 || 12;
      const pad = n => String(n).padStart(2, "0");
      return `${d.getUTCMonth()+1}/${d.getUTCDate()}/${d.getUTCFullYear()} ${h}:${pad(m)}:${pad(s)} ${ampm}`;
   }
  
   const TITLES = {
      "Ban 1 Day":   "Banned for 1 Day",
      "Ban 3 Days":  "Banned for 3 Days",
      "Ban 7 Days":  "Banned for 7 Days",
      "Ban 14 Days": "Banned for 14 Days",
      "Delete":      "Account Deleted",
      "Poison":      "Account Deleted",
   };

   function buildFooterParagraph(p) {
      const type = p.PUNISHMENT_TYPE;
      if (type === "Delete") {
         return "<p>Your account has been terminated.</p>";
      }
      if (type === "Poison") {
         return "<p><b>Your account has been terminated, and new account creation has been disabled.</b></p>";
      }
      // Ban types
      const durationMap = {
         "Ban 1 Day":   "1 day",
         "Ban 3 Days":  "3 days",
         "Ban 7 Days":  "7 days",
         "Ban 14 Days": "14 days",
      };
      const dur = durationMap[type];
      const endStr = formatDate(p.END_DATE);
      return `<p>Your account has been disabled for ${dur}. You may re-activate it after ${endStr}.</p>`;
   }

   function buildUtterances(utterances) {
      if (!utterances || !utterances.length) return "";
      return utterances.map(u => `
         <div>
            <div style="background-color: #f8f8f8; border: solid 1px #000; margin-bottom: 5px; padding: 10px;">
               <div style="margin-bottom: 5px;"><b>Reason: </b>${escapeHtml(u.ABUSE_TYPE)}</div>
               <div>
                  <b>Offensive Item:</b>
                  <blockquote>${escapeHtml(u.UTTERANCE_TEXT)}</blockquote>
               </div>
            </div>
         </div>
      `).join("");
   }

   function escapeHtml(str) {
      return String(str)
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;");
   }

   function render() {
      const container = document.getElementById("NotApprovedContainer");
      if (!container) {
         console.error("NotApprovedScript.js: #NotApprovedContainer not found.");
         return;
      }

      const p = getPunishment();
      if (!p) {
         container.innerHTML = "";
         return;
      }

      const title     = TITLES[p.PUNISHMENT_TYPE] || p.PUNISHMENT_TYPE;
      const dateStr   = formatDate(p.BEGIN_DATE);
      const noteHtml  = p.MESSAGE_TO_USER
         ? `<b mode="encode">${escapeHtml(p.MESSAGE_TO_USER)}</b>`
         : "";
      const uttHtml   = buildUtterances(p.UTTERANCES);
      const footerHtml = buildFooterParagraph(p);

      container.innerHTML = `
         <h1>${escapeHtml(title)}</h1>
         <p>Our content monitors have determined that your behavior at ROBLOX has been in violation of our Terms of Service. We will terminate your account if you do not abide by the rules.</p>
         <p>Reviewed: <b>${escapeHtml(dateStr)}</b></p>
         <p>Moderator Note: ${noteHtml}</p>
         ${uttHtml}
         <p>Please abide by the <a href="https://www.roblox.com/info/terms" target="_blank">ROBLOX Community Guidelines</a> so that ROBLOX can be fun for users of all ages.</p>
         ${footerHtml}
      `;
   }

   if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", render);
   } else {
      render();
   }
})();
