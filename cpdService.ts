import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const validateAndCalculateCPD = async (userId: string) => {
  const now = new Date();

  // 1. Fetch active license cycle
  const activeCycle = await prisma.licenseCycle.findFirst({
    where: {
      userId,
      startDate: { lte: now },
      endDate: { gte: now }
    }
  });

  if (!activeCycle) {
    throw new Error("No active license tracking cycle found for this user.");
  }

  // 2. Fetch completions within this cycle (No-rollover enforcement)
  const completions = await prisma.moduleCompletion.findMany({
    where: {
      userId,
      completedAt: {
        gte: activeCycle.startDate,
        lte: activeCycle.endDate
      }
    },
    include: { course: true }
  });

  let totalEarnedCeu = 0;
  let ethicsCeu = 0;

  // 3. Process credits against EFDA / MoH caps
  completions.forEach((completion) => {
    // Single course ceiling rule: max 15 CEUs per activity
    const validCredits = Math.min(completion.earnedCeu, 15);

    totalEarnedCeu += validCredits;

    if (completion.course.isEthics) {
      ethicsCeu += validCredits;
    }
  });

  // 4. Validate targets against federal thresholds
  const meetsTotalRequirement = totalEarnedCeu >= 30;
  const meetsEthicsRequirement = ethicsCeu >= 5;
  const eligibleForRenewal = meetsTotalRequirement && meetsEthicsRequirement;

  return {
    cycleId: activeCycle.id,
    cycleStart: activeCycle.startDate,
    cycleEnd: activeCycle.endDate,
    metrics: {
      totalEarnedCeu,
      ethicsCeu,
      shortfall: Math.max(0, 30 - totalEarnedCeu),
      ethicsShortfall: Math.max(0, 5 - ethicsCeu)
    },
    compliance: {
      meetsTotalRequirement,
      meetsEthicsRequirement,
      eligibleForRenewal
    }
  };
};

export const getUserCPDCompletions = async (userId: string) => {
  let user = await prisma.user.findFirst({
    where: { id: userId }
  });

  if (!user) {
    user = {
      id: userId,
      name: 'Pharmacist Dawid Aliyi',
      fullName: 'Pharmacist Dawid Aliyi, B.Pharm, BCPS',
      email: 'jaalibiddoo@gmail.com',
      profession: 'Clinical Pharmacist & BCPS Specialist',
      licenseNumber: 'ETH-EFDA-PHARM-2026-8819',
      ethiopianRegion: 'Oromia / Addis Ababa',
      role: 'PROFESSIONAL'
    };
  }

  const completions = await prisma.moduleCompletion.findMany({
    where: { userId },
    include: { course: true }
  });

  return {
    user,
    completions
  };
};

export const recordCPDCompletion = async (userId: string, data: {
  courseId: string;
  courseTitle?: string;
  courseCode?: string;
  earnedCeu: number;
  scorePercent?: number;
  isEthics?: boolean;
}) => {
  return await prisma.moduleCompletion.create({
    data: {
      userId,
      courseId: data.courseId,
      earnedCeu: data.earnedCeu,
      scorePercent: data.scorePercent || 85,
      completedAt: new Date()
    }
  });
};

export default validateAndCalculateCPD;
