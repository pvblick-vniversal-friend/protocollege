// Side menu toggle functionality
(function() {
    'use strict';
    
    const menuToggle = document.getElementById('menu-toggle');
    const menuContent = document.getElementById('menu-content');
    const sideMenu = document.getElementById('side-menu');
    
    if (!menuToggle || !menuContent) return;
    
    menuToggle.addEventListener('click', function() {
        sideMenu.classList.toggle('menu-open');
        menuToggle.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (sideMenu && !sideMenu.contains(event.target) && sideMenu.classList.contains('menu-open')) {
            sideMenu.classList.remove('menu-open');
            menuToggle.classList.remove('active');
        }
    });
})();

