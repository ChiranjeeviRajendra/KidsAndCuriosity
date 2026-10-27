import { onBeforeUnmount, onMounted, ref } from 'vue'

// One frame per scroll event, with all layout reads batched before writes.
export function useMotion() {
  const reducedMotion = ref(false)
  const motionPaused = ref(false)
  const labProgress = ref(0)
  const heroProgress = ref(0.75)
  const cardProgress = ref({})
  let frame = 0
  let observer
  let preference
  let elements = []
  let lab
  let hero
  const clamp = (n) => Math.max(0, Math.min(1, n))

  function update() {
    frame = 0
    const height = window.innerHeight
    if (lab) {
      const bounds = lab.getBoundingClientRect()
      const travel = bounds.height - height
      const scrollProgress =
        travel > height * 0.3
          ? clamp(-bounds.top / travel)
          : clamp((height * 0.7 - bounds.top) / (bounds.height * 0.7))
      labProgress.value = reducedMotion.value || motionPaused.value ? 1 : scrollProgress
    }
    if (hero) {
      const bounds = hero.getBoundingClientRect()
      heroProgress.value =
        reducedMotion.value || motionPaused.value
          ? 1
          : 0.62 + 0.38 * clamp(-bounds.top / bounds.height)
    }
    const values = elements.map((el) => ({
      el,
      p: clamp((height * 0.94 - el.getBoundingClientRect().top) / (height * 0.6)),
    }))
    cardProgress.value = Object.fromEntries(
      values.map(({ el, p }) => [
        el.dataset.open,
        reducedMotion.value || motionPaused.value ? 1 : p,
      ]),
    )
  }

  function requestUpdate() {
    if (!frame) frame = requestAnimationFrame(update)
  }
  function syncPreference(event) {
    reducedMotion.value = event.matches
    requestUpdate()
  }
  function toggleMotion() {
    motionPaused.value = !motionPaused.value
    requestUpdate()
  }

  onMounted(() => {
    preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotion.value = preference.matches
    preference.addEventListener('change', syncPreference)
    elements = [...document.querySelectorAll('[data-open]')]
    lab = document.querySelector('#inside-lab')
    hero = document.querySelector('#home')
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) =>
          entries.forEach(({ isIntersecting, target }) => {
            if (isIntersecting) {
              target.classList.add('revealed')
              observer.unobserve(target)
            }
          }),
        { threshold: 0.08 },
      )
      document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el))
    } else document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('revealed'))
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    update()
  })

  onBeforeUnmount(() => {
    cancelAnimationFrame(frame)
    observer?.disconnect()
    preference?.removeEventListener('change', syncPreference)
    window.removeEventListener('scroll', requestUpdate)
    window.removeEventListener('resize', requestUpdate)
  })
  return { reducedMotion, motionPaused, labProgress, heroProgress, cardProgress, toggleMotion }
}
