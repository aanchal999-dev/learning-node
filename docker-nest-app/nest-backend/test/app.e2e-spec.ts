import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import * as fs from 'fs/promises';
import * as path from 'path';
import { AppModule } from './../src/app.module';

describe('Nest Application Endpoints (e2e)', () => {
  let app: INestApplication<App>;
  let userToken: string;
  let adminToken: string;

  const testUser = {
    name: 'E2E Test User',
    designation: 'QA Tester',
    username: `user_${Date.now()}@example.com`,
    password: 'password123',
  };

  const adminUser = {
    name: 'E2E Admin User',
    designation: 'Lead Admin',
    username: 'admin@login.com',
    password: 'adminpassword123',
  };

  beforeAll(async () => {
    // Reset data storage for clean, idempotent test execution
    await fs.writeFile(
      path.join(process.cwd(), 'storage', 'data.json'),
      '[]',
      'utf8',
    );

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('1. GET / (Root Endpoint)', () => {
    it('should return 200 OK and "Hello World!"', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello World!');
    });
  });

  describe('2. POST /auth/register', () => {
    it('should register a new standard user successfully (201 Created)', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201);

      expect(response.body).toEqual({
        message: 'User registered successfully',
      });
    });

    it('should reject registering duplicate username with 409 Conflict', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(409);

      expect(response.body.message).toBe('Username already exists!');
    });

    it('should register an admin user successfully (201 Created)', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(adminUser)
        .expect(201);

      expect(response.body).toEqual({
        message: 'User registered successfully',
      });
    });
  });

  describe('3. POST /auth/login', () => {
    it('should authenticate regular user and return JWT token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: testUser.username,
          password: testUser.password,
        })
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body.role).toBe('user');
      expect(response.body.message).toBe('Login successful');

      userToken = response.body.token;
    });

    it('should authenticate admin user and return token with admin role', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: adminUser.username,
          password: adminUser.password,
        })
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body.role).toBe('admin');

      adminToken = response.body.token;
    });

    it('should reject login with wrong password (401 Unauthorized)', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: testUser.username,
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body.message).toBe('Invalid credentials!');
    });
  });

  describe('4. GET /users (UserController)', () => {
    it('should reject request without token with 401 Unauthorized', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .expect(401);

      expect(response.body.message).toBe('Access token missing');
    });

    it('should return only self details for regular user', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].username).toBe(testUser.username);
    });

    it('should return all users for admin user', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });
  });
});
