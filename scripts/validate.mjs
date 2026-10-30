#!/usr/bin/env node
// Validates categories.json and every places/<slug>.json. Exits 1 and lists every problem.
//
// Usage: node scripts/validate.mjs [repo dir]   (defaults to the repo this script is in)

import { readFileSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import Ajv2020 from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'

const root = resolve(process.argv[2] ?? join(import.meta.dirname, '..'))
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/

const errors = []
const error = (file, message) => errors.push(`${file}: ${message}`)

const ajv = new Ajv2020({ allErrors: true, strict: true })
addFormats(ajv, ['uri'])
const schema = (kind) => ajv.compile(JSON.parse(readFileSync(join(root, 'schema', `${kind}.schema.json`), 'utf8')))
const validators = { categories: schema('categories'), place: schema('place') }

function load(file, kind) {
  let value
  try {
    value = JSON.parse(readFileSync(join(root, file), 'utf8'))
  } catch (e) {
    error(file, `not valid JSON: ${e.message}`)
    return undefined
  }
  if (validators[kind](value)) return value
  for (const e of validators[kind].errors) {
    const extra = e.params?.additionalProperty ? ` "${e.params.additionalProperty}"` : ''
    error(file, `${e.instancePath || '(root)'} ${e.message}${extra}`)
  }
  return undefined
}

/** The url without query, fragment, "www." or trailing slash, to spot the same place twice. */
const canonicalUrl = (value) => {
  const url = new URL(value)
  return `${url.hostname.replace(/^www\./, '')}${url.pathname}`.replace(/\/$/, '').toLowerCase()
}

const categories = load('categories.json', 'categories') ?? []
const categorySlugs = new Set(categories.map((c) => c.slug))
if (categorySlugs.size !== categories.length) error('categories.json', 'duplicate slug')

const urls = new Map()
let count = 0
for (const name of readdirSync(join(root, 'places')).sort()) {
  const file = `places/${name}`
  if (!name.endsWith('.json')) {
    error(file, 'unexpected file (only <slug>.json belongs here)')
    continue
  }
  const slug = name.slice(0, -5)
  if (!SLUG.test(slug)) error(file, `"${slug}" is not a valid file name (lowercase words joined by hyphens)`)
  const place = load(file, 'place')
  if (!place) continue
  count++
  if (!categorySlugs.has(place.category)) error(file, `unknown category "${place.category}" (see categories.json)`)
  const key = canonicalUrl(place.url)
  if (urls.has(key)) error(file, `same url as ${urls.get(key)}`)
  urls.set(key, file)
}

if (errors.length) {
  console.error(`${errors.length} problem(s):`)
  for (const e of errors) console.error(`  ${e}`)
  process.exit(1)
}
console.log(`OK: ${count} places in ${categories.length} categories.`)
