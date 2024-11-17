import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import simplifyAndBuffer from '../../src/utils/simplify-and-buffer';

const prisma = new PrismaClient();

async function main() {
  // Insert users
  const users = JSON.parse(
    fs.readFileSync('./prisma/seed/users.json', 'utf8'),
  ).users;

  for (const user of users) {
    await prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
      },
    });
  }

  // Insert Areas
  // Minified districts are the smaller versions of the districts
  // So they are not intersecting with each other
  // And some of are left out because I couldn't fix the intersection problem just by making them smaller
  const istanbulDistricts = JSON.parse(
    fs.readFileSync('./prisma/seed/minified-districts.json', 'utf8'),
  ).features;

  // Run in serail to ensure intersection check
  for (let index = 0; index < istanbulDistricts.length; index++) {
    const district = istanbulDistricts[index];
    const boundaryPolygonText = `POLYGON((${district.geometry.coordinates[0]
      .map((coordinate) => `${coordinate[0]} ${coordinate[1]}`)
      .join(', ')}))`;

    const intersectingArea: { id: string; name: string }[] =
      await prisma.$queryRaw`
    SELECT "id", "name"
    FROM "Area"
    WHERE ST_Intersects(boundary, ST_GeomFromText(${boundaryPolygonText}, 4326))
    LIMIT 1
  `;

    if (intersectingArea.length > 0) {
      throw new Error(
        'Intersecting area found for district: ' + district.properties.name,
      );
    }

    const envelope = simplifyAndBuffer({
      polygon: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: district.geometry.coordinates,
        },
      },
      tolerance: 0.01,
      units: 'kilometers',
      maxDepth: 100,
    });

    const envelopePolygonText = `POLYGON((${envelope.geometry.coordinates[0].map((point) => `${point[0]} ${point[1]}`).join(', ')}))`;

    const id = crypto.randomUUID();

    // Insert envelope and boundary into the database
    await prisma.$queryRaw`
      INSERT INTO "Area"
      ("id", "name", "boundary", "envelope", "updatedAt") VALUES (
        ${id},
        ${district.properties.name},
        ST_GeomFromText(${boundaryPolygonText}, 4326),
        ST_GeomFromText(${envelopePolygonText}, 4326),
        NOW()
      )`;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
