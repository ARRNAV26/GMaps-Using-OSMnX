This project is a web application that allows users to input the latitude and longitude of a source (src) and destination (dst) location and get the shortest route between these points on a map. 
The route is visualized using a polyline on a Google Map, and the backend utilizes the OSMnx library in Python to calculate the shortest path based on real-world road networks. The frontend is built with React, while the backend calculations are powered by Python and OSMnx.

Features:
Source and Destination Input:

Users can input the latitude and longitude for both the source and destination locations via input fields.
The input fields are dynamically populated and updated as users click on the Google Map to set the coordinates.
Shortest Path Calculation:

Upon entering the source and destination coordinates, the system uses the OSMnx library to compute the shortest path on the road network.
OSMnx is used to download the OpenStreetMap (OSM) road network data for the given area, convert it into a graph, and calculate the shortest path based on various criteria (like distance or travel time).
Polyline Visualization:

The route is visualized on a Google Map as a polyline, showing the shortest path between the source and destination points.
The polyline dynamically updates in real-time as users provide new coordinates or click on the map.
Interactive Google Map Integration:

The frontend integrates Google Maps API for rendering maps and placing markers for the source and destination locations.
When the user clicks anywhere on the map, the corresponding latitude and longitude are displayed in the input fields, allowing for easy selection of the start and end points.
Backend with Python and OSMnx:

The backend performs graph-based calculations using Python and the OSMnx library.
OSMnx fetches real-world street data from OpenStreetMap, constructs a graph, and calculates the shortest path between the given source and destination.
The backend returns the calculated route coordinates in the form of latitude and longitude, which is then used to update the Google Map.
Progressive Loader and Real-time Updates:

A progressive loader spinner is displayed while the backend is processing the shortest path calculation, providing users with feedback that the system is working on their request.
Once the calculation is completed, the route is displayed immediately on the map.
Tech Stack:
Frontend:

React: The main JavaScript library for building the user interface, managing state, and handling map interactions.
Google Maps API: Used to embed the map and provide interactive map features such as setting coordinates and drawing polylines.
Axios: For making HTTP requests from the frontend to the backend to fetch the calculated route.
React Hooks: For managing state and effects, particularly for storing and updating map coordinates.
Backend:

Python: The backend language used for performing the graph-based calculations.
OSMnX: A powerful Python library for working with OpenStreetMap (OSM) data. It’s used to download, visualize, and analyze street networks, and is crucial for calculating the shortest path between the source and destination points.
Flask or FastAPI: A lightweight Python web framework used to expose APIs for the frontend to interact with the backend. This API receives the source and destination coordinates, calculates the shortest path, and returns the coordinates of the route.
How It Works:
Frontend Interactions:

The user opens the web application, where a Google Map is displayed along with two input fields for the source and destination coordinates (latitude and longitude).
The user clicks on the map to set the source and destination, which automatically updates the input fields with the latitude and longitude of the clicked location.
Once both coordinates are set, the user clicks a "Search" button to trigger the shortest path calculation.
The frontend then makes an API request to the backend, sending the source and destination coordinates.
Backend Calculation:

The backend, powered by Python and OSMnx, receives the source and destination coordinates from the frontend.
OSMnx is used to download the road network for the area covering the source and destination points.
The Python backend converts this road network into a graph, where nodes represent intersections and edges represent roads.
The shortest path algorithm (such as Dijkstra’s algorithm) is used to find the shortest route between the source and destination based on the graph.
Returning Data:

After the shortest path is computed, the backend returns the coordinates of the route’s path as a list of latitude and longitude points.
These points are then sent back to the frontend.
Rendering the Route:

On the frontend, the received coordinates are used to update the Google Map with a polyline that represents the shortest route between the source and destination.
The route is drawn on the map with a custom stroke color and width, making it easy to visualize.
The user can interact with the map (zooming in, panning) to see the entire route.
Code Workflow:
Frontend (React & Google Maps API):

The Google Maps component (<Map />) is embedded into the app with default zoom and center settings.
Input fields allow the user to set the source and destination.
Upon clicking the "Search" button, an API call is made to the backend with the coordinates.
The backend response with the polyline coordinates is used to render the path on the map using Polyline from the Google Maps API.

Backend (Python + OSMnx):

OSMnx is used to create a graph and calculate the shortest path.
The API endpoint accepts the source and destination coordinates, fetches the relevant OSM data, and returns the shortest route as coordinates.
python.
Thank you!
