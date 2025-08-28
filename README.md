# Bus Route 80 Tracker - Madison, WI

A real-time bus tracking application for Madison Metro Route 80, featuring an interactive map, live bus location simulation, and schedule information.

## Features

- **Interactive Map**: View Route 80 path with bus stops marked
- **Real-time Simulation**: Watch the bus move along the route in real-time
- **Direction Toggle**: Switch between eastbound and westbound directions
- **Stop Selection**: Click on any stop to view details and location
- **Schedule Display**: See upcoming departures and estimated arrival times
- **Service Alerts**: View current service status and notifications
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## How to Use

1. **Open the Application**: 
   - Navigate to the `bus-route-tracker` folder
   - Open `index.html` in your web browser

2. **View Bus Location**: 
   - The animated bus icon (🚌) shows the current location
   - Bus stops are marked with stop icons (🚏)
   - The red line shows the complete route path

3. **Interactive Controls**:
   - **Refresh Route**: Updates the current schedule and bus information
   - **Toggle Direction**: Switches between eastbound and westbound routes
   - **Stop Selector**: Choose a specific stop to focus on

4. **Map Navigation**:
   - Zoom in/out using mouse wheel or touch gestures
   - Click and drag to pan around the map
   - Click on bus stops or the bus for more information

## Route 80 Information

**Eastbound Route** (towards East Towne Mall):
- State St & Lake St
- University Ave & Park St
- University Ave & Frances St
- University Ave & Babcock Dr
- University Ave & Segoe Rd
- East Campus Mall
- Johnson St & Gorham St
- East Washington Ave & Blair St
- East Washington Ave & First St
- East Towne Mall
- American Pkwy & Stoughton Rd

**Westbound Route** (towards Downtown):
- American Pkwy & Stoughton Rd
- East Towne Mall
- East Washington Ave & First St
- East Washington Ave & Blair St
- Johnson St & Gorham St
- East Campus Mall
- University Ave & Segoe Rd
- University Ave & Babcock Dr
- University Ave & Frances St
- University Ave & Park St
- State St & Lake St

## Technical Details

- **Map Provider**: OpenStreetMap via Leaflet.js
- **Real-time Updates**: Simulated bus movement with 30-second cycles
- **Responsive Design**: CSS Grid and Flexbox for mobile compatibility
- **Browser Support**: Modern browsers with ES6 support

## Files Structure

```
bus-route-tracker/
├── index.html          # Main application file
├── styles.css          # Styling and responsive design
├── script.js           # JavaScript functionality
└── README.md           # This documentation file
```

## Installation

No installation required! Simply open `index.html` in any modern web browser.

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Notes

This is a demonstration application with simulated data. For real-time Madison Metro information, please visit the official Madison Metro website or use their official mobile app.

The bus locations and timing are simulated for demonstration purposes and do not reflect actual bus positions or schedules.
