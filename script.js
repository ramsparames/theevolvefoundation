// mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));

  // scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));

  // accordion
  const NAV_OFFSET = 76; // fixed nav height + breathing room
  const TRANSITION_MS = 460; // matches the CSS max-height transition duration below, plus a small buffer
  function closeAccordion(trigger){
    const panel = document.getElementById(trigger.getAttribute('aria-controls'));
    trigger.setAttribute('aria-expanded', 'false');
    panel.style.maxHeight = null;
  }
  function openAccordion(trigger){
    const panel = document.getElementById(trigger.getAttribute('aria-controls'));
    trigger.setAttribute('aria-expanded', 'true');
    panel.style.maxHeight = panel.scrollHeight + 'px';
  }
  function scrollTriggerIntoView(trigger){
    const y = trigger.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
  const allTriggers = Array.from(document.querySelectorAll('.acc-trigger'));
  // All accordion sections remain collapsed on initial load.
  allTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      allTriggers.forEach(t => { if(t !== trigger) closeAccordion(t); });
      if(isOpen){
        closeAccordion(trigger);
      } else {
        openAccordion(trigger);
        // Wait for the collapse (of any other open panel) and the expand
        // transition to both fully finish before scrolling — scrolling any
        // earlier reads a position that the layout hasn't settled into yet,
        // and the page shifting afterward leaves the section mis-scrolled.
        setTimeout(() => scrollTriggerIntoView(trigger), TRANSITION_MS);
      }
    });
  });

  // recalc open panel height on resize (fonts/wrap can change content height)
  window.addEventListener('resize', () => {
    allTriggers.forEach(trigger => {
      if(trigger.getAttribute('aria-expanded') === 'true'){
        const panel = document.getElementById(trigger.getAttribute('aria-controls'));
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  // nav links: expand + scroll to accordion items when linked directly
  document.querySelectorAll('.nav-links a[href^="#acc-"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href').slice(1);
      const item = document.getElementById(id);
      if(item){
        e.preventDefault();
        const trigger = item.querySelector('.acc-trigger');
        if(trigger.getAttribute('aria-expanded') !== 'true'){
          allTriggers.forEach(t => { if(t !== trigger) closeAccordion(t); });
          openAccordion(trigger);
        }
        setTimeout(() => scrollTriggerIntoView(trigger), TRANSITION_MS);
      }
      navLinks.classList.remove('open');
    });
  });
  document.querySelectorAll('.nav-links a:not([href^="#acc-"])').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
