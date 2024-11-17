# 🧭 Geo Logger API

Log users location and the area they entered. Create new area with given polygon. Get logs.

<p>
<img src="https://avatars.githubusercontent.com/u/1759716?s=200&v=4" alt="PostGIS logo" height="60">
<img src="https://avatars.githubusercontent.com/u/177543?s=200&v=4" alt="Postgres logo" height="60">
<img src="https://avatars.githubusercontent.com/u/9950313?s=200&v=4" alt="Node.js logo" height="60">
<img src="https://nestjs.com/img/logo-small.svg" height="60" alt="Nest Logo" />
</p>

More resources here

- [The Design Process](/docs/DESIGN_PROCESS.md)
- [Example Requests](/docs/EXAMPLE_REQUESTS.md)
- [Optimizations Done for Performance](/docs/OPTIMIZATION.md)
- [Enhancements That Can Be Added](/docs/ENHANCEMENTS.md)

## 📦 Prequisites

1. Node.js installed on your computer
2. PostGIS enabled Postgres database

You can use docker to quickly spinup an instance of PostGIS with following command

```
docker run --env=POSTGRES_PASSWORD=pgadmin -p 5432:5432 postgis/postgis:latest
```

## 🚚 Installation

1. Clone the repo

2. Install dependencies

   `npm i`

3. Create a `.env` file

   .env.example can be used as a template

4. Run the server

   `npm run start` or `npm run start:dev`

## 📖 OpenAPI documentation

After running the server (`npm run start` or `npm run start:dev`), you can access the API documentation at `http://localhost:3000/api`

## 🌱 Seed data

To seed database run the following command. This will create some users and areas for easy testing.

```
npm run seed
```

## 🧪 Testing

To run tests

```
npm run test
```
