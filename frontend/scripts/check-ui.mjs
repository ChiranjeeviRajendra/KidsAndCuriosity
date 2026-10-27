import { chromium } from '@playwright/test'
import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { inquiryEmail } from '../src/lib/inquiry.js'

const example = new URL(
  inquiryEmail({
    name: ' Teacher ',
    school: 'School & Science #1',
    email: 'teacher@example.com',
    workshop: 'Spin & move',
    message: 'Ages 7–10\n40 students',
  }),
)
assert.equal(example.searchParams.get('subject'), 'School workshop enquiry — School & Science #1')
assert.match(example.searchParams.get('body'), /Name: Teacher\n/)
assert.match(example.searchParams.get('body'), /Ages 7–10\n40 students/)

const baseURL = process.env.PREVIEW_URL || 'http://127.0.0.1:5173'
const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const executablePath = process.env.BROWSER_EXECUTABLE || (existsSync(edge) ? edge : undefined)
const browser = await chromium.launch({ executablePath, headless: true })
await mkdir('.qa', { recursive: true })
const errors = []
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: 'no-preference',
})
page.on('pageerror', (error) => errors.push(error.message))
page.on('response', (response) => {
  if (response.status() >= 400 && new URL(response.url()).origin === baseURL)
    errors.push(`${response.status()} ${response.url()}`)
})
try {
  await page.goto(baseURL, { waitUntil: 'networkidle' })
  await page.screenshot({ path: '.qa/desktop.png' })
  const lab = page.locator('#inside-lab')
  const bounds = await lab.boundingBox()
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), bounds.y)
  await page.waitForTimeout(100)
  assert.equal(await page.locator('#open-control').inputValue(), '0', 'Object starts assembled')
  const assembled = await page.locator('.lab-drawing svg').innerHTML()
  await page.evaluate(
    (y) => window.scrollTo({ top: y, behavior: 'instant' }),
    bounds.y + bounds.height - page.viewportSize().height,
  )
  await page.waitForTimeout(100)
  assert.equal(
    await page.locator('#open-control').inputValue(),
    '100',
    'Scrolling fully dismantles the device',
  )
  assert.notEqual(await page.locator('.lab-drawing svg').innerHTML(), assembled)
  await page.screenshot({ path: '.qa/lab.png' })
  const illustrations = new Set()
  for (const name of ['Fridge', 'Engine', 'Microwave', 'AC', 'TV', 'Phone', 'Fan']) {
    const button = page.locator('.device-tabs button').filter({ hasText: name })
    await button.click()
    assert.equal(await button.getAttribute('aria-pressed'), 'true')
    assert.ok((await page.locator('.lab-drawing svg g').count()) > 3, `${name} has rendered parts`)
    illustrations.add(await page.locator('.lab-drawing svg').innerHTML())
    await page.locator('.lab-drawing').screenshot({ path: `.qa/device-${name.toLowerCase()}.png` })
  }
  assert.equal(illustrations.size, 7, 'Every device has its own illustration')
  await page.locator('#open-control').fill('35')
  assert.equal(await page.locator('.live-label').innerText(), '35% OPEN')
  await page.locator('#open-control').focus()
  await page.keyboard.press('ArrowRight')
  assert.equal(
    await page.locator('.live-label').innerText(),
    '36% OPEN',
    'Slider supports keyboard exploration',
  )
  await page.getByRole('button', { name: 'Follow scroll' }).click()
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), bounds.y)
  await page.waitForTimeout(100)
  assert.equal(
    await page.locator('#open-control').inputValue(),
    '0',
    'Reverse scrolling reassembles the device',
  )

  await page.locator('.motion-section').scrollIntoViewIfNeeded()
  await page.waitForFunction(() =>
    [...document.querySelectorAll('.gif-image img')].every(
      (img) => img.complete && img.naturalWidth > 0,
    ),
  )
  assert.equal(await page.locator('.gif-image img[src$=".gif"]').count(), 4)
  await page.getByRole('button', { name: 'Pause animations' }).click()
  assert.equal(await page.locator('.gif-image img[src$="poster.svg"]').count(), 4)
  await page.getByRole('button', { name: 'Play animations' }).click()
  assert.equal(await page.locator('.gif-image img[src$=".gif"]').count(), 4)
  await page.locator('#workshops').scrollIntoViewIfNeeded()
  await page.waitForTimeout(750)
  await page.screenshot({ path: '.qa/workshops.png' })
  await page.locator('.workshop-card').first().getByRole('link').click()
  assert.equal(await page.locator('select[name="workshop"]').inputValue(), 'Inside your phone')
  assert.equal(
    await page.locator('form').evaluate((form) => form.checkValidity()),
    false,
    'Empty enquiries cannot be submitted',
  )
  await page.getByLabel('Your name').fill('Test teacher')
  await page.getByLabel('School name').fill('Curiosity School')
  await page.getByLabel('Email address').fill('teacher@example.com')
  assert.equal(await page.locator('form').evaluate((form) => form.checkValidity()), true)
  const faq = page.getByRole('button', { name: 'Does it connect to our curriculum?' })
  await faq.click()
  assert.equal(await faq.getAttribute('aria-expanded'), 'true')
  await faq.click()
  assert.equal(await faq.getAttribute('aria-expanded'), 'false')

  for (const size of [
    { width: 390, height: 844 },
    { width: 320, height: 740 },
    { width: 768, height: 1024 },
  ]) {
    await page.setViewportSize(size)
    await page.goto(baseURL, { waitUntil: 'networkidle' })
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      true,
      `No horizontal overflow at ${size.width}px`,
    )
    if (size.width < 761) {
      await page.getByRole('button', { name: 'Menu' }).click()
      await page.locator('#main-nav').getByRole('link', { name: 'The curiosity lab' }).click()
      assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false')
      await page.evaluate(() =>
        window.scrollTo({
          top: document.querySelector('#inside-lab').offsetTop + 250,
          behavior: 'instant',
        }),
      )
      await page.waitForTimeout(150)
      await page.screenshot({ path: `.qa/mobile-lab-${size.width}.png` })
      const sticky = await page.locator('.lab-sticky').boundingBox()
      assert.ok(
        sticky.height <= size.height,
        `Sticky lab fits ${size.width}x${size.height}: ${sticky.height}px`,
      )
      // Scroll the device selector horizontally via keyboard focus, then select TV.
      await page.locator('.device-tabs button').filter({ hasText: 'TV' }).click()
      assert.match(await page.locator('.lab-question').innerText(), /million colours/)
    }
  }
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.reload({ waitUntil: 'networkidle' })
  assert.equal(await page.locator('#open-control').isDisabled(), true)
  assert.equal(await page.locator('.gif-image img[src$="poster.svg"]').count(), 4)
  assert.equal(await page.locator('.motion-toggle').isDisabled(), true)
  await page.locator('#inside-lab').scrollIntoViewIfNeeded()
  assert.equal(await page.locator('.live-label').innerText(), '100% OPEN')
  assert.deepEqual(errors, [])
  console.log(
    'PASS: seven devices, reversible scroll dismantling, manual slider, four local GIFs, motion pause, reduced motion, workshop enquiry, FAQ, and responsive layouts.',
  )
} finally {
  await browser.close()
}
