async function fetchCoordinates(country, postcode) {
  const url = `https://nominatim.openstreetmap.org/search?country=${encodeURIComponent(country)}&postalcode=${encodeURIComponent(postcode)}&format=json`;
  const res = await fetch(url);
  const data = await res.json();
  return data.length ? data[0] : null;
}

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 +
            Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
            Math.sin(dLon/2)**2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

async function findNearbyStores(lat, lon, country) {
  const res = await fetch("https://boiby.dev/BoibyPhone/stores.json");
  const { stores } = await res.json();
  const results = stores
    .filter(s => s.country === country)
    .map(s => ({
      ...s,
      distance: haversine(lat, lon, s.latitude, s.longitude)
    }))
    .filter(s => s.distance <= 300)
    .sort((a,b) => a.distance - b.distance);
  return results;
}

async function handleDelivery() {
  const country = document.getElementById("country").value;
  const postcode = document.getElementById("postcode").value.trim();
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";
  const data = await fetchCoordinates(country, postcode);
  if (!data) {
    resultsDiv.innerHTML = "Postcode not found.";
    return;
  }
  resultsDiv.innerHTML = "<p>This item is available for delivery within 2 weeks.</p>";
}

async function handlePickup() {
  const country = document.getElementById("country").value;
  const postcode = document.getElementById("postcode").value.trim();
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "Finding nearby stores...";
  const data = await fetchCoordinates(country, postcode);
  if (!data) {
    resultsDiv.innerHTML = "Postcode not found.";
    return;
  }
  const lat = parseFloat(data.lat);
  const lon = parseFloat(data.lon);
  const stores = await findNearbyStores(lat, lon, country);
  if (!stores.length) {
    resultsDiv.innerHTML = "There are no available stores in your area, sorry.";
    return;
  }
  resultsDiv.innerHTML = stores.map(s => `
    <div class="store">
      <div><strong>${s.name}</strong> (${s.distance.toFixed(1)} km)</div>
      <div>${s.city} ${s.postcode}, ${s.state}</div>
      <div class="green">${s.availability}</div>
    </div>
  `).join("");
}

document.getElementById("checkDelivery").addEventListener("click", handleDelivery);
document.getElementById("checkPickup").addEventListener("click", handlePickup);
