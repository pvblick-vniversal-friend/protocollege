// Landing page scroll animation
(function() {
    'use strict';
    
    const landingTitle = document.getElementById('landing-title');
    const heroContent = document.getElementById('hero-content');
    const siteHeader = document.getElementById('site-header');
    const headerTitle = document.querySelector('.header-title');
    
    if (!landingTitle || !siteHeader) return;
    
    // Initial state: hide header, show large title
    siteHeader.style.opacity = '0';
    siteHeader.style.transform = 'translateY(-100%)';
    
    // Fade in large title on load
    window.addEventListener('load', function() {
        landingTitle.style.opacity = '1';
    });
    
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function updateHeader() {
        const scrollY = window.scrollY;
        const scrollThreshold = 100;
        
        if (scrollY > scrollThreshold) {
            // Scrolled down: minimize title, show header
            landingTitle.classList.add('minimized');
            siteHeader.style.opacity = '1';
            siteHeader.style.transform = 'translateY(0)';
            heroContent.style.marginTop = '0';
        } else {
            // At top: show large title, hide header
            landingTitle.classList.remove('minimized');
            siteHeader.style.opacity = '0';
            siteHeader.style.transform = 'translateY(-100%)';
            heroContent.style.marginTop = '0';
        }
        
        ticking = false;
    }
    
    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Initial check
    updateHeader();
})();

