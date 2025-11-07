function openLocationModal() {
  document.getElementById('locationModal').style.display = 'block';
}

function closeLocationModal() {
  document.getElementById('locationModal').style.display = 'none';
  document.getElementById('result').innerHTML = '';
}

async function getLocationData(postcode, country) {
  const url = `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(postcode)}&country=${encodeURIComponent(country)}&format=jsonv2&addressdetails=1&limit=1`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'BoibySite/1.0 (boiby@boiby.dev)' }
  });
  const data = await res.json();
  return data[0] || null;
}

async function checkDelivery() {
  const postcode = document.getElementById('postcode').value.trim();
  const country = document.getElementById('country').value;
  const resultDiv = document.getElementById('result');

  const data = await getLocationData(postcode, country);
  if (!data) {
    resultDiv.innerHTML = `<p>No location found for that postcode.</p>`;
    return;
  }

  resultDiv.innerHTML = `<p>This item is available for delivery within 2 weeks.</p>`;
}

async function checkPickup() {
  const postcode = document.getElementById('postcode').value.trim();
  const country = document.getElementById('country').value;
  const resultDiv = document.getElementById('result');

  const data = await getLocationData(postcode, country);
  if (!data) {
    resultDiv.innerHTML = `<p>No location found for that postcode.</p>`;
    return;
  }

  const userLat = parseFloat(data.lat);
  const userLon = parseFloat(data.lon);

  const stores = await fetch('https://boiby.dev/stores.json').then(r => r.json());
  const nearby = stores
    .filter(s => s.country === country)
    .map(s => {
      const dist = haversine(userLat, userLon, s.lat, s.lon);
      return { ...s, dist };
    })
    .filter(s => s.dist <= 300)
    .sort((a, b) => a.dist - b.dist);

  if (nearby.length === 0) {
    resultDiv.innerHTML = `<p>There are no available stores in your area, sorry.</p>`;
    return;
  }

  resultDiv.innerHTML = nearby.map(s => `
    <div class="store">
      <strong>${s.name}</strong><br>
      (${s.dist.toFixed(1)} km)<br>
      ${s.city} ${s.postcode}, ${s.state}<br>
      <span class="available">Available for Pickup Today</span>
    </div>
  `).join('');
}

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 +
            Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
