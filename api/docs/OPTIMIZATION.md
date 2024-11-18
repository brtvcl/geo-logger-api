# 🚀 Optimization

For performance optimization when checking location inside an area, I created another column called envelope in the `Area` table. The envelope is a simpler polygon of the area. For example area may have 1000 vertices and envelope will have around 40. When checking if a location is inside an area, I first check if the location is inside the envelope. If it is, I then check if it is inside the area polygon. This optimization reduces the number of calculations required to determine if a location is inside an area, improving the overall performance of the system.

The envelope is not required when creating an area as parameter from user, it is automatically calculated when an area is created or updated. The envelope is calculated using custom function with the help of turf.js. If PostGIS with GEOS 3.11.0+ is used, the envelope can be calculated using the built-in ST_SimplifyPolygonHull function to simplify the area polygon.
