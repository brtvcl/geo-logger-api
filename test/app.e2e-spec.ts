import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Geo Logger API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      // Import the AppModule (or whichever module you want to test)
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/areas (GET)', () => {
    it('should retrieve all areas', async () => {
      const response = await request(app.getHttpServer()).get('/areas');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('areas');
      expect(Array.isArray(response.body.areas)).toBe(true);
    });
  });

  describe('/areas (POST)', () => {
    it('should create a new area', async () => {
      const payload = {
        name: 'Test Area',
        boundary: [
          { lat: 37.7749, lon: -122.4194 },
          { lat: 37.775, lon: -122.4195 },
          { lat: 37.7751, lon: -122.4196 },
          { lat: 37.7749, lon: -122.4194 },
        ],
      };

      const response = await request(app.getHttpServer())
        .post('/areas')
        .send(payload);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', payload.name);
    });
  });

  describe('/locations (POST)', () => {
    it('should log a user location', async () => {
      const payload = {
        userId: 'test-user-123',
        lat: 37.7749,
        lon: -122.4194,
      };

      const response = await request(app.getHttpServer())
        .post('/locations')
        .send(payload);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('logged', true);
      expect(response.body).toHaveProperty('area');
    });
  });

  describe('/logs (GET)', () => {
    it('should retrieve logs', async () => {
      const response = await request(app.getHttpServer()).get('/logs');
      console.log(response.body);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('logs');
      expect(Array.isArray(response.body.logs)).toBe(true);

      if (response.body.logs.length > 0) {
        const log = response.body.logs[0];
        expect(log).toHaveProperty('id');
        expect(log).toHaveProperty('user');
        expect(log).toHaveProperty('area');
        expect(log).toHaveProperty('createdAt');
      }
    });
  });
});
