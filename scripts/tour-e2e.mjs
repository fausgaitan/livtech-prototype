/* eslint-disable no-console */
// E2E for the Guided Showcase: the welcome modal greets a fresh profile
// and starts the visual tour, which ends with the feedback ask, then the
// UX tour launches from Prototype Options → "See UX Details". Screenshots
// every step.
// Run: node scripts/tour-e2e.mjs
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import puppeteer from 'puppeteer-core'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const BASE = 'http://localhost:5175'

const visualTitles = [
  'Option A - Bold & Structured',
  'Option B - Light & Streamlined',
  'Option C - Soft & Elevated',
  'Your Favorite',
  'Your Least Favorite',
  'One Last Thing',
  'Thanks for Your Feedback',
]

const uxTitles = [
  'Cold-Toned Data Visualizations',
  'Collapsible Sidebar',
  'Product Suite Switcher',
  'Focused Modals',
  'Contextual Drawer',
]

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  userDataDir: mkdtempSync(join(tmpdir(), 'tour-e2e-')),
  args: ['--window-size=1400,900'],
  defaultViewport: { width: 1366, height: 742 },
})

const page = await browser.newPage()
let failures = 0

// Block the real Google Sheet endpoint so test runs never pollute it,
// while still counting that the app fired the submission request.
let feedbackPosts = 0
await page.setRequestInterception(true)
page.on('request', (req) => {
  if (req.url().includes('script.google.com')) {
    feedbackPosts++
    req.abort()
  } else {
    req.continue()
  }
})

// Click a button inside the welcome modal by its exact label.
async function clickWelcome(label) {
  await page.evaluate((text) => {
    const btn = [
      ...document.querySelectorAll('#welcome-modal button'),
    ].find((b) => b.textContent?.trim() === text)
    btn?.click()
  }, label)
  await new Promise((r) => setTimeout(r, 300))
}

// Wait for the welcome modal, then page through the three intro panels
// (Next × 2) so the Start the Tour / Maybe later actions are on screen.
async function openWelcomeActions(shot) {
  const appeared = await page
    .waitForFunction(() => document.querySelector('#welcome-modal'), {
      timeout: 8000,
    })
    .then(() => true)
    .catch(() => false)
  console.log(appeared ? '✓ welcome modal shown' : '✗ welcome modal missing')
  if (!appeared) {
    failures++
    return false
  }
  await new Promise((r) => setTimeout(r, 400)) // let the entry animation settle
  await page.screenshot({ path: `/tmp/e2e-${shot}-p1.png` })
  await clickWelcome('Next')
  await clickWelcome('Next')
  const onLastPanel = await page.evaluate(() =>
    [...document.querySelectorAll('#welcome-modal button')].some(
      (b) => b.textContent?.trim() === 'Start the Tour',
    ),
  )
  console.log(
    onLastPanel
      ? '✓ welcome panels paged to actions'
      : '✗ welcome panels did not reach actions',
  )
  if (!onLastPanel) failures++
  await page.screenshot({ path: `/tmp/e2e-${shot}.png` })
  return onLastPanel
}

async function clickTourNext() {
  return page.evaluate(() => {
    const buttons = [...document.querySelectorAll('button')]
    // Joyride's primary button shows progress ("Next (2 of 5)") — don't match
    // the app's own pagination "Next" button on the Prospects page.
    const next = buttons.find((b) =>
      /Next \(\d+ of \d+\)|^Submit$|^Close$/.test(
        b.textContent?.trim() ?? '',
      ),
    )
    if (next) {
      next.click()
      return next.textContent
    }
    return null
  })
}

async function runTour(name, titles, shot, interact = true) {
  for (let i = 0; i < titles.length; i++) {
    const expected = titles[i]
    try {
      await page.waitForFunction(
        (t) => document.body.innerText.includes(t),
        { timeout: 8000 },
        expected,
      )
      await new Promise((r) => setTimeout(r, 600)) // let animations settle

      // Style steps carry the view switcher too.
      if (interact && expected === 'Option A - Bold & Structured') {
        const hasSwitcher = await page.evaluate(() =>
          document.body.innerText.includes('See the style on:'),
        )
        console.log(
          hasSwitcher
            ? '✓ view switcher on style step'
            : '✗ view switcher missing on style step',
        )
        if (!hasSwitcher) failures++
      }

      // On the feedback steps, actually answer: pick an option + comment.
      if (
        interact &&
        (expected === 'Your Favorite' || expected === 'Your Least Favorite')
      ) {
        // Verify the in-tooltip view switcher flips routes under the tour.
        if (expected === 'Your Favorite') {
          await page.evaluate(() => {
            // Last match = the tooltip's segment (the sidebar also says Prospects)
            const link = [...document.querySelectorAll('button')]
              .filter((b) => b.textContent?.trim() === 'Prospects')
              .at(-1)
            link?.click()
          })
          await new Promise((r) => setTimeout(r, 500))
          const onProspects = page.url().includes('/clinical/prospects')
          console.log(
            onProspects
              ? '✓ view switcher → Prospects'
              : '✗ view switcher did not navigate',
          )
          if (!onProspects) failures++
          await page.screenshot({ path: '/tmp/e2e-view-switch.png' })
          await page.evaluate(() => {
            const link = [...document.querySelectorAll('button')]
              .filter((b) => b.textContent?.trim() === 'Dashboard')
              .at(-1)
            link?.click()
          })
          await new Promise((r) => setTimeout(r, 500))
        }

        const pick = expected === 'Your Favorite' ? 'Option C' : 'Option A'
        await page.evaluate((label) => {
          const btn = [...document.querySelectorAll('button')].find(
            (b) => b.textContent?.trim() === label,
          )
          btn?.click()
        }, pick)
        await page.type('textarea', `E2E note for ${pick}`)
        await new Promise((r) => setTimeout(r, 200))
      }

      // On the name step, leave a name before hitting Submit.
      if (interact && expected === 'One Last Thing') {
        await page.type('input[placeholder="Your name (optional)"]', 'E2E Tester')
        await new Promise((r) => setTimeout(r, 200))
      }

      await page.screenshot({ path: `/tmp/e2e-${shot}-${i + 1}.png` })
      console.log(`✓ ${name} step ${i + 1}: "${expected}"`)
    } catch {
      failures++
      await page.screenshot({ path: `/tmp/e2e-${shot}-${i + 1}-FAIL.png` })
      console.log(`✗ ${name} step ${i + 1}: "${expected}" NOT FOUND`)
      return
    }
    const clicked = await clickTourNext()
    if (!clicked) {
      failures++
      console.log(`✗ ${name} step ${i + 1}: no Next button found`)
      return
    }
  }
}

// --- Welcome modal → visual tour on first load -------------------------------
await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' })
await openWelcomeActions('welcome')
await clickWelcome('Start the Tour')
await runTour('visual', visualTitles, 'visual')

await new Promise((r) => setTimeout(r, 800))
const afterVisual = await page.evaluate(() => ({
  tooltipGone: !document.body.innerText.includes('Thanks for Your Feedback'),
  seenFlag: localStorage.getItem('livtech-guided-showcase-seen'),
  feedback: localStorage.getItem('livtech-tour-feedback'),
}))
console.log('after visual tour:', JSON.stringify(afterVisual))
console.log(
  feedbackPosts > 0
    ? `✓ sheet POST fired (${feedbackPosts}, blocked in test)`
    : '✗ sheet POST never fired',
)
if (feedbackPosts === 0) failures++
if (
  !afterVisual.feedback?.includes('"favorite":"C"') ||
  !afterVisual.feedback?.includes('"name":"E2E Tester"') ||
  !afterVisual.feedback?.includes('"submittedAt"')
) {
  failures++
  console.log('✗ feedback not persisted correctly')
}

// Submitted → the vote nudge must be retired.
const nudgeGone = await page.evaluate(
  () => !document.body.innerText.includes('Vote on the 3 styles'),
)
console.log(
  nudgeGone
    ? '✓ nudge hidden after submission'
    : '✗ nudge still visible after submission',
)
if (!nudgeGone) failures++

// --- UX tour: launched from Prototype Options -------------------------------
await page.click('#prototype-options')
await page.evaluate(() => {
  const btn = [...document.querySelectorAll('button')].find((b) =>
    b.textContent?.includes('See UX Details'),
  )
  btn?.click()
})
await runTour('ux', uxTitles, 'ux')

// After both tours: overlays gone, app explorable
await new Promise((r) => setTimeout(r, 800))
const after = await page.evaluate(() => ({
  tooltipGone: !document.body.innerText.includes('Contextual Drawer'),
  modalGone: !document.querySelector('#add-evaluation-modal'),
  drawerGone: !document.querySelector('#review-drawer'),
}))
console.log('after ux tour:', JSON.stringify(after))
if (!after.modalGone || !after.drawerGone) failures++
await page.screenshot({ path: '/tmp/e2e-after.png' })

// Reload — the welcome modal should greet again on every refresh, with the
// already-submitted note on its final panel, and Start should launch the tour.
await page.reload({ waitUntil: 'networkidle0' })
await openWelcomeActions('welcome-resubmit')
const submittedNote = await page.evaluate(() =>
  document.body.innerText.includes('You already submitted feedback'),
)
console.log(
  submittedNote
    ? '✓ welcome modal shows already-submitted note'
    : '✗ already-submitted note missing',
)
if (!submittedNote) failures++
await clickWelcome('Start the Tour')
const autoReran = await page
  .waitForFunction(
    () => document.body.innerText.includes('Option A - Bold & Structured'),
    { timeout: 8000 },
  )
  .then(() => true)
  .catch(() => false)
console.log(
  autoReran ? '✓ tour starts after reload' : '✗ tour did not start after reload',
)
if (!autoReran) failures++

// --- Re-run after submission: SHORT tour, style steps only ------------------
await runTour('rerun', visualTitles.slice(0, 3), 'rerun', false)

// The 3rd click ended the tour — no questions should follow.
await new Promise((r) => setTimeout(r, 800))
const shortTour = await page.evaluate(() => ({
  questionsSkipped: !document.body.innerText.includes('Your Favorite'),
  tooltipGone: !document.body.innerText.includes('Option C - Soft & Elevated'),
}))
console.log('short re-run:', JSON.stringify(shortTour))
if (!shortTour.questionsSkipped || !shortTour.tooltipGone) failures++

// --- Panel: Submitted tag + Reset Feedback -----------------------------------
await page.click('#prototype-options')
const submittedTag = await page.evaluate(() =>
  document.body.innerText.includes('Submitted ✓'),
)
console.log(
  submittedTag ? '✓ Submitted tag shown in panel' : '✗ Submitted tag missing',
)
if (!submittedTag) failures++

const oldId = await page.evaluate(
  () => JSON.parse(localStorage.getItem('livtech-tour-feedback') ?? '{}').submissionId,
)
await page.evaluate(() => {
  const btn = [...document.querySelectorAll('button')].find((b) =>
    b.textContent?.includes('Reset Feedback'),
  )
  btn?.click()
})
await new Promise((r) => setTimeout(r, 300))
const afterReset = await page.evaluate((prevId) => {
  const fb = JSON.parse(localStorage.getItem('livtech-tour-feedback') ?? '{}')
  return {
    tagGone: !document.body.innerText.includes('Submitted ✓'),
    answersCleared: !fb.submittedAt && !fb.favorite,
    freshId: Boolean(fb.submissionId) && fb.submissionId !== prevId,
  }
}, oldId)
console.log('after reset:', JSON.stringify(afterReset))
if (!afterReset.tagGone || !afterReset.answersCleared || !afterReset.freshId)
  failures++

// --- Welcome modal skip path: nudge keeps pushing for the vote ---------------
await page.reload({ waitUntil: 'networkidle0' })
await openWelcomeActions('welcome-skip')
await clickWelcome('Maybe later')
await new Promise((r) => setTimeout(r, 800))
const afterSkip = await page.evaluate(() => ({
  modalGone: !document.querySelector('#welcome-modal'),
  noTour: !document.body.innerText.includes('Option A - Bold & Structured'),
  nudgeShown: document.body.innerText.includes('Vote on the 3 styles'),
}))
console.log('after welcome skip:', JSON.stringify(afterSkip))
if (!afterSkip.modalGone || !afterSkip.noTour || !afterSkip.nudgeShown)
  failures++
await page.screenshot({ path: '/tmp/e2e-nudge.png' })

// Clicking the nudge launches the full visual tour (feedback was reset above,
// so the question steps are back in play).
await page.evaluate(() => {
  const btn = [...document.querySelectorAll('button')].find((b) =>
    b.textContent?.includes('Vote on the 3 styles'),
  )
  btn?.click()
})
const nudgeStarts = await page
  .waitForFunction(
    () => document.body.innerText.includes('Option A - Bold & Structured'),
    { timeout: 8000 },
  )
  .then(() => true)
  .catch(() => false)
console.log(
  nudgeStarts ? '✓ nudge launches the tour' : '✗ nudge did not launch the tour',
)
if (!nudgeStarts) failures++

await browser.close()
console.log(failures === 0 ? 'ALL PASS' : `${failures} FAILURE(S)`)
process.exit(failures === 0 ? 0 : 1)
