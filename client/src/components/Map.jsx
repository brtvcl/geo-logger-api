import React, { useEffect, useRef, useState } from "react";
import maplibregl, { Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import useGlobalState from "../hooks/useGlobalState";

function Map({}) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lat] = useState(41);
  const [lon] = useState(29);
  const [zoom] = useState(13);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [areas, setAreas] = useGlobalState("areas", []);

  window.add = () => {
    // Add the polygon as a GeoJSON source
    map.current.addSource("kadikoy", {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [28.95004656571524, 41.00921436055259],
              [28.95768170321014, 41.00076586445704],
              [28.977806276946637, 41.01424615436926],
              [28.94639162742598, 41.02733312618756],
              [28.95004656571524, 41.00921436055259], // Close the polygon
            ],
          ],
        },
      },
    });

    // Add the polygon layer
    map.current.addLayer({
      id: "polygon-layer",
      type: "fill",
      source: "kadikoy",
      layout: {},
      paint: {
        "fill-color": "#88ff88", // Polygon color
        "fill-opacity": 0.5, // Polygon opacity
      },
    });

    // Add a border to the polygon
    map.current.addLayer({
      id: "polygon-outline",
      type: "line",
      source: "kadikoy",
      layout: {},
      paint: {
        "line-color": "#00dd00", // Border color
        "line-width": 2, // Border width
      },
    });
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
      center: [lon, lat],
      zoom: zoom,
    });

    map.current.on("load", () => {
      setIsMapLoaded(true);
    });

    return () => map.current.remove();
  }, [lat, lon, zoom]);

  window.r = () => {
    // remove all polygons
    map.current.removeLayer("polygon-layer");
    map.current.removeLayer("polygon-outline");
  };

  useEffect(() => {
    if (!map.current || !isMapLoaded) return;

    console.log("areas changed", areas);

    // Clear all areas
    map.current.getStyle().layers.forEach((layer) => {
      if (
        layer.id.startsWith("polygon-layer-") ||
        layer.id.startsWith("polygon-outline-")
      ) {
        map.current.removeLayer(layer.id);
      }
    });

    areas.forEach((area) => {
      const areaName = crypto.randomUUID();
      // Add the polygon as a GeoJSON source
      map.current.addSource(areaName, {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [area.boundary.map((point) => [point.lon, point.lat])],
          },
        },
      });

      // Add the polygon layer
      map.current.addLayer({
        id: "polygon-layer-" + areaName,
        type: "fill",
        source: areaName,
        layout: {},
        paint: {
          "fill-color": "#88ff88", // Polygon color
          "fill-opacity": 0.5, // Polygon opacity
        },
      });

      // Add a border to the polygon
      map.current.addLayer({
        id: "polygon-outline-" + areaName,
        type: "line",
        source: areaName,
        layout: {},
        paint: {
          "line-color": "#00dd00", // Border color
          "line-width": 2, // Border width
        },
      });
    });
  }, [areas, isMapLoaded]);

  return (
    <div className="h-screen">
      <div ref={mapContainer} className="h-full" />
    </div>
  );
}

export default Map;
