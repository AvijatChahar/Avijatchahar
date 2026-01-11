document.addEventListener('DOMContentLoaded', () => {
    // Contact Modal
    const contactModal = document.getElementById('contactModal');
    const openContactBtns = document.querySelectorAll('.open-modal-btn');
    const closeContactBtn = document.querySelector('.close-modal');

    // Image Modal
    const imageModal = document.getElementById('imageModal');
    const modalImg = document.getElementById("img01");
    const caseImages = document.querySelectorAll('.case-card img');
    const closeImageModalBtn = document.querySelector('.close-image-modal');

    // Helper to open modal
    function openModal(modal) {
        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        document.body.style.overflow = 'hidden';
    }

    // Helper to close modal
    function closeModal(modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }

    // Contact Modal Events
    openContactBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(contactModal);
        });
    });

    if (closeContactBtn) {
        closeContactBtn.addEventListener('click', () => closeModal(contactModal));
    }

    // Image Modal Events
    caseImages.forEach(img => {
        img.addEventListener('click', function () {
            modalImg.src = this.src;
            openModal(imageModal);
        });
    });

    if (closeImageModalBtn) {
        closeImageModalBtn.addEventListener('click', () => closeModal(imageModal));
    }

    // Global Close (Click Outside or Escape)
    window.addEventListener('click', (e) => {
        if (e.target === contactModal) {
            closeModal(contactModal);
        }
        if (e.target === imageModal) {
            closeModal(imageModal);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (contactModal.classList.contains('show')) closeModal(contactModal);
            if (imageModal && imageModal.classList.contains('show')) closeModal(imageModal);
        }
    });
});
