import { PrismaClient } from '../src/generated/prisma/client.js'

import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding database...')

  await prisma.exercise.deleteMany()

  const exercises = await prisma.exercise.createMany({
    data: [
      {
        name: 'Barbell Back Squat',
        category: 'strength',
        level: 'intermediate',
        force: 'push',
        mechanic: 'compound',
        equipment: 'barbell',
        primaryMuscles: ['quadriceps'],
        secondaryMuscles: ['glutes', 'hamstrings', 'calves'],
        instructions: [
          'Stand with the bar across your upper back.',
          'Brace your core and unrack the bar.',
          'Lower until your thighs are parallel to the floor.',
          'Drive through your heels to return to standing.',
        ],
        images: [],
      },
      {
        name: 'Conventional Deadlift',
        category: 'strength',
        level: 'intermediate',
        force: 'pull',
        mechanic: 'compound',
        equipment: 'barbell',
        primaryMuscles: ['lower back'],
        secondaryMuscles: ['glutes', 'hamstrings', 'quadriceps', 'traps'],
        instructions: [
          'Stand with feet hip-width apart, bar over mid-foot.',
          'Hinge at the hips and grip the bar just outside your legs.',
          'Brace your core, keep your back flat, and drive through the floor.',
          'Lock out hips and knees at the top, then lower with control.',
        ],
        images: [],
      },
      {
        name: 'Bench Press',
        category: 'strength',
        level: 'beginner',
        force: 'push',
        mechanic: 'compound',
        equipment: 'barbell',
        primaryMuscles: ['chest'],
        secondaryMuscles: ['triceps', 'front deltoids'],
        instructions: [
          'Lie flat on the bench with feet on the floor.',
          'Grip the bar slightly wider than shoulder-width.',
          'Lower the bar to your chest under control.',
          'Press the bar back up to full extension.',
        ],
        images: [],
      },
      {
        name: 'Pull-Up',
        category: 'strength',
        level: 'intermediate',
        force: 'pull',
        mechanic: 'compound',
        equipment: 'body only',
        primaryMuscles: ['lats'],
        secondaryMuscles: ['biceps', 'middle back'],
        instructions: [
          'Hang from a bar with an overhand grip, arms fully extended.',
          'Pull your chest toward the bar by driving your elbows down.',
          'Pause at the top, then lower yourself with control.',
        ],
        images: [],
      },
      {
        name: 'Overhead Press',
        category: 'strength',
        level: 'intermediate',
        force: 'push',
        mechanic: 'compound',
        equipment: 'barbell',
        primaryMuscles: ['shoulders'],
        secondaryMuscles: ['triceps', 'traps'],
        instructions: [
          'Stand with the bar at collarbone height, grip just outside shoulder-width.',
          'Brace your core and press the bar straight overhead.',
          'Lock out at the top, then lower back to the start.',
        ],
        images: [],
      },
      {
        name: 'Romanian Deadlift',
        category: 'strength',
        level: 'intermediate',
        force: 'pull',
        mechanic: 'compound',
        equipment: 'barbell',
        primaryMuscles: ['hamstrings'],
        secondaryMuscles: ['glutes', 'lower back'],
        instructions: [
          'Stand holding a barbell at hip height with an overhand grip.',
          'Push your hips back while lowering the bar along your legs.',
          'Stop when you feel a deep stretch in your hamstrings.',
          'Drive your hips forward to return to standing.',
        ],
        images: [],
      },
      {
        name: 'Incline Dumbbell Press',
        category: 'strength',
        level: 'beginner',
        force: 'push',
        mechanic: 'compound',
        equipment: 'dumbbell',
        primaryMuscles: ['chest'],
        secondaryMuscles: ['triceps', 'front deltoids'],
        instructions: [
          'Set a bench to a 30–45° incline and sit back with a dumbbell in each hand.',
          'Press the dumbbells up and together over your upper chest.',
          'Lower them slowly until your elbows are at 90°.',
          'Press back up to the starting position.',
        ],
        images: [],
      },
      {
        name: 'Barbell Row',
        category: 'strength',
        level: 'intermediate',
        force: 'pull',
        mechanic: 'compound',
        equipment: 'barbell',
        primaryMuscles: ['middle back'],
        secondaryMuscles: ['lats', 'biceps', 'rear deltoids'],
        instructions: [
          'Hinge forward at the hips until your torso is near parallel to the floor.',
          'Grip the bar just outside shoulder-width with an overhand grip.',
          'Pull the bar into your lower ribcage, squeezing your shoulder blades.',
          'Lower the bar with control back to the start.',
        ],
        images: [],
      },
    ],
  })

  console.log(`✅ Created ${exercises.count} exercises`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
