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
        name: 'Kadıköy',
        boundary: [
          {
            lat: 40.99739228147985,
            lon: 29.022587077418677,
          },
          {
            lat: 40.99326824626053,
            lon: 29.02401101664401,
          },
          {
            lat: 40.989239271092885,
            lon: 29.01852913834483,
          },
          {
            lat: 40.97979719428349,
            lon: 29.021926733739576,
          },
          {
            lat: 40.98009289536219,
            lon: 29.028703599438074,
          },
          {
            lat: 40.983435823175085,
            lon: 29.032878142309045,
          },
          {
            lat: 40.98146858144122,
            lon: 29.037296099014725,
          },
          {
            lat: 40.9750776907936,
            lon: 29.039903405888367,
          },
          {
            lat: 40.969368491657946,
            lon: 29.03638304767594,
          },
          {
            lat: 40.96740315638817,
            lon: 29.041595542330015,
          },
          {
            lat: 40.9707521304143,
            lon: 29.048629650455155,
          },
          {
            lat: 40.9638624035544,
            lon: 29.058922057735828,
          },
          {
            lat: 40.96376286131681,
            lon: 29.068042488766395,
          },
          {
            lat: 40.95815449062022,
            lon: 29.072863480437775,
          },
          {
            lat: 40.955100476680144,
            lon: 29.08159734013219,
          },
          {
            lat: 40.963413348749015,
            lon: 29.09399457332492,
          },
          {
            lat: 40.966467671741555,
            lon: 29.09786065977883,
          },
          {
            lat: 40.986376157298935,
            lon: 29.08652454238282,
          },
          {
            lat: 40.99670109188057,
            lon: 29.063989558547576,
          },
          {
            lat: 41.00316097644378,
            lon: 29.03887415654259,
          },
          {
            lat: 40.99739228147985,
            lon: 29.022587077418677,
          },
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
        userId: '00000000-0000-0000-0000-000000000000',
        lat: 40.9892312,
        lon: 29.0440731,
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
