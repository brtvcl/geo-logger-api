# 🎨 My Design Process for Geo Logger API

I needed to find a performant way to log a user’s location and determine the area they had entered. I also had to implement functionality for creating new areas using polygons and retrieving relevant logs.

## 🪢 Constraints:

- Framework: NestJS
- Database: PostgreSQL
- Language: TypeScript

## 💡 My Thought Process and Decisions:

Before jumping into the implementation, I spent time designing the solution and considering the tools I would use. Here’s how I approached the problem:

### 🐘 1. Storing Areas as JSON in PostgreSQL:

My first thought was to store the areas as JSON objects in PostgreSQL. However, as I considered it further, I realized this wouldn’t be a good idea. Querying the areas based on a user’s location would require checking each JSON object manually to determine if the user’s coordinates were inside a given area. This approach would result in slow and inefficient queries as the dataset grew.

### 📐 2. Using PostgreSQL Geometric Types:

Next, I thought about using PostgreSQL’s built-in geometric types. This seemed like a better option because it would allow me to query areas based on a user’s location more efficiently. However, as I dug deeper, I noticed significant limitations. The geometric types only support a basic X,Y coordinate system, and I’d have to write custom logic to determine whether a user’s location fell within an area. While better than JSON, this approach still felt insufficient for the task.

### 🌐 3. Going with PostGIS:

Finally, I explored PostGIS, an extension for PostgreSQL specifically designed for geospatial data. I quickly realized that PostGIS was the ideal solution for my needs. It allows areas to be stored as polygons, supports advanced spatial queries, and has built-in functionality to determine if a user’s location is inside an area. With PostGIS, I wouldn’t need to reinvent the wheel—it offers a powerful, scalable, and feature-rich toolset for geospatial operations.

After weighing the options, I decided to go with PostGIS. It’s the best solution for the problem, enabling me to build a performant and scalable system while leveraging robust spatial capabilities.
