<script setup>
import { computed, ref } from 'vue'
import DeviceDiagram from './components/DeviceDiagram.vue'
import { devices } from './lib/devices'
import { inquiryEmail } from './lib/inquiry'
import { useMotion } from './composables/useMotion'
import './assets/main.css'

const menuOpen = ref(false)
const selectedDevice = ref('fridge')
const manualProgress = ref(null)
const activeFaq = ref(0)
const emailPrepared = ref(false)
const { reducedMotion, motionPaused, labProgress, heroProgress, cardProgress, toggleMotion } =
  useMotion()
const device = computed(() => devices.find((item) => item.id === selectedDevice.value))
const progress = computed(() =>
  reducedMotion.value || motionPaused.value ? 1 : (manualProgress.value ?? labProgress.value),
)
const stage = computed(() => (progress.value < 0.25 ? 0 : progress.value < 0.75 ? 1 : 2))
const stillImages = computed(() => reducedMotion.value || motionPaused.value)
const inquiry = ref({ name: '', school: '', email: '', workshop: 'Help me choose', message: '' })
const workshops = [
  {
    id: 'phone',
    name: 'Inside your phone',
    ages: '8–12',
    topics: 'Circuits · Sensors · Sound',
    description:
      'A pocket-sized world of screens, cameras, and clever connections. Meet the tiny team behind every tap.',
    label: 'PILOT FOCUS',
    color: '#dfe8cd',
  },
  {
    id: 'fan',
    name: 'Spin & move',
    ages: '7–10',
    topics: 'Electricity · Magnets · Motion',
    description:
      'Follow electricity into a motor, meet its magnets, and discover what turns a spin into a breeze.',
    label: 'PILOT FOCUS',
    color: '#e9dfc9',
  },
  {
    id: 'fridge',
    name: 'Cool secrets',
    ages: '9–12',
    topics: 'Heat · Energy · Temperature',
    description:
      'Open a prepared cutaway and follow the surprising journey of heat from the inside to the outside.',
    label: 'ASK ABOUT AVAILABILITY',
    color: '#d5e4df',
  },
  {
    id: 'engine',
    name: 'Engine adventure',
    ages: '9–12',
    topics: 'Energy · Forces · Motion',
    description:
      'Explore cleaned engine parts and connect a piston’s push to the turning motion that moves a vehicle.',
    label: 'ASK ABOUT AVAILABILITY',
    color: '#eed8c7',
  },
]
const loops = [
  {
    id: 'fridge',
    title: 'The heat mover',
    caption: 'A fridge carries heat out, rather than making cold.',
    tag: 'HEAT TRANSFER',
  },
  {
    id: 'engine',
    title: 'From push to spin',
    caption: 'A piston and crankshaft turn a push into rotation.',
    tag: 'ENERGY & MOTION',
  },
  {
    id: 'phone',
    title: 'A team behind the screen',
    caption: 'Circuits connect the parts that sense, process, and respond.',
    tag: 'CIRCUITS & SENSORS',
  },
  {
    id: 'fan',
    title: 'A little magnetic magic',
    caption: 'Electricity and magnetism make a motor turn.',
    tag: 'ELECTRICITY & MAGNETS',
  },
]
const steps = [
  { title: 'Ask', icon: '?', copy: 'What do you think is inside? Every theory gets a hearing.' },
  {
    title: 'Open',
    icon: '↗',
    copy: 'Our facilitator carefully reveals the parts of a prepared object.',
  },
  {
    title: 'Discover',
    icon: '✳',
    copy: 'Connect a real part to a big idea: heat, light, forces, or electricity.',
  },
  {
    title: 'Reflect',
    icon: '↺',
    copy: 'Sketch what you saw, explain it, or explore a safe component.',
  },
  {
    title: 'Keep wondering',
    icon: '⌂',
    copy: 'Take home an activity sheet and a new question to ask.',
  },
]
const faqs = [
  {
    question: 'What makes the workshops safe?',
    answer:
      'Objects are decommissioned and prepared before the session. Phone batteries are removed, refrigerant systems are professionally prepared or shown as cutaways, and engine parts are cleaned and drained. Adults handle opening and cutting. Children explore only safe parts with appropriate glasses, gloves, supervision, and their teacher present.',
  },
  {
    question: 'How many children can take part?',
    answer:
      'Plan for a class of up to 40 students, with one facilitator per 15–20 children and the class teacher present. We discuss group sizes with your school so everyone can get a good look.',
  },
  {
    question: 'Does it connect to our curriculum?',
    answer:
      'We plan sessions around relevant science topics such as electricity, heat, forces, light, and simple machines. Tell us whether your school follows CBSE, ICSE, IB, or another syllabus, and we can prepare a one-page note connecting the session to your classroom topics.',
  },
  {
    question: 'What does our school need to provide?',
    answer:
      'A classroom or hall, tables for the objects, and the class teacher. We bring the prepared objects, tools, safety gear, and activity sheets. We agree on the space and setup with you before the visit.',
  },
  {
    question: 'Can children dismantle microwaves, ACs, or TVs?',
    answer:
      'The website uses simplified illustrations to explain these devices. High-voltage components and sealed cooling systems are adult-only. School sessions use professionally prepared cutaways, disconnected models, and safe components appropriate for the age group; a digital exploration is not a DIY dismantling guide.',
  },
  {
    question: 'Can we arrange a pilot or sponsored session?',
    answer:
      'Yes, you can ask about a pilot for your school or discuss sponsoring a session through a CSR or NGO partnership. Availability, location, scope, and pricing are agreed before any session is confirmed.',
  },
]
function chooseDevice(id) {
  selectedDevice.value = id
}
function chooseWorkshop(name) {
  inquiry.value.workshop = name
  emailPrepared.value = false
}
function prepareEmail() {
  window.location.href = inquiryEmail(inquiry.value)
  emailPrepared.value = true
}
</script>

<template>
  <div class="site-shell" :class="{ 'motion-paused': stillImages }">
    <a class="skip-link" href="#main">Skip to content</a>
    <header class="site-header">
      <a class="brand" href="#home" aria-label="Kids and Curiosity home" @click="menuOpen = false"
        ><span class="brand-mark" aria-hidden="true">✳</span
        ><span>kids<span class="brand-amp">&</span>curiosity</span></a
      >
      <button
        class="menu-toggle"
        type="button"
        :aria-expanded="menuOpen"
        aria-controls="main-nav"
        @click="menuOpen = !menuOpen"
      >
        {{ menuOpen ? 'Close −' : 'Menu +' }}
      </button>
      <nav id="main-nav" :class="{ 'is-open': menuOpen }" aria-label="Main navigation">
        <a href="#inside-lab" @click="menuOpen = false">The curiosity lab</a
        ><a href="#workshops" @click="menuOpen = false">Workshops</a
        ><a href="#schools" @click="menuOpen = false">For schools</a
        ><a class="nav-cta" href="#contact" @click="menuOpen = false"
          >Bring curiosity to school <span>↗</span></a
        >
      </nav>
    </header>
    <main id="main">
      <section id="home" class="hero">
        <div class="hero-copy">
          <p class="eyebrow"><i></i> REAL OBJECTS. REAL SCIENCE. AGES 7–12.</p>
          <h1>Big questions.<br /><span>Opened up.</span></h1>
          <p class="hero-intro">
            A fridge. A phone. A whole world of <em>why.</em><br />We bring everyday objects into
            primary schools and open them up to discover the science inside.
          </p>
          <div class="hero-actions">
            <a class="button button-lime" href="#workshops">Find your workshop <span>↗</span></a
            ><a class="text-link" href="#inside-lab"
              ><span class="circle-arrow">↓</span> Take a look inside</a
            >
          </div>
          <div class="hero-proof">
            <span class="proof-symbol">✳</span>
            <p>For curious children.<br /><strong>And the teachers who encourage them.</strong></p>
          </div>
        </div>
        <div class="hero-art technical-grid">
          <div class="drawing-topline">
            <span><i></i> EVERYDAY WONDER / 001</span><span>THE REFRIGERATOR</span>
          </div>
          <div class="hero-orbit"></div>
          <DeviceDiagram type="fridge" :progress="heroProgress" />
          <div class="aha-note">
            <span>HERE’S THE COOL PART</span>
            <p>It doesn’t make cold.<br /><strong>It moves heat.</strong></p>
            <b aria-hidden="true">↗</b>
          </div>
          <div class="drawing-bottomline">
            <span>FAMILIAR ON THE OUTSIDE. FASCINATING WITHIN.</span><span>01 / 07</span>
          </div>
        </div>
        <div class="hero-bottom">
          <a href="#inside-lab">SCROLL TO OPEN YOUR CURIOSITY <span>↓</span></a
          ><span>PREPARED WITH CARE. EXPLORED TOGETHER.</span>
        </div>
      </section>
      <div class="belief-strip">
        <span>Less “learn the answer.”</span><b>✳</b><span>More “let’s find out.”</span><b>✳</b
        ><span>Science starts with a little curiosity.</span>
      </div>

      <section id="inside-lab" class="lab-scroll">
        <div class="lab-sticky">
          <div class="lab-heading">
            <div>
              <p class="eyebrow"><i></i> WELCOME TO THE CURIOSITY LAB</p>
              <h2>There’s a whole world <span>in there.</span></h2>
            </div>
            <p>
              Pick an object. Scroll to open it.<br />
              Discover the idea that makes it work.
            </p>
          </div>
          <div class="device-tabs" role="group" aria-label="Choose an object to explore">
            <button
              v-for="(item, index) in devices"
              :key="item.id"
              type="button"
              :aria-pressed="selectedDevice === item.id"
              :class="{ active: selectedDevice === item.id }"
              @click="chooseDevice(item.id)"
            >
              <span>0{{ index + 1 }}</span
              >{{ item.short }}<b aria-hidden="true">↗</b>
            </button>
          </div>
          <div class="lab-content">
            <div class="lab-copy" :key="device.id">
              <span class="micro-label">THE QUESTION</span>
              <p class="lab-question">{{ device.question }}</p>
              <h3>{{ device.answer }}</h3>
              <p class="lab-detail">{{ device.detail }}</p>
              <p class="sr-only">Inside this object: {{ device.parts.join(', ') }}.</p>
              <div class="lab-fact">
                <span>✳ THE AHA MOMENT</span>
                <p>{{ device.fact }}</p>
              </div>
              <span class="concept-tag">{{ device.concept }}</span>
            </div>
            <div class="lab-drawing technical-grid">
              <div class="drawing-topline">
                <span>INSIDE / {{ device.name.toUpperCase() }}</span
                ><span class="live-label">{{ Math.round(progress * 100) }}% OPEN</span>
              </div>
              <DeviceDiagram :type="device.id" :progress="progress" />
              <div class="drawing-bottomline">
                <span>SIMPLIFIED SCIENCE ILLUSTRATION</span><span>EXPLORE, ASK, DISCOVER ↗</span>
              </div>
            </div>
          </div>
          <div class="lab-controls">
            <div class="lab-stages">
              <span
                v-for="(name, index) in ['Meet the object', 'Open it up', 'See the science']"
                :key="name"
                :class="{ current: stage === index }"
                ><b>0{{ index + 1 }}</b
                >{{ name }}</span
              >
            </div>
            <div class="scrubber">
              <label for="open-control">{{
                manualProgress === null ? 'SCROLL OR DRAG TO EXPLORE' : 'DRAG TO EXPLORE'
              }}</label
              ><input
                id="open-control"
                type="range"
                min="0"
                max="100"
                :value="Math.round(progress * 100)"
                :disabled="stillImages"
                aria-label="How far the device is dismantled"
                :aria-valuetext="`${Math.round(progress * 100)} percent open`"
                @input="manualProgress = Number($event.target.value) / 100"
              /><button v-if="manualProgress !== null" type="button" @click="manualProgress = null">
                Follow scroll ↺</button
              ><span v-else aria-hidden="true">↓</span>
            </div>
          </div>
          <p class="lab-safety">{{ device.safety }}</p>
        </div>
      </section>

      <section id="how-it-works" class="approach section-pad">
        <div class="section-heading" data-reveal>
          <div>
            <p class="eyebrow dark-eyebrow"><i></i> A QUESTION BECOMES A DISCOVERY</p>
            <h2>Not just “watch this.”<br /><span>“What do you think?”</span></h2>
          </div>
          <p>
            Every workshop follows a simple journey. Children bring the questions. We bring
            something worth opening.
          </p>
        </div>
        <div class="steps-grid">
          <article v-for="(step, index) in steps" :key="step.title" class="step-card" data-reveal>
            <span class="micro-label">0{{ index + 1 }} / THE PROCESS</span
            ><span class="step-icon" aria-hidden="true">{{ step.icon }}</span>
            <h3>{{ step.title }}</h3>
            <p>{{ step.copy }}</p>
          </article>
        </div>
      </section>

      <section class="motion-section section-pad">
        <div class="section-heading" data-reveal>
          <div>
            <p class="eyebrow"><i></i> A LITTLE SCIENCE IN MOTION</p>
            <h2>Small parts.<br /><span>Big “ohhh, I get it.”</span></h2>
          </div>
          <div class="motion-intro">
            <p>Watch familiar objects come apart, one little discovery at a time.</p>
            <button
              class="motion-toggle"
              type="button"
              :aria-pressed="stillImages"
              :disabled="reducedMotion"
              @click="toggleMotion"
            >
              {{
                reducedMotion
                  ? 'Reduced motion on'
                  : motionPaused
                    ? '▷ Play animations'
                    : 'Ⅱ Pause animations'
              }}</button
            ><small v-if="reducedMotion">Your reduced-motion preference is on.</small>
          </div>
        </div>
        <div class="gif-grid">
          <article v-for="(loop, index) in loops" :key="loop.id" class="gif-card" data-reveal>
            <div class="gif-image">
              <img
                :src="`/animations/${loop.id}-${stillImages ? 'poster.svg' : 'exploded.gif'}`"
                :alt="`Animated exploded-view illustration of a ${loop.id === 'phone' ? 'smartphone' : loop.id}, separating to reveal its inner components`"
                width="480"
                height="352"
                loading="lazy"
                decoding="async"
              /><span class="gif-badge">{{ stillImages ? 'STILL VIEW' : 'LOOP / GIF' }}</span>
            </div>
            <div class="gif-copy">
              <span class="micro-label">0{{ index + 1 }} / {{ loop.tag }}</span>
              <h3>{{ loop.title }}</h3>
              <p>{{ loop.caption }}</p>
              <a href="#inside-lab" @click="chooseDevice(loop.id)">Explore inside <span>↗</span></a>
            </div>
          </article>
        </div>
      </section>

      <section id="workshops" class="workshops section-pad">
        <div class="section-heading" data-reveal>
          <div>
            <p class="eyebrow dark-eyebrow"><i></i> THE WORKSHOP MENU</p>
            <h2>Everyday objects.<br /><span>Extraordinary discoveries.</span></h2>
          </div>
          <p>
            Real objects, thoughtful questions, and science that sticks. Start with our phone and
            motor pilot sessions; ask us about other explorations.
          </p>
        </div>
        <div class="workshop-grid">
          <article
            v-for="(workshop, index) in workshops"
            :key="workshop.id"
            class="workshop-card"
            :data-open="workshop.id"
            data-reveal
          >
            <div class="workshop-art" :style="{ '--card-color': workshop.color }">
              <div class="workshop-art-header">
                <span>0{{ index + 1 }} / AGES {{ workshop.ages }}</span
                ><span>↓ SCROLL TO REVEAL</span>
              </div>
              <DeviceDiagram
                :type="workshop.id"
                :progress="cardProgress[workshop.id] ?? 0"
                :labels="false"
              /><span class="workshop-status">{{ workshop.label }}</span>
            </div>
            <div class="workshop-copy">
              <p class="micro-label">{{ workshop.topics }}</p>
              <h3>{{ workshop.name }}</h3>
              <p>{{ workshop.description }}</p>
              <a href="#contact" @click="chooseWorkshop(workshop.name)"
                >Ask about this workshop <span>↗</span></a
              >
            </div>
          </article>
        </div>
        <div class="light-sound-note">
          <span class="light-sound-icon" aria-hidden="true">✳</span>
          <div>
            <h3>Little scientists, meet light & sound.</h3>
            <p>
              Ask about torches, radios, and headphones for ages 7–9. Big discoveries can start
              small.
            </p>
          </div>
          <a href="#contact" @click="chooseWorkshop('Light & sound')"
            >Let’s explore <span>↗</span></a
          >
        </div>
      </section>

      <section id="schools" class="schools section-pad">
        <div class="school-copy" data-reveal>
          <p class="eyebrow"><i></i> FOR THE PEOPLE WHO MAKE LEARNING HAPPEN</p>
          <h2>You bring the class.<br /><span>We bring the “wow.”</span></h2>
          <p>
            A ready-to-run workshop, built around your school day. Meaningful learning for children.
            A clear plan for teachers.
          </p>
          <a class="button button-lime" href="#contact">Let’s plan a school visit <span>↗</span></a
          ><span class="school-scribble" aria-hidden="true">more why.<br />more wonder. ↗</span>
        </div>
        <div class="school-benefits">
          <article data-reveal>
            <span>01</span>
            <div>
              <h3>Connected to the classroom</h3>
              <p>
                Plan around electricity, heat, forces, and light, with a one-page curriculum note
                for your syllabus.
              </p>
            </div>
            <b>↗</b>
          </article>
          <article data-reveal>
            <span>02</span>
            <div>
              <h3>Everything comes with us</h3>
              <p>
                Prepared objects, tools, safety gear, activity sheets, and a question to take home.
              </p>
            </div>
            <b>↗</b>
          </article>
          <article data-reveal>
            <span>03</span>
            <div>
              <h3>Small groups. Closer looks.</h3>
              <p>
                Up to 40 children per class, one facilitator per 15–20 children, and their teacher
                alongside.
              </p>
            </div>
            <b>↗</b>
          </article>
          <article data-reveal>
            <span>04</span>
            <div>
              <h3>Prepared with care</h3>
              <p>
                Battery-free phones, professionally prepared cutaways, and adult-led opening. Safe
                parts for small hands.
              </p>
            </div>
            <b>↗</b>
          </article>
        </div>
      </section>

      <section class="packages section-pad">
        <div class="section-heading" data-reveal>
          <div>
            <p class="eyebrow dark-eyebrow"><i></i> ONE VISIT. OR A WHOLE TERM OF WHY.</p>
            <h2>A little curiosity.<br /><span>A plan that fits.</span></h2>
          </div>
          <p>
            Indicative planning ranges from our starting offer. We’ll confirm scope, availability,
            and a quote with your school.
          </p>
        </div>
        <div class="package-grid">
          <article data-reveal>
            <span class="micro-label">01 / TRY A DISCOVERY</span>
            <h3>A single workshop</h3>
            <p class="price">₹8,000–15,000</p>
            <p>One class. One everyday object. A whole new way of seeing it.</p>
            <a href="#contact" @click="chooseWorkshop('Single workshop')">Plan a session ↗</a>
          </article>
          <article class="featured-package" data-reveal>
            <span class="micro-label">02 / KEEP THE QUESTIONS COMING</span>
            <h3>A term of discovery</h3>
            <p class="price">₹20,000–35,000</p>
            <p>Three workshops across a term, connecting ideas along the way.</p>
            <a href="#contact" @click="chooseWorkshop('Term package — 3 workshops')"
              >Explore a term package ↗</a
            >
          </article>
          <article data-reveal>
            <span class="micro-label">03 / MAKE A BIGGER DIFFERENCE</span>
            <h3>More ways to wonder</h3>
            <p class="price">Let’s make a plan.</p>
            <p>Annual programs, holiday camps, and CSR or NGO-sponsored school sessions.</p>
            <a href="#contact" @click="chooseWorkshop('Annual or sponsored program')"
              >Talk about possibilities ↗</a
            >
          </article>
        </div>
      </section>

      <section id="faq" class="faq-section section-pad">
        <div class="faq-intro">
          <p class="eyebrow dark-eyebrow"><i></i> GOOD QUESTIONS DESERVE GOOD ANSWERS</p>
          <h2>A few things<br /><span>you might wonder.</span></h2>
          <p>For teachers, coordinators, principals, and the curious grown-ups in the room.</p>
          <a class="text-link" href="#contact">Ask us something else ↗</a>
        </div>
        <div class="faq-list">
          <article v-for="(faq, index) in faqs" :key="faq.question" class="faq-item">
            <h3>
              <button
                type="button"
                :aria-expanded="activeFaq === index"
                :aria-controls="`faq-${index}`"
                @click="activeFaq = activeFaq === index ? -1 : index"
              >
                <span>{{ faq.question }}</span
                ><b aria-hidden="true">{{ activeFaq === index ? '−' : '+' }}</b>
              </button>
            </h3>
            <div :id="`faq-${index}`" :hidden="activeFaq !== index" class="faq-answer">
              <p>{{ faq.answer }}</p>
            </div>
          </article>
        </div>
      </section>

      <section id="contact" class="contact-section section-pad">
        <div class="contact-copy">
          <p class="eyebrow"><i></i> YOUR CLASSROOM. A LITTLE MORE CURIOUS.</p>
          <h2>
            Let’s open up<br /><span>something<br />wonderful.</span>
          </h2>
          <p>
            Tell us about your school and the young minds you want to inspire. A good discovery
            starts with a conversation.
          </p>
          <a class="contact-email" href="mailto:hello@kidsandcuriosity.in"
            >hello@kidsandcuriosity.in ↗</a
          ><span class="contact-flower" aria-hidden="true">✳</span>
        </div>
        <form class="contact-form" @submit.prevent="prepareEmail">
          <div class="form-heading">
            <span class="micro-label">A SCHOOL VISIT STARTS HERE</span
            ><span aria-hidden="true">↗</span>
          </div>
          <div class="form-row">
            <label
              >Your name<input
                v-model="inquiry.name"
                autocomplete="name"
                name="name"
                placeholder="What should we call you?"
                required
                maxlength="120" /></label
            ><label
              >School name<input
                v-model="inquiry.school"
                name="school"
                autocomplete="organization"
                placeholder="Where curiosity happens"
                required
                maxlength="160"
            /></label>
          </div>
          <label
            >Email address<input
              v-model="inquiry.email"
              name="email"
              type="email"
              autocomplete="email"
              placeholder="you@yourschool.edu"
              required
              maxlength="200" /></label
          ><label
            >I’m curious about<select v-model="inquiry.workshop" name="workshop">
              <option>Help me choose</option>
              <option v-for="workshop in workshops" :key="workshop.name">
                {{ workshop.name }}
              </option>
              <option>Light & sound</option>
              <option>Single workshop</option>
              <option>Term package — 3 workshops</option>
              <option>Annual or sponsored program</option>
            </select></label
          ><label
            >A little about your class <span class="optional">(optional)</span
            ><textarea
              v-model="inquiry.message"
              name="message"
              rows="3"
              placeholder="Ages, class size, city, curriculum, or that one big question…"
              maxlength="2000"
            ></textarea></label
          ><button class="button button-lime" type="submit">
            Start a curious conversation <span>↗</span>
          </button>
          <p class="form-note">Opens your email app with your enquiry ready to send.</p>
          <p v-if="emailPrepared" class="email-feedback" role="status">
            Your enquiry is prepared. Send it from your email app to reach us. If it didn’t open,
            email hello@kidsandcuriosity.in.
          </p>
        </form>
      </section>
    </main>
    <footer class="site-footer">
      <a class="brand" href="#home"
        ><span class="brand-mark" aria-hidden="true">✳</span
        ><span>kids<span class="brand-amp">&</span>curiosity</span></a
      >
      <p>Making the familiar a little more fascinating.</p>
      <div>
        <button
          type="button"
          :aria-pressed="stillImages"
          :disabled="reducedMotion"
          @click="toggleMotion"
        >
          {{
            reducedMotion ? 'Reduced motion on' : motionPaused ? 'Play motion ▷' : 'Pause motion Ⅱ'
          }}</button
        ><a href="#home">BACK TO TOP ↑</a>
      </div>
    </footer>
  </div>
</template>
