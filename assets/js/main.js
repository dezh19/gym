/*=============== CLUB DETAILS ===============*/
/* Edit these to change the WhatsApp number and opening hours used across the site.
   Days: 0 = Sunday, 1 = Monday … 6 = Saturday. Times are 24-hour, in Guyana time.
   Leave a day out to mark it as closed. */
const CLUB = {
  whatsapp: '5926935900', // Country code + number, digits only
  timeZone: 'America/Guyana',
  hours: {
    1: { open: '06:00', close: '21:00' },
    2: { open: '06:00', close: '21:00' },
    3: { open: '06:00', close: '21:00' },
    4: { open: '06:00', close: '21:00' },
    5: { open: '06:00', close: '21:00' },
  },
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

/*=============== HELPERS ===============*/
const toMinutes = time => {
  const [h, m = 0] = time.split(':').map(Number)
  return h * 60 + m
}

// 21:00 -> "9PM", 06:30 -> "6:30AM"
const formatTime = time => {
  const total = toMinutes(time)
  const h = Math.floor(total / 60) % 24
  const m = total % 60
  const suffix = h < 12 ? 'AM' : 'PM'
  const h12 = h % 12 || 12
  return m ? `${h12}:${String(m).padStart(2, '0')}${suffix}` : `${h12}${suffix}`
}

const setMessage = (el, text, type) => {
  if (!el) return
  el.textContent = text
  el.classList.remove('is-error', 'is-success')
  if (type) el.classList.add(`is-${type}`)
}

const openWhatsApp = text => {
  const url = `https://wa.me/${CLUB.whatsapp}?text=${encodeURIComponent(text)}`
  const win = window.open(url, '_blank')
  if (win) win.opener = null
  else window.location.href = url // Pop-up blocked: open in this tab instead
}

/*=============== SHOW / HIDE MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')

const openMenu = () => {
  navMenu.classList.add('show-menu')
  navToggle.setAttribute('aria-expanded', 'true')
}

const closeMenu = () => {
  navMenu.classList.remove('show-menu')
  navToggle.setAttribute('aria-expanded', 'false')
}

navToggle.addEventListener('click', openMenu)
navClose.addEventListener('click', closeMenu)

/* Close the menu when a link is chosen */
navMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu))

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navMenu.classList.contains('show-menu')) {
    closeMenu()
    navToggle.focus()
  }
})

/*=============== OPEN / CLOSED STATUS ===============*/
/* Current day and minutes since midnight in Guyana */
const getClubNow = () => {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: CLUB.timeZone,
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      hourCycle: 'h23',
    }).formatToParts(new Date())
    const get = type => parts.find(p => p.type === type).value
    const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'))
    return { day, minutes: (Number(get('hour')) % 24) * 60 + Number(get('minute')) }
  } catch {
    // Guyana is UTC-4 all year round (no daylight saving)
    const d = new Date(Date.now() - 4 * 60 * 60 * 1000)
    return { day: d.getUTCDay(), minutes: d.getUTCHours() * 60 + d.getUTCMinutes() }
  }
}

const getStatus = ({ day, minutes }) => {
  const today = CLUB.hours[day]

  if (today) {
    const open = toMinutes(today.open),
          close = toMinutes(today.close)

    if (minutes >= open && minutes < close) {
      return close - minutes <= 60
        ? { state: 'soon', text: 'Closing soon', detail: `Closes at ${formatTime(today.close)}` }
        : { state: 'open', text: 'Open now', detail: `Until ${formatTime(today.close)} today` }
    }

    if (minutes < open) {
      return { state: 'closed', text: 'Closed now', detail: `Opens today at ${formatTime(today.open)}` }
    }
  }

  for (let i = 1; i <= 7; i++) {
    const next = (day + i) % 7
    if (CLUB.hours[next]) {
      const when = i === 1 ? 'tomorrow' : DAY_NAMES[next]
      return { state: 'closed', text: 'Closed now', detail: `Opens ${when} at ${formatTime(CLUB.hours[next].open)}` }
    }
  }

  return { state: 'closed', text: 'Closed', detail: 'Call the club for hours' }
}

/* Fill the hours table from CLUB so it always matches the status */
const hoursList = document.getElementById('hours-list')

const renderHours = () => {
  if (!hoursList) return
  hoursList.querySelectorAll('li[data-day]').forEach(row => {
    const hours = CLUB.hours[row.dataset.day]
    row.lastElementChild.textContent = hours
      ? `${formatTime(hours.open)} – ${formatTime(hours.close)}`
      : 'Closed'
    row.classList.toggle('hours__closed', !hours)
  })
}

const updateStatus = () => {
  const now = getClubNow()
  const status = getStatus(now)

  document.querySelectorAll('[data-status]').forEach(el => {
    el.classList.remove('is-open', 'is-soon', 'is-closed')
    el.classList.add(`is-${status.state}`)
  })
  document.querySelectorAll('[data-status-text]').forEach(el => el.textContent = status.text)
  document.querySelectorAll('[data-status-detail]').forEach(el => el.textContent = status.detail)

  hoursList?.querySelectorAll('li[data-day]').forEach(row => {
    const isToday = Number(row.dataset.day) === now.day
    row.classList.toggle('hours__today', isToday)
    if (isToday) row.setAttribute('aria-current', 'date')
    else row.removeAttribute('aria-current')
  })
}

renderHours()
updateStatus()
setInterval(updateStatus, 60 * 1000)

/*=============== CHANGE BACKGROUND HEADER ===============*/
const header = document.getElementById('header')

const bgHeader = () => header.classList.toggle('bg-header', window.scrollY >= 50)

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]')

const scrollActive = () => {
  const scrollDown = window.scrollY

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 80,
          sectionHeight = section.offsetHeight,
          link = document.querySelector(`.nav__menu .nav__link[href="#${section.id}"]`)

    if (!link) return
    link.classList.toggle('active-link', scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight)
  })
}

/*=============== SHOW SCROLL UP ===============*/
const scrollUp = document.getElementById('scroll-up')

const showScrollUp = () => scrollUp.classList.toggle('show-scroll', window.scrollY >= 350)

let ticking = false
const onScroll = () => {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    bgHeader()
    scrollActive()
    showScrollUp()
    ticking = false
  })
}

window.addEventListener('scroll', onScroll, { passive: true })
onScroll()

/*=============== PRE-FILL THE JOIN FORM ===============*/
const joinPlan = document.getElementById('join-plan'),
      joinGoal = document.getElementById('join-goal')

const preselect = (select, value) => {
  if (!select || ![...select.options].some(option => option.value === value)) return
  select.value = value
  select.classList.remove('is-flash')
  void select.offsetWidth // Restart the highlight animation
  select.classList.add('is-flash')
}

document.querySelectorAll('[data-plan]').forEach(button => {
  button.addEventListener('click', () => preselect(joinPlan, button.dataset.plan))
})

document.querySelectorAll('[data-goal]').forEach(button => {
  button.addEventListener('click', () => preselect(joinGoal, button.dataset.goal))
})

/*=============== JOIN FORM -> WHATSAPP ===============*/
const joinForm = document.getElementById('join-form'),
      joinName = document.getElementById('join-name'),
      joinPhone = document.getElementById('join-phone'),
      joinMessage = document.getElementById('join-message'),
      joinStatus = document.getElementById('join-message-status')

joinForm.addEventListener('submit', e => {
  e.preventDefault()

  const name = joinName.value.trim(),
        phone = joinPhone.value.trim(),
        message = joinMessage.value.trim()

  const missing = []
  if (!name) missing.push(joinName)
  if (phone.replace(/\D/g, '').length < 7) missing.push(joinPhone)

  ;[joinName, joinPhone].forEach(input => input.setAttribute('aria-invalid', missing.includes(input)))

  if (missing.length) {
    const text = !name
      ? 'Add your name so the club knows who is messaging.'
      : 'Add a phone or WhatsApp number (at least 7 digits) so the club can reply.'
    setMessage(joinStatus, text, 'error')
    missing[0].focus()
    return
  }

  const lines = [
    "Hi UDBC! I'd like to join the club.",
    '',
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Plan: ${joinPlan.value}`,
    `Goal: ${joinGoal.value}`,
  ]
  if (message) lines.push(`Message: ${message}`)

  openWhatsApp(lines.join('\n'))
  setMessage(joinStatus, 'WhatsApp is opening with your message. Just press send!', 'success')
})

joinForm.addEventListener('input', e => {
  if (e.target.getAttribute('aria-invalid') === 'true') e.target.setAttribute('aria-invalid', 'false')
  if (joinStatus.classList.contains('is-error')) setMessage(joinStatus, '')
})

/*=============== CLUB UPDATES -> WHATSAPP ===============*/
const updatesForm = document.getElementById('updates-form'),
      updatesName = document.getElementById('updates-name'),
      updatesMessage = document.getElementById('updates-message')

updatesForm.addEventListener('submit', e => {
  e.preventDefault()

  const name = updatesName.value.trim()

  if (!name) {
    updatesName.setAttribute('aria-invalid', 'true')
    setMessage(updatesMessage, 'Add your name first.', 'error')
    updatesName.focus()
    return
  }

  updatesName.setAttribute('aria-invalid', 'false')
  openWhatsApp(`Hi UDBC! I'm ${name}. Please add me to the club updates on WhatsApp (news, events and schedule changes).`)
  setMessage(updatesMessage, 'WhatsApp is opening. Press send to sign up!', 'success')
  updatesName.value = ''

  setTimeout(() => setMessage(updatesMessage, ''), 6000)
})

updatesName.addEventListener('input', () => {
  updatesName.setAttribute('aria-invalid', 'false')
  if (updatesMessage.classList.contains('is-error')) setMessage(updatesMessage, '')
})

/*=============== BMI CALCULATOR ===============*/
const calculateForm = document.getElementById('calculate-form'),
      calculateCm = document.getElementById('calculate-cm'),
      calculateFt = document.getElementById('calculate-ft'),
      calculateIn = document.getElementById('calculate-in'),
      calculateWeight = document.getElementById('calculate-weight'),
      weightUnit = document.getElementById('weight-unit'),
      calculateMessage = document.getElementById('calculate-message'),
      bmiPointer = document.getElementById('bmi-pointer'),
      bmiValue = document.getElementById('bmi-value'),
      bmiMeter = document.querySelector('.bmi-meter')

const BMI_CATEGORIES = [
  { max: 18.5, key: 'under', label: 'underweight', tip: 'Time to eat big and lift heavy.' },
  { max: 25, key: 'healthy', label: 'in the healthy range', tip: 'Keep showing up.' },
  { max: 30, key: 'over', label: 'in the overweight range', tip: 'Carrying a lot of muscle? That reads high, which is normal for lifters.' },
  { max: Infinity, key: 'obese', label: 'in the obese range', tip: 'Start where you are. The gym family will help you.' },
]

// Where the pointer sits on the four equal-width segments of the scale
const SCALE_STOPS = [[10, 0], [18.5, 25], [25, 50], [30, 75], [40, 100]]

const bmiToPercent = bmi => {
  const value = Math.min(Math.max(bmi, SCALE_STOPS[0][0]), SCALE_STOPS[SCALE_STOPS.length - 1][0])
  for (let i = 1; i < SCALE_STOPS.length; i++) {
    const [b0, p0] = SCALE_STOPS[i - 1], [b1, p1] = SCALE_STOPS[i]
    if (value <= b1) return p0 + (value - b0) / (b1 - b0) * (p1 - p0)
  }
  return 100
}

const getUnits = () => calculateForm.querySelector('input[name="units"]:checked').value

calculateForm.querySelectorAll('input[name="units"]').forEach(radio => {
  radio.addEventListener('change', () => {
    const units = getUnits()
    calculateForm.querySelectorAll('[data-units]').forEach(el => el.hidden = el.dataset.units !== units)
    weightUnit.textContent = units === 'imperial' ? 'lb' : 'kg'
    setMessage(calculateMessage, '')
  })
})

const showBmiError = text => {
  setMessage(calculateMessage, text, 'error')
  clearTimeout(showBmiError.timer)
  showBmiError.timer = setTimeout(() => {
    if (calculateMessage.classList.contains('is-error')) setMessage(calculateMessage, '')
  }, 4000)
}

calculateForm.addEventListener('submit', e => {
  e.preventDefault()

  const weight = parseFloat(calculateWeight.value)
  let heightM, weightKg

  if (getUnits() === 'imperial') {
    const ft = parseFloat(calculateFt.value) || 0,
          inches = parseFloat(calculateIn.value) || 0
    heightM = (ft * 12 + inches) * .0254
    weightKg = weight * .45359237
  } else {
    heightM = parseFloat(calculateCm.value) / 100
    weightKg = weight
  }

  if (!(heightM > 0) || !(weightKg > 0)) {
    showBmiError('Fill in your height and weight 👆')
    return
  }

  if (heightM < .9 || heightM > 2.6 || weightKg < 20 || weightKg > 350) {
    showBmiError('Those numbers look off. Double-check your height and weight.')
    return
  }

  const bmi = Math.round(weightKg / heightM ** 2 * 10) / 10
  const category = BMI_CATEGORIES.find(c => bmi < c.max)

  calculateMessage.classList.remove('is-error', 'is-success')
  calculateMessage.innerHTML = `Your BMI is <strong>${bmi.toFixed(1)}</strong>, ${category.label}. ${category.tip}`

  bmiValue.textContent = bmi.toFixed(1)
  bmiPointer.style.left = `${bmiToPercent(bmi)}%`
  bmiMeter.classList.remove(...BMI_CATEGORIES.map(c => `bmi-meter--${c.key}`))
  bmiMeter.classList.add('has-value', `bmi-meter--${category.key}`)
})

/*=============== GALLERY LIGHTBOX ===============*/
const lightbox = document.getElementById('lightbox'),
      lightboxImg = document.getElementById('lightbox-img'),
      lightboxCaption = document.getElementById('lightbox-caption'),
      lightboxClose = document.getElementById('lightbox-close'),
      lightboxPrev = document.getElementById('lightbox-prev'),
      lightboxNext = document.getElementById('lightbox-next')

const photos = [...document.querySelectorAll('.gallery__open')].map(button => ({
  button,
  img: button.querySelector('img'),
  caption: button.closest('figure')?.querySelector('figcaption')?.textContent.trim() ?? '',
}))

let currentPhoto = 0,
    lastFocus = null

const showPhoto = index => {
  currentPhoto = (index + photos.length) % photos.length
  const { img, caption } = photos[currentPhoto]
  lightboxImg.src = img.currentSrc || img.src
  lightboxImg.alt = img.alt
  lightboxCaption.textContent = caption
}

const openLightbox = index => {
  lastFocus = document.activeElement
  showPhoto(index)
  lightbox.hidden = false
  document.body.classList.add('no-scroll')
  lightboxClose.focus()
}

const closeLightbox = () => {
  lightbox.hidden = true
  document.body.classList.remove('no-scroll')
  lastFocus?.focus()
}

photos.forEach(({ button }, i) => {
  button.addEventListener('click', () => openLightbox(Number(button.dataset.index ?? i)))
})

lightboxClose.addEventListener('click', closeLightbox)
lightboxPrev.addEventListener('click', () => showPhoto(currentPhoto - 1))
lightboxNext.addEventListener('click', () => showPhoto(currentPhoto + 1))

/* Click outside the photo to close */
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox()
})

document.addEventListener('keydown', e => {
  if (lightbox.hidden) return

  if (e.key === 'Escape') closeLightbox()
  else if (e.key === 'ArrowLeft') showPhoto(currentPhoto - 1)
  else if (e.key === 'ArrowRight') showPhoto(currentPhoto + 1)
  else if (e.key === 'Tab') {
    // Keep focus inside the lightbox
    const focusable = [lightboxClose, lightboxPrev, lightboxNext]
    const index = focusable.indexOf(document.activeElement)
    const next = index === -1 ? 0 : (e.shiftKey ? index - 1 : index + 1)
    e.preventDefault()
    focusable[(next + focusable.length) % focusable.length].focus()
  }
})

/*=============== FOOTER YEAR ===============*/
const year = document.getElementById('year')
if (year) year.textContent = new Date().getFullYear()

/*=============== SCROLL REVEAL ANIMATION ===============*/
/* Elements fade and slide in the first time they scroll into view */
const reveal = (selector, { origin = 'bottom', delay = 0, interval = 0, distance = 48 } = {}) => {
  const offsets = {
    top: `0 ${-distance}px`,
    bottom: `0 ${distance}px`,
    left: `${-distance}px 0`,
    right: `${distance}px 0`,
  }

  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add('reveal-pending')
    el.dataset.revealFrom = offsets[origin]
    el.dataset.revealDelay = delay + i * interval
    revealObserver.observe(el)
  })
}

const revealObserver = 'IntersectionObserver' in window && !reduceMotion
  ? new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        const el = entry.target
        observer.unobserve(el)
        el.classList.remove('reveal-pending')
        el.animate?.(
          [{ opacity: 0, translate: el.dataset.revealFrom }, { opacity: 1, translate: '0 0' }],
          { duration: 900, delay: Number(el.dataset.revealDelay), easing: 'cubic-bezier(.2, .7, .2, 1)', fill: 'backwards' },
        )
      })
    }, { rootMargin: '0px 0px -8% 0px' })
  : null

if (revealObserver) {
  reveal('.home__data', { origin: 'top' })
  reveal('.home__images', { delay: 300 })
  reveal('.program .section__data, .pricing .section__data, .gallery .section__data, .join .section__data', { origin: 'top' })
  reveal('.program__card', { interval: 100 })
  reveal('.pricing__card', { interval: 100 })
  reveal('.gallery__item', { interval: 100 })
  reveal('.choose__images, .calculate__content, .join__form', { origin: 'left' })
  reveal('.choose__content, .calculate__scale', { origin: 'right' })
  reveal('.join__card', { origin: 'right', interval: 100 })
  reveal('.footer__container, .footer__group')
}
