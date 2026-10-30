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
- Scroll animations (ScrollReveal), sticky header, active-link highlighting, scroll-to-top
- Installable icons and web manifest; respects reduced-motion settings

## Editing club details

Most details live in two places:

| What | Where |
| --- | --- |
| WhatsApp number, opening days and hours | `CLUB` object at the top of `assets/js/main.js` |
| Prices, text, phone numbers, address | `index.html` |

> **Prices are placeholders.** Confirm the club's real membership rates and update the
> `pricing__number` values in `index.html` before publishing.

## Running locally

Open `index.html` in a browser, or serve the folder with any static server, e.g.:

```bash
npx serve .
```

## Images

Club photos and the logo in `assets/img/` (`gym-crew.jpg`, `club-vest.jpg`,
`club-heritage.jpg`, `fesupo-gold.jpg`, `supplements.jpg`, `lounge.jpg`,
`udbc-logo-card.jpg`) come from the club's WhatsApp group. `udbc-emblem.png`, `favicon.png`
and `icon-*.png` are generated from the club logo.
