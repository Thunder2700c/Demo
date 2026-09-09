// ==========================================================================
// KESHA CULTURE-TECH PLATFORM - CLIENT JAVASCRIPT
// Handles: Mobile Drawer, Accordions, Dynamic Forms (Web3Forms), Smooth Scroll
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  // ------------------------------------------------------------------------
  // 1. Mobile Drawer Navigation
  // ------------------------------------------------------------------------
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const closeDrawerBtn = document.getElementById('close-drawer');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

  function openDrawer() {
    if (mobileDrawer) mobileDrawer.classList.add('active');
  }

  function closeDrawer() {
    if (mobileDrawer) mobileDrawer.classList.remove('active');
  }

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', openDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);

  // Close drawer automatically when clicking any link
  mobileNavItems.forEach((item) => {
    item.addEventListener('click', closeDrawer);
  });

  // Close drawer when clicking outside
  document.addEventListener('click', (event) => {
    if (
      mobileDrawer &&
      mobileDrawer.classList.contains('active') &&
      !mobileDrawer.contains(event.target) &&
      !hamburgerBtn.contains(event.target)
    ) {
      closeDrawer();
    }
  });


  // ------------------------------------------------------------------------
  // 2. FAQ Accordion Interaction
  // ------------------------------------------------------------------------
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach((item) => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other accordions for clean single-item expansion
      accordionItems.forEach((otherItem) => {
        otherItem.classList.remove('active');
        const otherContent = otherItem.querySelector('.accordion-content');
        if (otherContent) otherContent.style.maxHeight = null;
      });

      // Toggle clicked accordion
      if (!isActive) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        item.classList.remove('active');
        content.style.maxHeight = null;
      }
    });
  });


  // ------------------------------------------------------------------------
  // 3. Web3Forms Form Submission Handlers (No Server Needed)
  // ------------------------------------------------------------------------
  function setupFormHandler(formId, statusId) {
    const form = document.getElementById(formId);
    const statusDiv = document.getElementById(statusId);

    if (!form || !statusDiv) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';

      statusDiv.className = 'form-message';
      statusDiv.textContent = '';

      const formData = new FormData(form);

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (response.status === 200) {
          statusDiv.className = 'form-message success';
          statusDiv.textContent = '✓ Thank you! Details submitted successfully. Our team will contact you shortly.';
          form.reset();
        } else {
          statusDiv.className = 'form-message error';
          statusDiv.textContent = data.message || 'Submission failed. Please reach out to priyanshu@kesha.co.in directly.';
        }
      } catch (error) {
        statusDiv.className = 'form-message error';
        statusDiv.textContent = 'Something went wrong. Please check your connection or contact us via WhatsApp.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    });
  }

  // Bind forms
  setupFormHandler('pandit-form', 'pandit-form-status');
  setupFormHandler('contact-form', 'contact-form-status');


  // ------------------------------------------------------------------------
  // 4. Sticky Header Shadow on Scroll
  // ------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.style.boxShadow = '0 4px 20px rgba(31, 31, 31, 0.08)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  });

});
