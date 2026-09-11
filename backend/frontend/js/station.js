document.addEventListener('DOMContentLoaded', async () => {
  const stationList = document.getElementById('stationList');

  if (!stationList) return;

  try {
    const res = await fetch('http://localhost:5000/api/stations');
    const stations = await res.json();

    if (!stations || stations.length === 0) {
      stationList.innerHTML = '<div class="alert alert-info">No charging stations found.</div>';
      return;
    }

    stationList.innerHTML = stations.map(station => `
      <div class="card mb-3 shadow-sm border-0 rounded-3">
        <div class="card-body">
          <h5 class="card-title text-success fw-bold">⚡ ${station.name}</h5>
          <p class="card-text mb-1"><strong>Price:</strong> ₹${station.pricePerHour || 15}/hr</p>
          <p class="card-text mb-3"><strong>Connectors:</strong> ${station.connectorTypes ? station.connectorTypes.join(', ') : 'CCS2, Type 2'}</p>
          <a href="booking.html?stationId=${station._id}" class="btn btn-success btn-sm px-4 rounded-pill">Book Slot</a>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Error fetching stations:', err);
    stationList.innerHTML = '<div class="alert alert-danger">Failed to connect to backend server.</div>';
  }
});