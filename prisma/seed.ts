import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { PrismaClient } from '../src/generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

function loadExercises() {
  const filePath = resolve(import.meta.dirname, '../db/dist/exercises.nd.json')
  const raw = readFileSync(filePath, 'utf-8')
  // File is pretty-printed JSON objects placed back-to-back (no array wrapper)
  // Split on the boundary between adjacent objects: }  {
  const chunks = raw.split(/\}\s*\n\s*\{/).map((chunk, i, arr) => {
    if (arr.length === 1) return chunk
    if (i === 0) return chunk + '}'
    if (i === arr.length - 1) return '{' + chunk
    return '{' + chunk + '}'
  })
  return chunks.map((chunk) => JSON.parse(chunk))
}

async function main() {
  console.log('🌱 Seeding database...')

  const raw = loadExercises()
  // Drop the source string `id` — our schema uses autoincrement
  const data = raw.map(({ id: _id, ...rest }) => rest)

  await prisma.exercise.deleteMany()

  const BATCH_SIZE = 100
  let total = 0
  for (let i = 0; i < data.length; i += BATCH_SIZE) {
    const result = await prisma.exercise.createMany({
      data: data.slice(i, i + BATCH_SIZE),
    })
    total += result.count
  }

  console.log(`✅ Seeded ${total} exercises`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
