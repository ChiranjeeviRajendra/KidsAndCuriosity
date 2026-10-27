# Kids & Curiosity

A Vue 3 / Vite website for hands-on science workshops for primary school children aged 7–12.

## Run locally

```sh
npm install
npm run dev
```

`npm run build` creates the production website in `dist/`.

## Device animations

- Seven original SVG diagrams live in `src/lib/devices.js`: refrigerator, engine, microwave, AC, TV, phone, and fan.
- The curiosity lab dismantles objects as the visitor scrolls. Its slider also supports pointer, touch, and keyboard input.
- The hero and workshop illustrations respond to scroll independently.
- Four original, locally hosted GIFs and their still-image alternatives live in `public/animations/`. Regenerate them after changing the artwork with `npm run generate:gifs`.
- The site respects `prefers-reduced-motion`, substitutes still images for GIFs, and includes a global motion pause control.

The diagrams are simplified explanations. Microwave, AC, and TV illustrations are digital explorations; they do not imply that children handle high-voltage components or refrigerant systems.

## Content and enquiries

Workshop copy, age groups, FAQs, and indicative pricing are in `src/App.vue`, based on the supplied business model. Phone and motor sessions are the pilot focus; other workshop availability must be confirmed. Pricing is labelled indicative.

The enquiry form validates required fields and opens the visitor’s email app with a prepared message. It does not submit to a server or store enquiries. The existing contact address, `hello@kidsandcuriosity.in`, is retained; confirm this mailbox before launch. The mailto builder is in `src/lib/inquiry.js`.

## Browser checks

With the dev server running at `http://127.0.0.1:5173`:

```sh
npm run check:ui
```

Checks cover reversible scrolling, all seven devices, the slider, GIF loading, pause and reduced motion, workshop selection, form validation, FAQs, mobile navigation, and responsive layouts. Screenshots are written to the ignored `.qa/` directory.

The check uses Microsoft Edge when installed at the standard Windows path; otherwise it uses Playwright Chromium. Set `BROWSER_EXECUTABLE` for another installed Chromium browser and `PREVIEW_URL` for a different preview address.
