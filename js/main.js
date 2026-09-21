(() => {
  'use strict';

  /* =========================================================
     01. DOM REFERENCES
     ========================================================= */
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');

  /* =========================================================
     02. MOBILE NAVIGATION
     ========================================================= */
  const closeMenu = () => {
    nav?.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };

  menuToggle?.addEventListener('click', () => {
    const open = nav?.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(Boolean(open)));
    document.body.classList.toggle('menu-open', Boolean(open));
  });

  nav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu);
});


/* CLOSE MENU WHEN CLICKING OUTSIDE */
document.addEventListener('click', (event) => {

  if (!nav?.classList.contains('is-open')) return;

  const clickedInsideNav = nav.contains(event.target);
  const clickedToggle = menuToggle?.contains(event.target);

  if (!clickedInsideNav && !clickedToggle) {
    closeMenu();
  }

});

  /* =========================================================
     03. HEADER SCROLL STATE
     ========================================================= */
  if (header?.dataset.enableScrollHeader === 'true') {
    const threshold = Number(header.dataset.scrollThreshold || 12);
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > threshold);
    }, { passive: true });
  }

  /* =========================================================
     04. HERO SLIDER
     ========================================================= */
  const slides = [...document.querySelectorAll('.hero-slide')];
  const dots = [...document.querySelectorAll('.hero-dots button')];
  const prev = document.querySelector('.hero-arrow.prev');
  const next = document.querySelector('.hero-arrow.next');
  const hero = document.querySelector('.hero');
  let current = 0;
  let timer = null;
  const interval = 6500;

  const showSlide = (index) => {
    if (!slides.length) return;
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === current));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
  };

  const restartSlider = () => {
    clearInterval(timer);
    if (slides.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      timer = setInterval(() => showSlide(current + 1), interval);
    }
  };

  prev?.addEventListener('click', () => { showSlide(current - 1); restartSlider(); });
  next?.addEventListener('click', () => { showSlide(current + 1); restartSlider(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { showSlide(i); restartSlider(); }));

  document.addEventListener('keydown', event => {
    if (!hero || !document.activeElement || !hero.contains(document.activeElement)) return;
    if (event.key === 'ArrowLeft') { showSlide(current - 1); restartSlider(); }
    if (event.key === 'ArrowRight') { showSlide(current + 1); restartSlider(); }
  });

  let touchStartX = 0;
  hero?.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  hero?.addEventListener('touchend', e => {
    const distance = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(distance) < 50) return;
    showSlide(current + (distance < 0 ? 1 : -1));
    restartSlider();
  }, { passive: true });

  showSlide(0);
  restartSlider();

  /* =========================================================
     05. FAQ
     ========================================================= */
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const item = question.closest('.faq-item');
      const isOpen = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(other => {
        other.classList.remove('active');
        other.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
        const icon = other.querySelector('.faq-question b');
        if (icon) icon.textContent = '+';
      });
      if (!isOpen) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
        const icon = question.querySelector('b');
        if (icon) icon.textContent = '−';
      }
    });
  });

  /* =========================================================
     06. SCROLL REVEAL
     ========================================================= */
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(el => observer.observe(el));
  } else {
    revealItems.forEach(el => el.classList.add('visible'));
  }

  /* =========================================================
     07. STATS
     ========================================================= */
  const counters = document.querySelectorAll('.stat strong[data-target]');
  const format = n => n.toLocaleString('en-IN');
  const animateCounter = el => {
    const target = Number(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const duration = 1500;
    const start = performance.now();
    const tick = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = format(Math.floor(target * eased)) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const stats = document.querySelector('.stats');
  if (stats && counters.length) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      counters.forEach(el => { el.textContent = format(Number(el.dataset.target)) + (el.dataset.suffix || ''); });
    } else if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          counters.forEach(animateCounter);
          observer.disconnect();
        }
      }, { threshold: 0.4 });
      observer.observe(stats);
    }
  }

  /* =========================================================
     08. FOOTER YEAR
     ========================================================= */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();

/* =========================================================
   PREMIUM FEATURE CARD CURSOR EFFECT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const cards = document.querySelectorAll(".feature");

    cards.forEach((card) => {

        card.addEventListener("mousemove", (event) => {

            const rect = card.getBoundingClientRect();

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const mx = (x / rect.width) * 100;
            const my = (y / rect.height) * 100;

            card.style.setProperty("--mx", `${mx}%`);
            card.style.setProperty("--my", `${my}%`);

        });

        card.addEventListener("mouseleave", () => {

            card.style.removeProperty("--mx");
            card.style.removeProperty("--my");

        });

    });

});

/* =========================================================
   PREMIUM TESTIMONIAL CAROUSEL
========================================================= */

const testimonialCarousel =
    document.querySelector('.testimonial-carousel');

const testimonialTrack =
    document.querySelector('.testimonial-track');

const testimonialCards =
    testimonialTrack
        ? Array.from(
            testimonialTrack.querySelectorAll('.testimonial-card')
        )
        : [];

const testimonialDots =
    Array.from(
        document.querySelectorAll('.testimonial-dots button')
    );

const testimonialPrev =
    document.querySelector('.testimonial-prev');

const testimonialNext =
    document.querySelector('.testimonial-next');


let testimonialIndex = 0;


/* =========================================================
   GET CURRENT MODE
========================================================= */

function isTestimonialMobile() {

    return window.matchMedia(
        '(max-width: 850px)'
    ).matches;

}


/* =========================================================
   UPDATE CAROUSEL
========================================================= */

function updateTestimonialSlider() {

    if (
        !testimonialTrack ||
        !testimonialCarousel ||
        !testimonialCards.length
    ) {
        return;
    }


    /* =====================================================
       MOBILE
       One card at a time
    ===================================================== */

    if (isTestimonialMobile()) {

        testimonialTrack.style.transform =
            `translateX(-${testimonialIndex * 100}%)`;

    }


    /* =====================================================
       DESKTOP
       Multiple cards visible
    ===================================================== */

    else {

        const card =
            testimonialCards[0];

        const cardWidth =
            card.getBoundingClientRect().width;

        const gap =
            parseFloat(
                getComputedStyle(
                    testimonialTrack
                ).gap
            ) || 0;


        /*
           Move one card at a time.

           This means:

           Card 1 | Card 2 | Card 3
           ↓

           Card 2 | Card 3 | Card 4
        */

        const offset =
            testimonialIndex *
            (cardWidth + gap);


        testimonialTrack.style.transform =
            `translateX(-${offset}px)`;

    }


    /* =====================================================
       DOTS
    ===================================================== */

    testimonialDots.forEach(
        (dot, index) => {

            dot.classList.toggle(
                'active',
                index === testimonialIndex
            );

        }
    );


    /* =====================================================
       ARROWS
    ===================================================== */

    if (testimonialPrev) {

        testimonialPrev.hidden =
            testimonialIndex === 0;

    }


    if (testimonialNext) {

        /*
           We can continue moving until the last card
           becomes the first visible card.

           On desktop, however, we should stop when
           there are not enough cards left to fill the
           visible area.
        */

        if (isTestimonialMobile()) {

            testimonialNext.hidden =
                testimonialIndex ===
                testimonialCards.length - 1;

        }

        else {

            const cardWidth =
                testimonialCards[0]
                    .getBoundingClientRect()
                    .width;

            const gap =
                parseFloat(
                    getComputedStyle(
                        testimonialTrack
                    ).gap
                ) || 0;

            const carouselWidth =
                testimonialCarousel
                    .getBoundingClientRect()
                    .width;

            const visibleCards =
                Math.floor(
                    (carouselWidth + gap) /
                    (cardWidth + gap)
                );

            const maxIndex =
                Math.max(
                    0,
                    testimonialCards.length -
                    visibleCards
                );

            testimonialNext.hidden =
                testimonialIndex >= maxIndex;

        }

    }

}


/* =========================================================
   NEXT
========================================================= */

testimonialNext?.addEventListener(
    'click',
    () => {

        if (isTestimonialMobile()) {

            if (
                testimonialIndex <
                testimonialCards.length - 1
            ) {

                testimonialIndex++;

                updateTestimonialSlider();

            }

            return;
        }


        /*
           DESKTOP
        */

        const card =
            testimonialCards[0];

        const cardWidth =
            card.getBoundingClientRect().width;

        const gap =
            parseFloat(
                getComputedStyle(
                    testimonialTrack
                ).gap
            ) || 0;

        const carouselWidth =
            testimonialCarousel
                .getBoundingClientRect()
                .width;

        const visibleCards =
            Math.floor(
                (carouselWidth + gap) /
                (cardWidth + gap)
            );

        const maxIndex =
            Math.max(
                0,
                testimonialCards.length -
                visibleCards
            );


        if (
            testimonialIndex <
            maxIndex
        ) {

            testimonialIndex++;

            updateTestimonialSlider();

        }

    }
);


/* =========================================================
   PREVIOUS
========================================================= */

testimonialPrev?.addEventListener(
    'click',
    () => {

        if (
            testimonialIndex > 0
        ) {

            testimonialIndex--;

            updateTestimonialSlider();

        }

    }
);


/* =========================================================
   DOT NAVIGATION
========================================================= */

testimonialDots.forEach(
    (dot, index) => {

        dot.addEventListener(
            'click',
            () => {

                /*
                   Don't allow desktop dots to move
                   beyond the available carousel range.
                */

                if (!isTestimonialMobile()) {

                    const card =
                        testimonialCards[0];

                    const cardWidth =
                        card.getBoundingClientRect()
                            .width;

                    const gap =
                        parseFloat(
                            getComputedStyle(
                                testimonialTrack
                            ).gap
                        ) || 0;

                    const carouselWidth =
                        testimonialCarousel
                            .getBoundingClientRect()
                            .width;

                    const visibleCards =
                        Math.floor(
                            (carouselWidth + gap) /
                            (cardWidth + gap)
                        );

                    const maxIndex =
                        Math.max(
                            0,
                            testimonialCards.length -
                            visibleCards
                        );

                    testimonialIndex =
                        Math.min(
                            index,
                            maxIndex
                        );

                }

                else {

                    testimonialIndex = index;

                }

                updateTestimonialSlider();

            }
        );

    }
);


/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(
    'resize',
    () => {

        /*
           Prevent an invalid index when changing
           between mobile and desktop.
        */

        if (
            testimonialIndex >=
            testimonialCards.length
        ) {

            testimonialIndex =
                testimonialCards.length - 1;

        }

        updateTestimonialSlider();

    }
);


/* =========================================================
   MOBILE TOUCH SWIPE
========================================================= */

let testimonialTouchStartX = 0;

let testimonialTouchEndX = 0;


testimonialCarousel?.addEventListener(
    'touchstart',
    (event) => {

        testimonialTouchStartX =
            event.touches[0].clientX;

    },
    {
        passive: true
    }
);


testimonialCarousel?.addEventListener(
    'touchend',
    (event) => {

        /*
           Swipe only on mobile.
        */

        if (!isTestimonialMobile()) {
            return;
        }


        testimonialTouchEndX =
            event.changedTouches[0].clientX;


        const swipeDistance =
            testimonialTouchEndX -
            testimonialTouchStartX;


        const minimumSwipe = 50;


        if (
            Math.abs(swipeDistance) <
            minimumSwipe
        ) {

            return;

        }


        /* Swipe left → next */

        if (swipeDistance < 0) {

            if (
                testimonialIndex <
                testimonialCards.length - 1
            ) {

                testimonialIndex++;

                updateTestimonialSlider();

            }

        }


        /* Swipe right → previous */

        else {

            if (
                testimonialIndex > 0
            ) {

                testimonialIndex--;

                updateTestimonialSlider();

            }

        }

    },
    {
        passive: true
    }
);


/* =========================================================
   INITIALIZE
========================================================= */

updateTestimonialSlider();

/* =========================================================
   CONTACT FORM — FORMSPREE AJAX SUBMISSION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("contact-form");
    const popup = document.getElementById("formPopup");
    const popupClose = document.getElementById("formPopupClose");
    const popupDone = document.getElementById("formPopupDone");
    const popupOverlay = popup?.querySelector(".form-popup-overlay");

    if (!form || !popup) return;


    /* Open popup */

    const openPopup = () => {
        popup.classList.add("is-open");
        popup.setAttribute("aria-hidden", "false");

        document.body.style.overflow = "hidden";

        setTimeout(() => {
            popupClose?.focus();
        }, 100);
    };


    /* Close popup */

    const closePopup = () => {
        popup.classList.remove("is-open");
        popup.setAttribute("aria-hidden", "true");

        document.body.style.overflow = "";
    };


    /* Submit form */

    form.addEventListener("submit", async (event) => {

        event.preventDefault();
        event.stopPropagation();

        const submitButton = form.querySelector('button[type="submit"]');

        if (!submitButton) return;


        /* Save original button text */

        const originalText = submitButton.textContent;

        submitButton.disabled = true;
        submitButton.textContent = "Sending...";


        try {

            const response = await fetch(form.action, {
                method: "POST",
                body: new FormData(form),
                headers: {
                    "Accept": "application/json"
                }
            });


            if (response.ok) {

                /* Clear all form fields */

                form.reset();

                /* Restore button */

                submitButton.disabled = false;
                submitButton.textContent = originalText;

                /* Show success popup */

                openPopup();

            } else {

                submitButton.disabled = false;
                submitButton.textContent = originalText;

                alert(
                    "Something went wrong while sending your enquiry. Please try again."
                );
            }

        } catch (error) {

            console.error("Form submission error:", error);

            submitButton.disabled = false;
            submitButton.textContent = originalText;

            alert(
                "Unable to send your enquiry right now. Please check your internet connection and try again."
            );
        }

    });


    /* Close buttons */

    popupClose?.addEventListener("click", closePopup);

    popupDone?.addEventListener("click", closePopup);

    popupOverlay?.addEventListener("click", closePopup);


    /* Close with Escape */

    document.addEventListener("keydown", (event) => {

        if (
            event.key === "Escape" &&
            popup.classList.contains("is-open")
        ) {
            closePopup();
        }

    });

});

document.addEventListener("DOMContentLoaded", () => {

    const slider = document.querySelector(".opportunities-slider");
    const track = document.querySelector(".opportunities");
    const cards = document.querySelectorAll(".opportunity");
    const dots = document.querySelectorAll(".opportunity-dot");

    if (!slider || !track || !cards.length) return;

    let currentIndex = 0;

    function updateSlider() {

        if (window.innerWidth <= 850) {

            track.style.transform =
                `translateX(-${currentIndex * 100}%)`;

            dots.forEach((dot, index) => {
                dot.classList.toggle(
                    "active",
                    index === currentIndex
                );
            });

        } else {

            track.style.transform = "translateX(0)";

        }
    }


    /* DOTS */

    dots.forEach((dot, index) => {

        dot.addEventListener("click", () => {

            currentIndex = index;

            updateSlider();

        });

    });


    /* TOUCH */

    let startX = 0;

    slider.addEventListener(
        "touchstart",
        (event) => {

            if (window.innerWidth > 850) return;

            startX = event.touches[0].clientX;

        },
        { passive: true }
    );


    slider.addEventListener(
        "touchend",
        (event) => {

            if (window.innerWidth > 850) return;

            const endX = event.changedTouches[0].clientX;

            const distance = endX - startX;


            /* Swipe LEFT */

            if (distance < -50) {

                if (currentIndex < cards.length - 1) {

                    currentIndex++;

                    updateSlider();

                }

            }


            /* Swipe RIGHT */

            else if (distance > 50) {

                if (currentIndex > 0) {

                    currentIndex--;

                    updateSlider();

                }

            }

        },
        { passive: true }
    );


    /* RESIZE */

    window.addEventListener("resize", () => {

        if (window.innerWidth > 850) {
            currentIndex = 0;
        }

        updateSlider();

    });


    updateSlider();

});