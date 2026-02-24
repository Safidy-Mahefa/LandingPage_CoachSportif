    // ================================================
    // EMAILJS — CONFIGURATION
    // ================================================
    /*
      PERSONNALISER [EMAILJS_PUBLIC_KEY] :
      1. Créez un compte sur https://www.emailjs.com
      2. Créez un service email (Gmail, Outlook, etc.)
      3. Créez un template et récupérez les IDs
      4. Remplacez les valeurs ci-dessous
    */
    (function() {
      emailjs.init('[EMAILJS_PUBLIC_KEY]'); // Remplacez par votre Public Key EmailJS
    })();

    const EMAILJS_SERVICE_ID  = '[EMAILJS_SERVICE_ID]';   // Ex: "service_xxxxxx"
    const EMAILJS_TEMPLATE_ID = '[EMAILJS_TEMPLATE_ID]';  // Ex: "template_xxxxxx"


    // ================================================
    // HEADER — Scroll effect
    // ================================================
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });


    // ================================================
    // BURGER MENU MOBILE
    // ================================================
    const burger    = document.getElementById('burger');
    const navDrawer = document.getElementById('navDrawer');
    const drawerLinks = navDrawer.querySelectorAll('a');

    burger.addEventListener('click', () => {
      const isOpen = burger.classList.toggle('open');
      navDrawer.classList.toggle('open');
      burger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        navDrawer.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });


    // ================================================
    // SCROLL REVEAL — IntersectionObserver
    // ================================================
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target); // déclencher une seule fois
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
      .forEach(el => revealObserver.observe(el));


    // ================================================
    // FAQ — Accordéon
    // ================================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
      const btn    = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');

      btn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Fermer tous les autres items
        faqItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('active');
            other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle l'item courant
        item.classList.toggle('active', !isActive);
        btn.setAttribute('aria-expanded', !isActive);
      });
    });


    // ================================================
    // FORMULAIRE CONTACT — EmailJS
    // ================================================
    const form       = document.getElementById('contactForm');
    const submitBtn  = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const formStatus = document.getElementById('form-status');

    form.addEventListener('submit', function(e) {
      e.preventDefault();

      // Validation basique
      const required = form.querySelectorAll('[required]');
      let valid = true;
      required.forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = 'var(--orange)';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });

      if (!valid) {
        showStatus('error', 'Veuillez remplir tous les champs obligatoires (*).');
        return;
      }

      // Désactiver le bouton pendant l'envoi
      submitBtn.disabled = true;
      submitText.textContent = 'Envoi en cours…';

      // Paramètres EmailJS (noms correspondant aux variables dans votre template)
      const templateParams = {
        from_prenom : form.prenom.value.trim(),
        from_nom    : form.nom.value.trim(),
        from_email  : form.email.value.trim(),
        from_tel    : form.telephone.value.trim(),
        objectif    : form.objectif.value,
        message     : form.message.value.trim()
      };

      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(() => {
          showStatus('success', '✓ Votre message a bien été envoyé ! Lucas vous répondra dans les plus brefs délais.');
          form.reset();
          submitBtn.disabled = false;
          submitText.textContent = 'Envoyer ma demande';
        })
        .catch((err) => {
          console.error('EmailJS error:', err);
          showStatus('error', '✗ Une erreur est survenue. Contactez Lucas directement sur WhatsApp.');
          submitBtn.disabled = false;
          submitText.textContent = 'Envoyer ma demande';
        });
    });

    function showStatus(type, msg) {
      formStatus.className = type;
      formStatus.textContent = msg;
      formStatus.style.display = 'block';
      setTimeout(() => {
        formStatus.style.display = 'none';
      }, 8000);
    }


    // ================================================
    // FOOTER — Année dynamique
    // ================================================
    document.getElementById('footer-year').textContent = new Date().getFullYear();