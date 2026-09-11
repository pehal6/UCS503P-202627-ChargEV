const socket = typeof io !== 'undefined' ? io() : null;

document.addEventListener('DOMContentLoaded', () => {
    // Determine which page we are on and initialize the respective functionality
    if (document.getElementById('stations-grid')) {
        loadStationsGrid();
    }
    if (document.getElementById('stationSelect')) {
        initializeBookingPage();
    }
});

// ================= STATION PAGE: GRID RENDER =================
async function loadStationsGrid() {
    try {
        const res = await fetch('/api/stations');
        const stations = await res.json();
        const grid = document.getElementById('stations-grid');
        grid.innerHTML = '';

        stations.forEach(station => {
            const availablePorts = station.totalPorts - station.bookedPorts;
            const badgeClass = availablePorts > 1 ? 'bg-success' : (availablePorts === 1 ? 'bg-warning text-dark' : 'bg-danger');
            
            grid.innerHTML += `
                <div class="col-md-4" id="station-card-${station.stationId}">
                    <div class="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
                        <div class="position-relative">
                            <img src="${station.imageUrl}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=600';" class="card-img-top" style="height: 200px; object-fit: cover;">
                            <span id="badge-${station.stationId}" class="position-absolute top-0 end-0 m-3 badge ${badgeClass} px-3 py-2 rounded-pill shadow-sm">
                                ${availablePorts} ${availablePorts === 1 ? 'Port' : 'Ports'} Free
                            </span>
                        </div>
                        <div class="card-body p-4 d-flex flex-column justify-content-between">
                            <div>
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <span class="badge bg-light text-success border border-success">${station.connectorType}</span>
                                    <small class="fw-bold text-muted">${station.powerOutput}</small>
                                </div>
                                <h4 class="fw-bold mb-1">${station.name}</h4>
                                <p class="text-muted small mb-2"><i class="bi bi-geo-alt-fill text-success me-1"></i> ${station.location}</p>
                                <a href="${station.googleMapsUrl}" target="_blank" rel="noopener noreferrer" class="text-decoration-none text-success small fw-bold mb-3 d-inline-block">
                                    <i class="bi bi-map-fill me-1"></i> Open in Google Maps <i class="bi bi-box-arrow-up-right ms-1 small"></i>
                                </a>
                            </div>
                            <a href="booking.html?station=${station.stationId}" class="btn btn-outline-success w-100 rounded-pill fw-bold py-2 mt-2">Book Slot</a>
                        </div>
                    </div>
                </div>
            `;
        });
    } catch (err) {
        console.error('Error loading stations grid:', err);
    }
}

// ================= BOOKING PAGE: DROPDOWNS & SUMMARIES =================
async function initializeBookingPage() {
    const stationSelect = document.getElementById('stationSelect');
    const bookingDate = document.getElementById('bookingDate');
    const timeSlot = document.getElementById('timeSlot');
    
    const summaryStation = document.getElementById('summary-station');
    const summarySlot = document.getElementById('summary-slot');
    const bookingForm = document.getElementById('booking-form');

    // Pre-set minimum date on booking to Today
    const today = new Date().toISOString().split('T')[0];
    bookingDate.min = today;

    let stations = [];

    try {
        // Fetch Stations for dropdown
        const res = await fetch('/api/stations');
        stations = await res.json();
        
        stationSelect.innerHTML = '<option value="" disabled selected>Choose a charging hub...</option>';
        
        stations.forEach(station => {
            const availablePorts = station.totalPorts - station.bookedPorts;
            const statusLabel = availablePorts > 0 ? `${availablePorts} free` : 'FULL';
            stationSelect.innerHTML += `<option value="${station.stationId}" ${availablePorts === 0 ? 'disabled' : ''}>${station.name} (${statusLabel})</option>`;
        });

        // Autoselect if query parameters are found (e.g. ?station=tata-leela)
        const urlParams = new URLSearchParams(window.location.search);
        const queryStation = urlParams.get('station');
        if (queryStation) {
            stationSelect.value = queryStation;
            updateSummary();
        }
    } catch (err) {
        console.error('Error populating booking stations select:', err);
        stationSelect.innerHTML = '<option value="" disabled>Error loading stations</option>';
    }

    // Dynamic label changes to real-time update booking panel Summary right-side 
    function updateSummary() {
        const selectedId = stationSelect.value;
        const activeStation = stations.find(s => s.stationId === selectedId);

        if (activeStation) {
            summaryStation.innerText = activeStation.name;
            // Pre-select Connector Type based on Station output if appropriate
            const connectorSelect = document.getElementById('connectorType');
            if (activeStation.connectorType.includes('Type 2')) {
                connectorSelect.value = "Type 2 AC";
            } else {
                connectorSelect.value = "CCS2 Fast DC";
            }
        } else {
            summaryStation.innerText = "Not Selected";
        }

        const dateVal = bookingDate.value;
        const slotVal = timeSlot.value;

        if (dateVal && slotVal) {
            const formattedDate = new Date(dateVal).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
            summarySlot.innerText = `${formattedDate} @ ${slotVal}`;
        } else if (slotVal) {
            summarySlot.innerText = slotVal;
        } else {
            summarySlot.innerText = "Select date and time";
        }
    }

    // Bind event handlers 
    stationSelect.addEventListener('change', updateSummary);
    bookingDate.addEventListener('change', updateSummary);
    timeSlot.addEventListener('change', updateSummary);

    // Form Booking submission handler
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const selectedId = stationSelect.value;
        const activeStation = stations.find(s => s.stationId === selectedId);

        const bookingData = {
            stationId: selectedId,
            stationName: activeStation ? activeStation.name : 'EV Hub',
            date: bookingDate.value,
            timeSlot: timeSlot.value,
            connectorType: document.getElementById('connectorType').value,
            vehicleNumber: document.getElementById('vehicleNumber').value.trim()
        };

        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData)
            });

            if (response.ok) {
                alert('Success! Your reservation has been booked.');
                window.location.href = 'mybooking.html';
            } else {
                const error = await response.json();
                alert('Booking failed: ' + error.message);
            }
        } catch (err) {
            console.error('Booking submission error:', err);
            alert('Something went wrong. Please try again.');
        }
    });
}

// ================= LIVE WEB SOCKET LISTENER =================
if (socket) {
    socket.on('port_count_updated', (data) => {
        const badge = document.getElementById(`badge-${data.stationId}`);
        if (badge) {
            badge.innerText = `${data.availablePorts} ${data.availablePorts === 1 ? 'Port' : 'Ports'} Free`;
            badge.className = `position-absolute top-0 end-0 m-3 badge ${data.availablePorts > 1 ? 'bg-success' : (data.availablePorts === 1 ? 'bg-warning text-dark' : 'bg-danger')} px-3 py-2 rounded-pill shadow-sm`;
        }
    });
}