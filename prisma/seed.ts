import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Nudge templates - gentle reminders for families
const nudgeTemplates = [
  // ===== QUALITY TIME - Connection with family =====
  {
    title: 'Play with your kids',
    titleKey: 'play_with_kids',
    description: 'Take some time to play and connect',
    emoji: '🎮',
    category: 'QUALITY_TIME',
    applicableTo: 'MEMBER',
    memberTypes: ['CHILD_TODDLER', 'CHILD_PRESCHOOL', 'CHILD_SCHOOL', 'CHILD_TEEN'],
    assetTypes: [],
    defaultFrequency: 'DAILY',
    isBuiltIn: true,
  },
  {
    title: 'Ask about their day',
    titleKey: 'ask_about_day',
    description: 'Show interest in their life',
    emoji: '💬',
    category: 'CHECK_IN',
    applicableTo: 'MEMBER',
    memberTypes: ['CHILD_SCHOOL', 'CHILD_TEEN', 'ADULT'],
    assetTypes: [],
    defaultFrequency: 'DAILY',
    isBuiltIn: true,
  },
  {
    title: 'Family dinner together',
    titleKey: 'family_dinner',
    description: 'Eat together as a family',
    emoji: '🍽️',
    category: 'QUALITY_TIME',
    applicableTo: 'FAMILY',
    memberTypes: [],
    assetTypes: [],
    defaultFrequency: 'DAILY',
    isBuiltIn: true,
  },
  {
    title: 'Read bedtime story',
    titleKey: 'bedtime_story',
    description: 'End the day with a story',
    emoji: '📖',
    category: 'QUALITY_TIME',
    applicableTo: 'MEMBER',
    memberTypes: ['CHILD_TODDLER', 'CHILD_PRESCHOOL', 'CHILD_SCHOOL'],
    assetTypes: [],
    defaultFrequency: 'DAILY',
    isBuiltIn: true,
  },

  // ===== CALL & CHECK IN =====
  {
    title: 'Call your parents',
    titleKey: 'call_parents',
    description: 'Check in with mom and dad',
    emoji: '📞',
    category: 'CALL',
    applicableTo: 'FAMILY',
    memberTypes: [],
    assetTypes: [],
    defaultFrequency: 'WEEKLY',
    isBuiltIn: true,
  },
  {
    title: 'Call grandparents',
    titleKey: 'call_grandparents',
    description: 'They love hearing from you',
    emoji: '👵',
    category: 'CALL',
    applicableTo: 'FAMILY',
    memberTypes: [],
    assetTypes: [],
    defaultFrequency: 'WEEKLY',
    isBuiltIn: true,
  },
  {
    title: 'Send a photo to family',
    titleKey: 'send_photo',
    description: 'Share a moment from your day',
    emoji: '📸',
    category: 'CHECK_IN',
    applicableTo: 'FAMILY',
    memberTypes: [],
    assetTypes: [],
    defaultFrequency: 'WEEKLY',
    isBuiltIn: true,
  },

  // ===== APPRECIATION =====
  {
    title: 'Tell them you\'re proud',
    titleKey: 'tell_proud',
    description: 'Let them know you appreciate them',
    emoji: '🌟',
    category: 'APPRECIATION',
    applicableTo: 'MEMBER',
    memberTypes: ['CHILD_PRESCHOOL', 'CHILD_SCHOOL', 'CHILD_TEEN'],
    assetTypes: [],
    defaultFrequency: 'WEEKLY',
    isBuiltIn: true,
  },
  {
    title: 'Say "I love you"',
    titleKey: 'say_love',
    description: 'Simple but powerful',
    emoji: '❤️',
    category: 'APPRECIATION',
    applicableTo: 'MEMBER',
    memberTypes: ['ADULT', 'CHILD_TODDLER', 'CHILD_PRESCHOOL', 'CHILD_SCHOOL', 'CHILD_TEEN'],
    assetTypes: [],
    defaultFrequency: 'DAILY',
    isBuiltIn: true,
  },
  {
    title: 'Give a compliment',
    titleKey: 'give_compliment',
    description: 'Notice something good',
    emoji: '💫',
    category: 'APPRECIATION',
    applicableTo: 'MEMBER',
    memberTypes: ['ADULT'],
    assetTypes: [],
    defaultFrequency: 'DAILY',
    isBuiltIn: true,
  },
  {
    title: 'Surprise with flowers',
    titleKey: 'buy_flowers',
    description: 'Just because',
    emoji: '💐',
    category: 'APPRECIATION',
    applicableTo: 'MEMBER',
    memberTypes: ['ADULT'],
    assetTypes: [],
    defaultFrequency: 'MONTHLY',
    isBuiltIn: true,
  },

  // ===== PET CARE =====
  {
    title: 'Play with the cat',
    titleKey: 'play_with_cat',
    description: 'Some quality time with your furry friend',
    emoji: '🐱',
    category: 'PET_CARE',
    applicableTo: 'MEMBER',
    memberTypes: ['PET'],
    assetTypes: [],
    defaultFrequency: 'DAILY',
    isBuiltIn: true,
  },
  {
    title: 'Walk the dog',
    titleKey: 'walk_dog',
    description: 'Fresh air for everyone',
    emoji: '🐕',
    category: 'PET_CARE',
    applicableTo: 'MEMBER',
    memberTypes: ['PET'],
    assetTypes: [],
    defaultFrequency: 'DAILY',
    isBuiltIn: true,
  },

  // ===== SELF CARE =====
  {
    title: 'Take time for yourself',
    titleKey: 'self_care',
    description: 'You matter too',
    emoji: '🧘',
    category: 'SELF_CARE',
    applicableTo: 'ANY',
    memberTypes: [],
    assetTypes: [],
    defaultFrequency: 'DAILY',
    isBuiltIn: true,
  },
  {
    title: 'Date night',
    titleKey: 'date_night',
    description: 'Time for just the two of you',
    emoji: '💑',
    category: 'QUALITY_TIME',
    applicableTo: 'ANY',
    memberTypes: [],
    assetTypes: [],
    defaultFrequency: 'WEEKLY',
    isBuiltIn: true,
  },

  // ===== HOME & ERRANDS =====
  {
    title: 'Water the plants',
    titleKey: 'water_plants',
    description: 'Keep them happy',
    emoji: '🌱',
    category: 'HOME',
    applicableTo: 'ASSET',
    memberTypes: [],
    assetTypes: ['HOUSE', 'APARTMENT', 'GARDEN'],
    defaultFrequency: 'WEEKLY',
    isBuiltIn: true,
  },
  {
    title: 'Take out the trash',
    titleKey: 'take_trash',
    description: 'Keep the home fresh',
    emoji: '🗑️',
    category: 'HOME',
    applicableTo: 'ASSET',
    memberTypes: [],
    assetTypes: ['HOUSE', 'APARTMENT'],
    defaultFrequency: 'WEEKLY',
    isBuiltIn: true,
  },
  {
    title: 'Pay the bills',
    titleKey: 'pay_bills',
    description: 'Stay on top of things',
    emoji: '📄',
    category: 'BILLS',
    applicableTo: 'ASSET',
    memberTypes: [],
    assetTypes: ['HOUSE', 'APARTMENT'],
    defaultFrequency: 'MONTHLY',
    isBuiltIn: true,
  },

  // ===== HEALTH =====
  {
    title: 'Schedule a checkup',
    titleKey: 'health_checkup',
    description: 'Regular health check',
    emoji: '🏥',
    category: 'HEALTH',
    applicableTo: 'MEMBER',
    memberTypes: ['ADULT', 'CHILD_BABY', 'CHILD_TODDLER', 'CHILD_PRESCHOOL', 'CHILD_SCHOOL', 'CHILD_TEEN'],
    assetTypes: [],
    defaultFrequency: 'MONTHLY',
    isBuiltIn: true,
  },
  {
    title: 'Dentist appointment',
    titleKey: 'dentist',
    description: 'Keep those teeth healthy',
    emoji: '🦷',
    category: 'HEALTH',
    applicableTo: 'MEMBER',
    memberTypes: ['ADULT', 'CHILD_TODDLER', 'CHILD_PRESCHOOL', 'CHILD_SCHOOL', 'CHILD_TEEN'],
    assetTypes: [],
    defaultFrequency: 'MONTHLY',
    isBuiltIn: true,
  },

  // ===== CELEBRATIONS =====
  {
    title: 'Plan something special',
    titleKey: 'plan_special',
    description: 'Birthday or anniversary coming up?',
    emoji: '🎉',
    category: 'CELEBRATION',
    applicableTo: 'ANY',
    memberTypes: [],
    assetTypes: [],
    defaultFrequency: 'MONTHLY',
    isBuiltIn: true,
  },
  {
    title: 'Look at old photos',
    titleKey: 'old_photos',
    description: 'Remember good times together',
    emoji: '📷',
    category: 'MEMORY',
    applicableTo: 'FAMILY',
    memberTypes: [],
    assetTypes: [],
    defaultFrequency: 'MONTHLY',
    isBuiltIn: true,
  },

  // ===== CAR MAINTENANCE =====
  {
    title: 'Check the car',
    titleKey: 'car_check',
    description: 'Oil, tires, lights',
    emoji: '🚗',
    category: 'HOME',
    applicableTo: 'ASSET',
    memberTypes: [],
    assetTypes: ['CAR'],
    defaultFrequency: 'MONTHLY',
    isBuiltIn: true,
  },
];

type NudgeTemplateInput = {
  title: string;
  titleKey?: string;
  description?: string;
  emoji?: string;
  category: string;
  applicableTo: string;
  memberTypes: string[];
  assetTypes: string[];
  defaultFrequency: string;
  isBuiltIn: boolean;
};

async function main() {
  console.log('Seeding nudge templates...');

  for (const template of nudgeTemplates as NudgeTemplateInput[]) {
    await prisma.nudgeTemplate.upsert({
      where: { titleKey: template.titleKey || template.title },
      update: {
        title: template.title,
        description: template.description,
        emoji: template.emoji,
        category: template.category as any,
        applicableTo: template.applicableTo as any,
        memberTypes: template.memberTypes as any,
        assetTypes: template.assetTypes as any,
        defaultFrequency: template.defaultFrequency as any,
        isBuiltIn: template.isBuiltIn,
      },
      create: {
        title: template.title,
        titleKey: template.titleKey,
        description: template.description,
        emoji: template.emoji,
        category: template.category as any,
        applicableTo: template.applicableTo as any,
        memberTypes: template.memberTypes as any,
        assetTypes: template.assetTypes as any,
        defaultFrequency: template.defaultFrequency as any,
        isBuiltIn: template.isBuiltIn,
      },
    });
  }

  console.log(`Seeded ${nudgeTemplates.length} nudge templates`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
