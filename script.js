// Year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Cursor
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    if(cursor) cursor.style.transform = `translate(${mx-5}px,${my-5}px)`;
  });
  function animRing() {
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    if(ring) ring.style.transform = `translate(${rx-19}px,${ry-19}px)`;
    requestAnimationFrame(animRing);
  }
  animRing();

  // Mobile menu
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobile-menu');
  const bar1 = document.getElementById('bar1');
  const bar2 = document.getElementById('bar2');
  const bar3 = document.getElementById('bar3');
  let menuOpen = false;
  menuBtn.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    bar1.style.transform = menuOpen ? 'rotate(45deg) translate(4px,4px)' : '';
    bar2.style.opacity = menuOpen ? '0' : '1';
    bar3.style.transform = menuOpen ? 'rotate(-45deg) translate(4px,-4px)' : '';
    bar3.style.width = menuOpen ? '24px' : '';
  });
  document.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', () => {
    menuOpen = false; mobileMenu.classList.remove('open');
    bar1.style.transform = ''; bar2.style.opacity = '1'; bar3.style.transform = ''; bar3.style.width = '';
  }));

  // Typed text
  const phrases = [
    'building scalable web applications...',
    'crafting pixel-perfect interfaces...',
    'turning ideas into digital products...',
    'writing clean, maintainable code...',
  ];
  let pi = 0, ci = 0, deleting = false;
  const typedEl = document.getElementById('typed-text');
  function type() {
    const phrase = phrases[pi];
    if (!deleting) {
      typedEl.textContent = phrase.substring(0, ci + 1); ci++;
      if (ci === phrase.length) { deleting = true; setTimeout(type, 1800); return; }
    } else {
      typedEl.textContent = phrase.substring(0, ci - 1); ci--;
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(type, deleting ? 40 : 80);
  }
  setTimeout(type, 1000);

  // Counters
  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    let current = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current + (target > 10 ? '+' : '');
      if (current >= target) clearInterval(timer);
    }, 40);
  }
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting) { animateCounter(e.target); counterObs.unobserve(e.target); } });
  }, { threshold: 0.5 });
  document.querySelectorAll('.counter-num').forEach(el => counterObs.observe(el));

  // Scroll reveal
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting) { e.target.classList.add('in-view'); revealObs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  // Skill bars on scroll
  const skillObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting) {
        e.target.querySelectorAll('.skill-fill').forEach(b => b.classList.add('animated'));
        skillObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('#skills').forEach(el => skillObs.observe(el));

  // Back to top visibility
  const backTop = document.getElementById('backTop');
  window.addEventListener('scroll', () => {
    backTop.classList.toggle('visible', window.scrollY > 400);
  });

  // ─────────────────────────────────────────────
  // ✏️  EMAILJS CONFIGURATION — edit these 3 values
  // Go to https://www.emailjs.com → Account → API Keys
  // ─────────────────────────────────────────────
  const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // ✏️ Replace with your Public Key
  const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // ✏️ Replace with your Service ID
  const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // ✏️ Replace with your Template ID
  // ─────────────────────────────────────────────

  // Initialise EmailJS with your public key
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

  // Form submit handler
  async function handleSubmit(e) {
    e.preventDefault();

    const form    = e.target;
    const btn     = form.querySelector('button[type="submit"]');
    const msg     = document.getElementById('form-msg');

    // Collect form values
    // NOTE: These names must match your EmailJS template variables exactly.
    // Default template variables used here: {{from_name}}, {{from_email}},
    // {{subject}}, {{budget}}, {{message}}
    const templateParams = {
      from_name:  document.getElementById('name').value.trim(),
      from_email: document.getElementById('email').value.trim(),
      subject:    document.getElementById('subject').value.trim() || 'No subject',
      budget:     document.getElementById('budget').value || 'Not specified',
      message:    document.getElementById('message').value.trim(),
    };

    // Show loading state on button
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled    = true;
    btn.style.opacity = '0.6';

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);

      // Success
      msg.textContent = '✓ Message sent! I\'ll get back to you within 24 hours.';
      msg.className   = 'font-mono text-xs tracking-wider mt-4 text-chalk/70';
      form.reset();

    } catch (error) {
      // Error
      console.error('EmailJS error:', error);
      msg.textContent = '✗ Something went wrong. Please try WhatsApp or email me directly.';
      msg.className   = 'font-mono text-xs tracking-wider mt-4 text-red-400';
    }

    // Restore button
    btn.textContent   = originalText;
    btn.disabled      = false;
    btn.style.opacity = '1';

    // Hide message after 6 seconds
    setTimeout(() => { msg.className = 'font-mono text-xs tracking-wider hidden'; }, 6000);
  }

  // Smooth scroll offset for fixed nav
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if(id === '#') return;
      const el = document.querySelector(id);
      if(el) { e.preventDefault(); window.scrollTo({ top: el.offsetTop - 64, behavior: 'smooth' }); }
    });
  });



