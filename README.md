# 🏋️ Upper Demerara Barbell Club — Website

Responsive website for **Upper Demerara Barbell Club (UDBC)**, a barbell and strength gym at
**606 'E' Retrieve, Mackenzie, Linden, Guyana**. Open **Monday – Friday, 6AM – 9PM**.
Phone: 592-693-5900 · 627-0139 · 444-4314.

Built with plain HTML, CSS and JavaScript (no build step), starting from the Bedimcode
responsive gym template.

## Features

- Mobile-first, responsive layout with a slide-out mobile menu
- **Live open/closed status** calculated in Guyana time (America/Guyana), plus today's row highlighted in the hours table
- Training programs, "Why choose UDBC" stats and equipment list
- Membership plans that pre-fill the join form
- Club photo gallery with a keyboard-friendly lightbox
- **BMI calculator** with metric (cm/kg) and imperial (ft/in/lb) units and a visual scale
- **Join form → WhatsApp**: opens a pre-written message to the club, no server needed
- **Club updates sign-up → WhatsApp** in the footer
- Tap-to-call phone numbers, embedded map and directions link
- Scroll-in animations (built in, no library), sticky header, active-link highlighting, scroll-to-top
- Installable icons and web manifest; respects reduced-motion settings
- Business details for Google (address, phones, opening hours) as structured data

## Editing club details

Most details live in a few places:

| What | Where |
| --- | --- |
| WhatsApp number, opening days and hours (also fills the hours table) | `CLUB` object at the top of `assets/js/main.js` |
| Prices, text, phone numbers, address | `index.html` |
| Colours and fonts | Variables at the top of `assets/css/styles.css` |

> **Prices are placeholders.** Confirm the club's real membership rates and update the
> `pricing__number` values in `index.html` before publishing.

## Running locally

Open `index.html` in a browser, or serve the folder with any static server, e.g.:

```bash
npx serve .
```

## Images

All images live in `assets/img/`.

> **The photos are placeholders.** `gym-crew.jpg`, `club-vest.jpg`, `club-heritage.jpg`,
> `fesupo-gold.jpg`, `supplements.jpg` and `lounge.jpg` are branded stand-ins. Replace each
> one with the real club photo (from the WhatsApp group) **using the same file name** and
> the site picks it up automatically. The `alt` text in `index.html` already describes the
> real photos.

| File | Used for | Best shape |
| --- | --- | --- |
| `gym-crew.jpg` | Home hero | Portrait, 4:5 |
| `club-vest.jpg` | Why Choose UDBC | Portrait, 4:5 |
| `club-heritage.jpg` | Gallery (wide tile) | Landscape |
| `fesupo-gold.jpg` | Gallery (tall tile) | Portrait |
| `supplements.jpg`, `lounge.jpg` | Gallery (square tiles) | Square |

`udbc-emblem.png` (the round badge), `favicon.png` and `icon-*.png` are a UDBC emblem made
for the site. If the club has an official logo, swap it in at the same file names.
