import React, { useEffect, useState, useRef, useCallback } from "react";
import { createRoot } from "react-dom/client";
import './app.css';
import {
  APIProvider,
  Map,
  useMap,
  AdvancedMarker,
  MapCameraChangedEvent,
  Pin
} from "@vis.gl/react-google-maps";

import { MarkerClusterer } from "@googlemaps/markerclusterer";
import type { Marker } from "@googlemaps/markerclusterer";
import { GoogleMap, Polyline } from "@react-google-maps/api";
import getData from "./api";

// Locations for your POIs
type Poi = { key: string; location: google.maps.LatLngLiteral };
const locations: Poi[] = [
  {key: 'vidhanaSoudha', location: { lat: 12.979881, lng: 77.589756 }},
  {key: 'lalbaghBotanicalGarden', location: { lat: 12.949607, lng: 77.584223 }},
  {key: 'bannerghattaBiologicalPark', location: { lat: 12.762128, lng: 77.610217 }},
  {key: 'mchalePark', location: { lat: 12.951744, lng: 77.625785 }},
  {key: 'koramangala', location: { lat: 12.927927, lng: 77.630487 }},
  {key: 'indiranagar', location: { lat: 12.972529, lng: 77.640084 }},
  {key: 'mgRoad', location: { lat: 12.973319, lng: 77.610576 }},
  {key: 'bengaluruPalace', location: { lat: 12.998197, lng: 77.592870 }},
];

const App = () => {
  const [pathCoordinates, setPathCoordinates] = useState([]);
  const [loading, setLoading] = useState(false);

  const spinnerStyles = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 9999,
    display: loading ? "block" : "none",
  };
  // States to track source and destination coordinates
  const [srcLat, setSrcLat] = useState(null);
  const [srcLng, setSrcLng] = useState(null);
  const [dstLat, setDstLat] = useState(null);
  const [dstLng, setDstLng] = useState(null);

  // Function to handle the map click event
  const handleMapClick = (ev) => {
    if (!ev.detail.latLng) {
      console.error("LatLng is undefined or null");
      return;
    }

    const clickedLat = ev.detail.latLng.lat;
    const clickedLng = ev.detail.latLng.lng;

    if (!srcLat && !srcLng) {
      setSrcLat(clickedLat);
      setSrcLng(clickedLng);
      console.log(`Source set at: ${clickedLat}, ${clickedLng}`);
    } else if (srcLat && srcLng && !dstLat && !dstLng) {
      setDstLat(clickedLat);
      setDstLng(clickedLng);
      console.log(`Destination set at: ${clickedLat}, ${clickedLng}`);
    }

    // If both source and destination are set, fetch the route
    if (srcLat && srcLng && dstLat && dstLng) {
      searchPlaces(srcLat, srcLng, dstLat, dstLng);
    }
  };

  const searchPlaces = async (srclat, srclng, dstlat, dstlng) => {
    try {
      setLoading(true);
      const response = await getData('get-shortest-path', {
        src_lat: srclat, 
        src_lng: srclng,
        dst_lat: dstlat,
        dst_lng: dstlng,
      });

      let map: google.maps.Map
      let flightPath: google.maps.Polyline;
      const mapElement = document.getElementById("map") as HTMLElement;
      map = new google.maps.Map(mapElement, {
        zoom: 7,
        center: { lat: 41.879, lng: -87.624 }, // Center on Chicago
      });
      console.log("Map:", map);

      const { route_nodes } = response;

      console.log("HII")
      // Ensure the coordinates are correctly formatted for Google Maps Polyline
      const transformedCoordinates = route_nodes.map((node) => ({
        lat: node.lat,
        lng: node.lng,
      }));

      flightPath = new google.maps.Polyline({
        path: transformedCoordinates,
        geodesic: true,
        strokeColor: "#FF0000",
        strokeOpacity: 8.0,
        strokeWeight: 10,
      });
      console.log("PATHHHHH: ", flightPath)

      flightPath.setMap(map);
      setPathCoordinates(transformedCoordinates);
      setLoading(false);
      console.log("Updated Path Coordinates:", transformedCoordinates);
    } catch (error) {
      setLoading(false);
      console.error("Error in searchPlaces:", error);
    }
  };

  return (
    <>
      <APIProvider
        apiKey={"AIzaSyBKFUFLvhaDEYdSbd5JYu7AVtnLMr4-j0k"}
        libraries={["places"]}
        onLoad={() => console.log("Maps API has loaded.")}
      >
       <div className="coordinate-container-horizontal">
          <div className="coordinate-group-left">
            <div className="coordinate-item">
              <label htmlFor="srcLat">Source Latitude</label>
              <input 
                id="srcLat"
                type="number" 
                value={srcLat || ""} 
                disabled 
                placeholder="Click on the map to set source" 
              />
            </div>
            <div className="coordinate-item">
              <label htmlFor="srcLng">Source Longitude</label>
              <input 
                id="srcLng"
                type="number" 
                value={srcLng || ""} 
                disabled 
                placeholder="Click on the map to set source" 
              />
            </div>
          </div>

          <div className="coordinate-group-right">
            <div className="coordinate-item">
              <label htmlFor="dstLat">Destination Latitude</label>
              <input 
                id="dstLat"
                type="number" 
                value={dstLat || ""} 
                disabled 
                placeholder="Click on the map to set destination" 
              />
            </div>
            <div className="coordinate-item">
              <label htmlFor="dstLng">Destination Longitude</label>
              <input 
                id="dstLng"
                type="number" 
                value={dstLng || ""} 
                disabled 
                placeholder="Click on the map to set destination" 
              />
            </div>
          </div>

          <button 
            type="button" 
            onClick={() => searchPlaces(srcLat, srcLng, dstLat, dstLng)} 
            className="search-btn-horizontal"
          >
            Search
          </button>
        </div>

        <Map
        id="map"
          defaultZoom={13}
          defaultCenter={{ lat: 12.976733, lng: 77.594043 }}
          onCameraChanged={(ev) =>
            console.log("Camera changed:", ev.detail.center, "Zoom:", ev.detail.zoom)
          }
          mapId="da37f3254c6a6d1c"
          onClick={handleMapClick}  // Add onClick event handler
        >
          {/* Render the POI markers */}
          <PoiMarkers pois={locations} />

          {/* Render the polyline only if pathCoordinates is populated */}
          {pathCoordinates.length > 1 && !loading && (
            <Polyline
              path={pathCoordinates}
              options={{
                strokeColor: "#FF0000",
                strokeOpacity: 8,
                strokeWeight: 10,
              }}
            />
          )}

          {loading && (
            <div style={spinnerStyles}>
            <div className="loader"></div>
          </div>
          )}
        </Map>
      </APIProvider>
    </>
  );
}; 
// Marker rendering logic remains the same
const PoiMarkers = (props: { pois: Poi[] }) => {
  const map = useMap();
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
  const clusterer = useRef<MarkerClusterer | null>(null);
  const [circleCenter, setCircleCenter] = useState(null);
  const handleClick = useCallback((ev: google.maps.MapMouseEvent) => {
    if (!map) return;
    if (!ev.latLng) return;
    console.log("marker clicked: ", ev.latLng.toString());
    map.panTo(ev.detail.latLng);
    setCircleCenter(ev.detail.latLng);
  });

  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = (marker: Marker | null, key: string) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers((prev) => {
      if (marker) {
        return { ...prev, [key]: marker };
      } else {
        const newMarkers = { ...prev };
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };

  return (
    <>
      {props.pois.map((poi: Poi) => (
        <AdvancedMarker
          key={poi.key}
          position={poi.location}
          ref={(marker) => setMarkerRef(marker, poi.key)}
          clickable={true}
          onClick={handleClick}
        >
          <Pin
            background={"#FBBC04"}
            glyphColor={"#FFF"}
            borderColor={"#FFF"}
          />
        </AdvancedMarker>
      ))}
    </>
  );
};

export default App;

const root = createRoot(document.getElementById("app"));
root.render(<App />);