import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ReviewStatus } from '../src/draft-reviews/entities/draft-review.entity';
import { User } from 'src/auth/entities/user.entity';
import { UserRole } from 'src/user/entities/user.entity';
import { PuzzleDraftModule } from 'src/puzzle-draft/puzzle-draft.module';
import { DraftStatus } from 'src/puzzle-draft/entities/draft-puzzle.entity';
import { Puzzle } from 'src/puzzle/puzzle.entity';

describe('DraftReviewsController (e2e)', () => {
  let app: INestApplication;
  let puzzleDraftRepository: Repository<PuzzleDraftModule>;
  let puzzleRepository: Repository<Puzzle>;
  let userRepository: Repository<User>;
  let reviewerToken: string;
  let contributorToken: string;
  let testDraftId: string;
  let reviewerId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();

    // Get repositories
    puzzleDraftRepository = moduleFixture.get<Repository<PuzzleDraftModule>>(
      getRepositoryToken(PuzzleDraftModule),
    );
    puzzleRepository = moduleFixture.get<Repository<Puzzle>>(
      getRepositoryToken(Puzzle),
    );
    userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );
    const jwtService = moduleFixture.get<JwtService>(JwtService);

    // Clean up database before tests
    await puzzleRepository.query('DELETE FROM puzzles;');
    await puzzleDraftRepository.query('DELETE FROM puzzle_drafts;');
    await userRepository.query('DELETE FROM users;');

    // Create users with different roles
    const reviewer = await userRepository.save({
      email: 'reviewer@test.com',
      password_hash: 'hash',
      role: UserRole.REVIEWER,
    });
    const contributor = await userRepository.save({
      email: 'contributor@test.com',
      password_hash: 'hash',
      role: UserRole.CONTRIBUTOR,
    });
    reviewerId = reviewer.id;

    // Create JWTs for users
    reviewerToken = jwtService.sign({
      sub: reviewer.id,
      email: reviewer.email,
      role: reviewer.role,
    });
    contributorToken = jwtService.sign({
      sub: contributor.id,
      email: contributor.email,
      role: contributor.role,
    });

    // Create a draft to be reviewed
    const draft = await puzzleDraftRepository.save({
      title: 'Draft for Review',
      description: 'A test draft.',
      question: 'Is this a test?',
      solution: 'Yes.',
      status: DraftStatus.IN_REVIEW,
      authorId: contributor.id,
    });
    testDraftId = draft.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/drafts/review-pending (GET) -> should list drafts pending review for a reviewer', () => {
    return request(app.getHttpServer())
      .get('/drafts/review-pending')
      .set('Authorization', `Bearer ${reviewerToken}`)
      .expect(200)
      .then((res) => {
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].id).toBe(testDraftId);
        expect(res.body[0].status).toBe(DraftStatus.IN_REVIEW);
      });
  });

  it('/drafts/:id/review (POST) -> should fail if a non-reviewer tries to submit a review', () => {
    return request(app.getHttpServer())
      .post(`/drafts/${testDraftId}/review`)
      .set('Authorization', `Bearer ${contributorToken}`)
      .send({ status: ReviewStatus.APPROVED, feedback: 'Looks good!' })
      .expect(403); // Forbidden
  });

  it('/drafts/:id/review (POST) -> should allow a reviewer to approve a draft, updating its status and creating a puzzle', async () => {
    await request(app.getHttpServer())
      .post(`/drafts/${testDraftId}/review`)
      .set('Authorization', `Bearer ${reviewerToken}`)
      .send({
        status: ReviewStatus.APPROVED,
        feedback: 'Approved for publication.',
      })
      .expect(201)
      .then((res) => {
        expect(res.body.status).toBe(ReviewStatus.APPROVED);
        expect(res.body.reviewerId).toBe(reviewerId);
      });

    // Verify draft status transition
    const updatedDraft = await puzzleDraftRepository.findOneBy({
      id: testDraftId,
    });
    expect(updatedDraft.status).toBe(DraftStatus.APPROVED);

    // Verify that the puzzle was created in the main puzzles table
    const newPuzzle = await puzzleRepository.findOne({
      where: { title: 'Draft for Review' },
    });
    expect(newPuzzle).toBeDefined();
    expect(newPuzzle.description).toBe('A test draft.');
  });
});
