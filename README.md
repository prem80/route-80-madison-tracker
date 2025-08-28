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

## Hosting on GitHub Pages

To host this application on GitHub Pages for free:

### Step 1: Create a GitHub Repository
1. Go to [GitHub.com](https://github.com) and sign in (or create an account)
2. Click the "+" icon in the top right and select "New repository"
3. Name your repository (e.g., `madison-bus-80-tracker`)
4. Make sure it's set to "Public"
5. Check "Add a README file"
6. Click "Create repository"

### Step 2: Upload Your Files
1. In your new repository, click "uploading an existing file"
2. Drag and drop all files from the `bus-route-tracker` folder:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `README.md`
3. Write a commit message like "Add bus tracker application"
4. Click "Commit changes"

### Step 3: Enable GitHub Pages
1. In your repository, click on "Settings" tab
2. Scroll down to "Pages" in the left sidebar
3. Under "Source", select "Deploy from a branch"
4. Choose "main" branch and "/ (root)" folder
5. Click "Save"

### Step 4: Access Your Live Site
- GitHub will provide a URL like: `https://yourusername.github.io/madison-bus-80-tracker`
- It may take a few minutes for the site to be available
- You can find the URL in the "Pages" settings section

### Alternative: One-Click Deployment
You can also fork this repository and enable Pages directly:
1. Visit the repository containing this code
2. Click "Fork" to copy it to your account
3. Follow steps 3-4 above to enable Pages

### Custom Domain (Optional)
If you have your own domain:
1. In "Pages" settings, add your custom domain
2. Update your domain's DNS settings to point to GitHub Pages
3. Enable "Enforce HTTPS" for security

The application will be fully functional on GitHub Pages with no additional configuration needed!

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Notes

This is a demonstration application with simulated data. For real-time Madison Metro information, please visit the official Madison Metro website or use their official mobile app.

The bus locations and timing are simulated for demonstration purposes and do not reflect actual bus positions or schedules.
