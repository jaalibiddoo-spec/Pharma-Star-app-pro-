import { validateAndCalculateCPD } from '../cpdService.ts';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const expect = (actual: any) => ({
  toBe: (expected: any) => {
    if (actual !== expected) {
      throw new Error(`Assertion failed: expected ${expected}, got ${actual}`);
    }
  }
});

export const runCPDTests = async () => {
  const mockUserId = 'test-health-prof-id';
  const currentYearStart = new Date('2026-01-01T00:00:00Z');
  const currentYearEnd = new Date('2026-12-31T23:59:59Z');

  const beforeEachSetup = async () => {
    // Clear test tables
    await prisma.moduleCompletion.deleteMany({});
    await prisma.licenseCycle.deleteMany({});
    await prisma.course.deleteMany({});
    await prisma.user.deleteMany({});

    // Setup basic profile
    await prisma.user.create({
      data: {
        id: mockUserId,
        email: 'doctor@health.gov.et',
        fullName: 'Dr. Abebe Kebede',
        profession: 'DOCTOR',
        licenseNumber: 'DM-12345'
      }
    });

    // Create current operational window
    await prisma.licenseCycle.create({
      data: {
        userId: mockUserId,
        startDate: currentYearStart,
        endDate: currentYearEnd
      }
    });
  };

  console.log('--- Running Ethiopian MoH CPD Guideline Rules Validation ---');

  // Rule 1: Caps single course credit payout at a maximum of 15 CEUs
  await beforeEachSetup();
  console.log('Rule 1: Caps single course credit payout at a maximum of 15 CEUs');
  const oversizedCourse = await prisma.course.create({
    data: { title: 'Advanced Surgery Seminar', ceuCredits: 20, isEthics: false }
  });

  await prisma.moduleCompletion.create({
    data: {
      userId: mockUserId,
      courseId: oversizedCourse.id,
      earnedCeu: 20,
      completedAt: new Date('2026-06-15T10:00:00Z')
    }
  });

  const status1 = await validateAndCalculateCPD(mockUserId);
  expect(status1.metrics.totalEarnedCeu).toBe(15);
  expect(status1.compliance.eligibleForRenewal).toBe(false);
  console.log('✓ Rule 1 Passed: Total capped at 15 CEUs.');

  // Rule 2: Denies renewal if the 5 CEU ethics floor is not met
  await beforeEachSetup();
  console.log('Rule 2: Denies renewal if the 5 CEU ethics floor is not met');
  const coreMedicalCourse = await prisma.course.create({
    data: { title: 'Internal Medicine Review', ceuCredits: 30, isEthics: false }
  });

  await prisma.moduleCompletion.create({
    data: {
      userId: mockUserId,
      courseId: coreMedicalCourse.id,
      earnedCeu: 15,
      completedAt: new Date('2026-07-20T10:00:00Z')
    }
  });

  const status2 = await validateAndCalculateCPD(mockUserId);
  expect(status2.metrics.ethicsCeu).toBe(0);
  expect(status2.compliance.meetsTotalRequirement).toBe(false);
  expect(status2.compliance.eligibleForRenewal).toBe(false);
  console.log('✓ Rule 2 Passed: Denied without 5 CEU ethics floor.');

  // Rule 3: Enforces no-rollover rule by ignoring historical context records
  await beforeEachSetup();
  console.log('Rule 3: Enforces no-rollover rule by ignoring historical context records');
  const expiredCourse = await prisma.course.create({
    data: { title: '2025 General Ethics Course', ceuCredits: 10, isEthics: true }
  });

  await prisma.moduleCompletion.create({
    data: {
      userId: mockUserId,
      courseId: expiredCourse.id,
      earnedCeu: 10,
      completedAt: new Date('2025-11-10T10:00:00Z')
    }
  });

  const status3 = await validateAndCalculateCPD(mockUserId);
  expect(status3.metrics.totalEarnedCeu).toBe(0);
  expect(status3.metrics.ethicsCeu).toBe(0);
  console.log('✓ Rule 3 Passed: Historical completions ignored.');

  // Rule 4: Approves renewal status when professional criteria balance satisfies constraints
  await beforeEachSetup();
  console.log('Rule 4: Approves renewal status when professional criteria balance satisfies constraints');
  const ethicsCourse = await prisma.course.create({
    data: { title: 'Healthcare Pro Ethics', ceuCredits: 5, isEthics: true }
  });
  const clinicalCourse = await prisma.course.create({
    data: { title: 'Pediatric Care', ceuCredits: 25, isEthics: false }
  });

  await prisma.moduleCompletion.create({
    data: { userId: mockUserId, courseId: ethicsCourse.id, earnedCeu: 5 }
  });
  await prisma.moduleCompletion.create({
    data: { userId: mockUserId, courseId: clinicalCourse.id, earnedCeu: 25 }
  });

  const status4 = await validateAndCalculateCPD(mockUserId);
  expect(status4.metrics.totalEarnedCeu).toBe(20);
  expect(status4.compliance.eligibleForRenewal).toBe(false);

  const extraCourse = await prisma.course.create({
    data: { title: 'Emergency Triage', ceuCredits: 10, isEthics: false }
  });
  await prisma.moduleCompletion.create({
    data: { userId: mockUserId, courseId: extraCourse.id, earnedCeu: 10 }
  });

  const updatedStatus = await validateAndCalculateCPD(mockUserId);
  expect(updatedStatus.metrics.totalEarnedCeu).toBe(30);
  expect(updatedStatus.compliance.eligibleForRenewal).toBe(true);
  console.log('✓ Rule 4 Passed: 30 CEUs with >=5 ethics approved for renewal.');

  console.log('All 4 Ethiopian MoH CPD rules validated successfully!');
};

runCPDTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
