// ==========================================================================
// KESHA CULTURE-TECH PLATFORM - CLIENT JAVASCRIPT
// Handles: Web3Forms Contact Form Handler & Sticky Navbar Elevation
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  // ------------------------------------------------------------------------
  // 1. Web3Forms Form Submission Handler (Contact Form)
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

  // Initialize Contact Form
  setupFormHandler('contact-form', 'contact-form-status');


  // ------------------------------------------------------------------------
  // 2. Sticky Header Shadow on Scroll
  // ------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (navbar) {
      if (window.scrollY > 30) {
        navbar.style.boxShadow = '0 4px 20px rgba(31, 31, 31, 0.08)';
      } else {
        navbar.style.boxShadow = 'none';
      }
    }
  });

});
