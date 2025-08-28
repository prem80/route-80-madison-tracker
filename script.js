// Madison Metro Route 80 Bus Tracker
class Route80Tracker {
    constructor() {
        this.map = null;
        this.busMarker = null;
        this.routeLine = null;
        this.stopMarkers = [];
        this.currentDirection = 'eastbound';
        this.busPosition = 0; // Position along route (0-1)
        this.isRunning = false;
        
        // Route 80 bus stops data (approximate locations in Madison, WI)
        this.busStops = {
            eastbound: [
                { name: "State St & Lake St", lat: 43.0731, lng: -89.4012, time: "07:15" },
                { name: "University Ave & Park St", lat: 43.0753, lng: -89.4009, time: "07:20" },
                { name: "University Ave & Frances St", lat: 43.0762, lng: -89.3945, time: "07:25" },
                { name: "University Ave & Babcock Dr", lat: 43.0774, lng: -89.3856, time: "07:30" },
                { name: "University Ave & Segoe Rd", lat: 43.0788, lng: -89.3742, time: "07:35" },
                { name: "East Campus Mall", lat: 43.0799, lng: -89.3687, time: "07:40" },
                { name: "Johnson St & Gorham St", lat: 43.0789, lng: -89.3612, time: "07:45" },
                { name: "East Washington Ave & Blair St", lat: 43.0823, lng: -89.3534, time: "07:50" },
                { name: "East Washington Ave & First St", lat: 43.0856, lng: -89.3423, time: "07:55" },
                { name: "East Towne Mall", lat: 43.0934, lng: -89.3198, time: "08:05" },
                { name: "American Pkwy & Stoughton Rd", lat: 43.0987, lng: -89.3067, time: "08:12" }
            ],
            westbound: [
                { name: "American Pkwy & Stoughton Rd", lat: 43.0987, lng: -89.3067, time: "17:15" },
                { name: "East Towne Mall", lat: 43.0934, lng: -89.3198, time: "17:22" },
                { name: "East Washington Ave & First St", lat: 43.0856, lng: -89.3423, time: "17:32" },
                { name: "East Washington Ave & Blair St", lat: 43.0823, lng: -89.3534, time: "17:37" },
                { name: "Johnson St & Gorham St", lat: 43.0789, lng: -89.3612, time: "17:42" },
                { name: "East Campus Mall", lat: 43.0799, lng: -89.3687, time: "17:47" },
                { name: "University Ave & Segoe Rd", lat: 43.0788, lng: -89.3742, time: "17:52" },
                { name: "University Ave & Babcock Dr", lat: 43.0774, lng: -89.3856, time: "17:57" },
                { name: "University Ave & Frances St", lat: 43.0762, lng: -89.3945, time: "18:02" },
                { name: "University Ave & Park St", lat: 43.0753, lng: -89.4009, time: "18:07" },
                { name: "State St & Lake St", lat: 43.0731, lng: -89.4012, time: "18:12" }
            ]
        };
        
        this.currentBusLocation = { lat: 43.0731, lng: -89.4012 };
        this.nextStopIndex = 0;
        
        this.init();
    }
    
    init() {
        this.initializeMap();
        this.setupEventListeners();
        this.populateStopSelector();
        this.startSimulation();
        this.updateLastUpdateTime();
    }
    
    initializeMap() {
        // Initialize Leaflet map centered on Madison, WI
        this.map = L.map('map').setView([43.0731, -89.3656], 12);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);
        
        this.drawRoute();
        this.addBusStops();
        this.addBusMarker();
    }
    
    drawRoute() {
        const currentStops = this.busStops[this.currentDirection];
        const routeCoordinates = currentStops.map(stop => [stop.lat, stop.lng]);
        
        if (this.routeLine) {
            this.map.removeLayer(this.routeLine);
        }
        
        this.routeLine = L.polyline(routeCoordinates, {
            color: '#e74c3c',
            weight: 4,
            opacity: 0.7
        }).addTo(this.map);
        
        // Fit map to show entire route
        this.map.fitBounds(this.routeLine.getBounds(), { padding: [20, 20] });
    }
    
    addBusStops() {
        // Clear existing stop markers
        this.stopMarkers.forEach(marker => this.map.removeLayer(marker));
        this.stopMarkers = [];
        
        const currentStops = this.busStops[this.currentDirection];
        
        currentStops.forEach((stop, index) => {
            const marker = L.marker([stop.lat, stop.lng], {
                icon: L.divIcon({
                    className: 'bus-stop-marker',
                    html: '🚏',
                    iconSize: [20, 20],
                    iconAnchor: [10, 10]
                })
            }).addTo(this.map);
            
            marker.bindPopup(`
                <div class="stop-popup">
                    <strong>${stop.name}</strong><br>
                    <small>Scheduled: ${stop.time}</small><br>
                    <small>Stop ${index + 1} of ${currentStops.length}</small>
                </div>
            `);
            
            this.stopMarkers.push(marker);
        });
    }
    
    addBusMarker() {
        if (this.busMarker) {
            this.map.removeLayer(this.busMarker);
        }
        
        this.busMarker = L.marker([this.currentBusLocation.lat, this.currentBusLocation.lng], {
            icon: L.divIcon({
                className: 'bus-marker',
                html: '🚌',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            })
        }).addTo(this.map);
        
        this.busMarker.bindPopup(`
            <div class="bus-popup">
                <strong>Route 80 Bus</strong><br>
                <small>Direction: ${this.currentDirection}</small><br>
                <small>Status: On Time</small>
            </div>
        `);
    }
    
    setupEventListeners() {
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.refreshRoute();
        });
        
        document.getElementById('toggleDirection').addEventListener('click', () => {
            this.toggleDirection();
        });
        
        document.getElementById('stopSelector').addEventListener('change', (e) => {
            this.selectStop(e.target.value);
        });
    }
    
    populateStopSelector() {
        const selector = document.getElementById('stopSelector');
        selector.innerHTML = '<option value="">Select a stop...</option>';
        
        const currentStops = this.busStops[this.currentDirection];
        currentStops.forEach((stop, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = stop.name;
            selector.appendChild(option);
        });
    }
    
    startSimulation() {
        this.isRunning = true;
        this.simulateBusMovement();
    }
    
    simulateBusMovement() {
        if (!this.isRunning) return;
        
        const currentStops = this.busStops[this.currentDirection];
        const currentStop = currentStops[this.nextStopIndex];
        const nextStop = currentStops[(this.nextStopIndex + 1) % currentStops.length];
        
        // Simulate movement towards next stop
        const progress = (Date.now() % 30000) / 30000; // 30 second cycle
        
        if (currentStop && nextStop) {
            const lat = currentStop.lat + (nextStop.lat - currentStop.lat) * progress;
            const lng = currentStop.lng + (nextStop.lng - currentStop.lng) * progress;
            
            this.currentBusLocation = { lat, lng };
            
            if (this.busMarker) {
                this.busMarker.setLatLng([lat, lng]);
            }
            
            // Update UI
            this.updateBusInfo(currentStop, nextStop, progress);
        }
        
        // Move to next stop every 30 seconds
        if (progress > 0.95) {
            this.nextStopIndex = (this.nextStopIndex + 1) % currentStops.length;
            this.updateSchedule();
        }
        
        setTimeout(() => this.simulateBusMovement(), 1000);
    }
    
    updateBusInfo(currentStop, nextStop, progress) {
        document.getElementById('currentDirection').textContent = 
            this.currentDirection.charAt(0).toUpperCase() + this.currentDirection.slice(1);
        
        document.getElementById('nextStop').textContent = nextStop.name;
        
        const eta = Math.ceil((1 - progress) * 5); // 5 minutes max
        document.getElementById('eta').textContent = `${eta} minutes`;
        
        const status = progress > 0.8 ? 'Approaching' : 'En Route';
        const statusElement = document.getElementById('busStatus');
        statusElement.textContent = status;
        statusElement.className = progress > 0.8 ? 'status-delayed' : 'status-active';
    }
    
    updateSchedule() {
        const scheduleList = document.getElementById('scheduleList');
        const currentStops = this.busStops[this.currentDirection];
        
        scheduleList.innerHTML = '';
        
        // Show next 3 stops
        for (let i = 0; i < 3; i++) {
            const stopIndex = (this.nextStopIndex + i) % currentStops.length;
            const stop = currentStops[stopIndex];
            
            const scheduleItem = document.createElement('div');
            scheduleItem.className = 'schedule-item';
            
            const currentTime = new Date();
            const arrivalTime = new Date(currentTime.getTime() + (i + 1) * 5 * 60000); // 5 min intervals
            
            scheduleItem.innerHTML = `
                <span class="time">${arrivalTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                <span class="stop">${stop.name}</span>
            `;
            
            scheduleList.appendChild(scheduleItem);
        }
    }
    
    refreshRoute() {
        const btn = document.getElementById('refreshBtn');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '⟳ Refreshing...';
        btn.disabled = true;
        
        // Simulate refresh delay
        setTimeout(() => {
            this.updateLastUpdateTime();
            this.updateSchedule();
            
            btn.innerHTML = originalText;
            btn.disabled = false;
            
            // Show refresh notification
            this.showAlert('Route data refreshed successfully!', 'info');
        }, 2000);
    }
    
    toggleDirection() {
        this.currentDirection = this.currentDirection === 'eastbound' ? 'westbound' : 'eastbound';
        this.nextStopIndex = 0;
        this.busPosition = 0;
        
        // Update current bus location to first stop of new direction
        const firstStop = this.busStops[this.currentDirection][0];
        this.currentBusLocation = { lat: firstStop.lat, lng: firstStop.lng };
        
        this.drawRoute();
        this.addBusStops();
        this.addBusMarker();
        this.populateStopSelector();
        this.updateSchedule();
        
        this.showAlert(`Switched to ${this.currentDirection} direction`, 'info');
    }
    
    selectStop(stopIndex) {
        if (stopIndex === '') return;
        
        const currentStops = this.busStops[this.currentDirection];
        const selectedStop = currentStops[parseInt(stopIndex)];
        
        if (selectedStop) {
            this.map.setView([selectedStop.lat, selectedStop.lng], 15);
            
            // Find and open the popup for this stop
            const marker = this.stopMarkers[parseInt(stopIndex)];
            if (marker) {
                marker.openPopup();
            }
        }
    }
    
    updateLastUpdateTime() {
        const now = new Date();
        document.getElementById('lastUpdate').textContent = 
            now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
    
    showAlert(message, type = 'info') {
        const alertsContainer = document.getElementById('serviceAlerts');
        const alertItem = document.createElement('div');
        alertItem.className = `alert-item alert-${type}`;
        alertItem.innerHTML = `
            <p>${message}</p>
            <small>Just now</small>
        `;
        
        // Remove existing alerts of same type
        const existingAlerts = alertsContainer.querySelectorAll(`.alert-${type}`);
        existingAlerts.forEach(alert => alert.remove());
        
        alertsContainer.appendChild(alertItem);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (alertItem.parentNode) {
                alertItem.parentNode.removeChild(alertItem);
            }
        }, 5000);
    }
}

// CSS for custom markers
const style = document.createElement('style');
style.textContent = `
    .bus-stop-marker, .bus-marker {
        background: none;
        border: none;
        font-size: 20px;
        text-shadow: 0 0 3px rgba(0,0,0,0.7);
    }
    
    .bus-marker {
        font-size: 24px;
        animation: busMove 2s ease-in-out infinite;
    }
    
    @keyframes busMove {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-2px); }
    }
    
    .stop-popup, .bus-popup {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        min-width: 150px;
        text-align: center;
    }
    
    .stop-popup strong, .bus-popup strong {
        color: #2c3e50;
        display: block;
        margin-bottom: 5px;
    }
    
    .stop-popup small, .bus-popup small {
        color: #7f8c8d;
        display: block;
        margin-bottom: 2px;
    }
`;
document.head.appendChild(style);

// Initialize the route tracker when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Route80Tracker();
});

// Handle window resize for responsive map
window.addEventListener('resize', () => {
    setTimeout(() => {
        if (window.routeTracker && window.routeTracker.map) {
            window.routeTracker.map.invalidateSize();
        }
    }, 100);
});
