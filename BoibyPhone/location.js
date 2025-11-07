const modal = document.getElementById("pickupModal");
const results = document.getElementById("storeResults");
const showAllBtn = document.getElementById("showAllStores");

// Open/close modal
document.getElementById("pickupDelivery").onclick = () => modal.style.display = "flex";
document.getElementById("closeModal").onclick = () => modal.style.display = "none";
window.onclick = e => { if (e.target === modal) modal.style.display = "none"; };

// Haversine distance
function distance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2-lat1)*Math.PI/180;
  const dLon = (lon2-lon1)*Math.PI/180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// Fetch stores.json
async function getStores() {
  const res = await fetch("stores.json");
  const data = await res.json();
  return data.stores;
}

// Render store list
function renderStores(stores, title = "") {
  results.innerHTML = "";
  if (title) results.innerHTML += `<h3>${title}</h3>`;
  stores.forEach(store => {
    const div = document.createElement("div");
    div.className = "store";
    div.innerHTML = `
      <strong>${store.name}</strong><br>
      ${store.address}<br>
      ${store.city}, ${store.state} ${store.postcode}<br>
      ${store.country}
      ${store.distance ? `<br><em>${store.distance.toFixed(1)} km away</em>` : ""}
    `;
    results.appendChild(div);
  });
}

// Find nearby stores by postcode
async function handlePickup() {
  const postcode = document.getElementById("postcodeInput").value.trim();
  const country = document.getElementById("countrySelect").value;
  if (!postcode) return alert("Please enter a postcode.");

  // Get coords for postcode
  const url = `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(postcode)}&country=${encodeURIComponent(country)}&format=jsonv2&limit=1`;
  const response = await fetch(url, { headers: { 'User-Agent': 'BoibyPhoneSite/1.0' } });
  const data = await response.json();
  if (!data.length) return alert("Postcode not found.");

  const userLat = parseFloat(data[0].lat);
  const userLon = parseFloat(data[0].lon);

  const stores = await getStores();
  const nearby = stores
    .map(s => ({ ...s, distance: distance(userLat, userLon, s.lat, s.lon) }))
    .filter(s => s.country === country)
    .filter(s => s.distance <= 300)
    .sort((a,b) => a.distance - b.distance);

  if (!nearby.length) {
    results.innerHTML = "<p>No stores nearby. Showing all stores below.</p>";
  } else {
    renderStores(nearby, "Nearby Stores");
  }
  showAllBtn.style.display = "block";
}

// Show all stores
async function showAllStores() {
  const stores = await getStores();
  renderStores(stores, "All Stores");
}

document.getElementById("pickupBtn").onclick = handlePickup;
showAllBtn.onclick = showAllStores;

// Optional delivery info
document.getElementById("deliveryBtn").onclick = () => {
  results.innerHTML = "<p>This item is available for delivery within 2 weeks.</p>";
  showAllBtn.style.display = "block";
};
