async function getPostcodeCoords(postcode, country) {
  const url = `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(postcode)}&country=${encodeURIComponent(country)}&format=jsonv2&addressdetails=1&limit=1`;
  const response = await fetch(url, {
    headers: { 'User-Agent': 'BoibyPhoneSite/1.0 (contact@boiby.dev)' }
  });
  const data = await response.json();
  if (!data.length) return null;

  const { lat, lon, address } = data[0];
  return {
    lat: parseFloat(lat),
    lon: parseFloat(lon),
    city: address.city || address.town || address.village || null,
    state: address.state || address.region || null
  };
}

function distance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 +
            Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Update stores with missing coordinates
async function fillMissingStoreCoords(stores) {
  for (const store of stores) {
    if (store.lat === 0 && store.lon === 0) {
      try {
        const coords = await getPostcodeCoords(store.postcode, store.country);
        if (coords) {
          store.lat = coords.lat;
          store.lon = coords.lon;
        }
      } catch (e) {
        console.warn(`Failed to get coords for ${store.name}:`, e);
      }
    }
  }
  return stores;
}

async function findNearbyStores(userLat, userLon, userCountry, maxDistanceKm = 300) {
  const res = await fetch("stores.json");
  const { stores: rawStores } = await res.json();
  const stores = await fillMissingStoreCoords(rawStores);

  return stores
    .filter(store => store.country === userCountry)
    .map(store => ({
      ...store,
      distance: distance(userLat, userLon, store.lat, store.lon)
    }))
    .filter(s => s.distance <= maxDistanceKm)
    .sort((a, b) => a.distance - b.distance);
}

// Modal handling
const modal = document.getElementById("pickupModal");
document.getElementById("pickupDeliveryBtn").onclick = () => modal.style.display = "flex";
document.getElementById("closeModal").onclick = () => modal.style.display = "none";
window.onclick = e => { if (e.target === modal) modal.style.display = "none"; };

const showAllBtn = document.getElementById("showAllStores");
const results = document.getElementById("storeResults");

async function handleDelivery() {
  results.innerHTML = "<p>This item is available for delivery within 2 weeks.</p>";
}

async function handlePickup() {
  const postcode = document.getElementById("postcodeInput").value.trim();
  const country = document.getElementById("countrySelect").value;
  if (!postcode) return alert("Please enter a postcode.");

  const coords = await getPostcodeCoords(postcode, country);
  if (!coords) return alert("Postcode not found.");

  const nearby = await findNearbyStores(coords.lat, coords.lon, country);
  if (!nearby.length) {
    results.innerHTML = "<p>There are no available stores in your area, sorry.</p>";
    showAllBtn.style.display = "block";
    showAllBtn.onclick = showAllStores;
  } else {
    showAllBtn.style.display = "block";
    showAllBtn.onclick = showAllStores;
    renderStores(nearby);
  }
}

async function showAllStores() {
  const res = await fetch("stores.json");
  const { stores } = await res.json();
  const fullStores = await fillMissingStoreCoords(stores);
  renderStores(fullStores);
}

function renderStores(stores) {
  results.innerHTML = "";
  stores.forEach(store => {
    const div = document.createElement("div");
    div.className = "store";
    div.innerHTML = `
      <h3>${store.name}</h3>
      <p>${store.address}</p>
      ${store.distance ? `<p>${store.distance.toFixed(1)} km away</p>` : ""}
    `;
    results.appendChild(div);
  });
}

document.getElementById("deliveryBtn").onclick = handleDelivery;
document.getElementById("pickupBtn").onclick = handlePickup;
