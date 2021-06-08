import galleryItems from '../gallery-items.js';

const refs = {
  gallery: document.querySelector('ul.js-gallery'),
  // galleryImg: document.querySelector('.gallery__image'),
  lightbox: document.querySelector('.js-lightbox'),
  lightboxBtnClose: document.querySelector('[data-action="close-lightbox"]'),
  lightboxImg: document.querySelector('.js-lightbox .lightbox__image'),
  lightboxOverlay: document.querySelector('.lightbox__overlay'),
};

const createGalleryArr = galleryItems.map(image => {
  return `<li class="gallery__item">
  <a
    class="gallery__link"
    href="${image.original}"
  >
    <img
      class="gallery__image"
      src="${image.preview}"
      data-source="${image.original}"
      alt="${image.description}"
    />
  </a>
</li>`;
});

refs.gallery.insertAdjacentHTML('beforeend', createGalleryArr.join(''));

const onLigthboxCloseClick = () => {
  refs.lightbox.classList.remove('is-open');
  bodyScrollLock();
  window.removeEventListener('keydown', onLigthboxCloseEsc);
  window.removeEventListener('keydown', onLightboxNextImg);
  window.removeEventListener('keydown', onLightboxPriviousImg);
};

const onLigthboxCloseEsc = event => {
  if (event.code === 'Escape') {
    refs.lightbox.classList.remove('is-open');
    bodyScrollLock();
    window.removeEventListener('keydown', onLigthboxCloseEsc);
    window.removeEventListener('keydown', onLightboxNextImg);
    window.removeEventListener('keydown', onLightboxPriviousImg);
  }
};

const onLigthboxCloseBackdropClick = event => {
  if (event.target === refs.lightboxOverlay) {
    refs.lightbox.classList.remove('is-open');
    bodyScrollLock();
    window.removeEventListener('keydown', onLigthboxCloseEsc);
    window.removeEventListener('keydown', onLightboxNextImg);
    window.removeEventListener('keydown', onLightboxPriviousImg);
  }
};

const findNextImgSrc = currentSrc => {
  let currentIdx = 0;
  galleryItems.forEach((item, idx) => {
    if (item.original === currentSrc) {
      currentIdx = idx;
    }
  });

  if (currentIdx === galleryItems.length - 1) {
    return galleryItems[0].original;
  }

  return galleryItems[currentIdx + 1].original;
};

const findPreviousImgSrc = currentSrc => {
  let currentIdx = 0;
  galleryItems.forEach((item, idx) => {
    if (item.original === currentSrc) {
      currentIdx = idx;
    }
  });

  if (currentIdx === 0) {
    return galleryItems[galleryItems.length - 1].original;
  }

  return galleryItems[currentIdx - 1].original;
};

const onLightboxNextImg = event => {
  if (event.code === 'ArrowRight') {
    refs.lightboxImg.src = findNextImgSrc(refs.lightboxImg.src);
  }
};

const onLightboxPriviousImg = event => {
  if (event.code === 'ArrowLeft') {
    refs.lightboxImg.src = findPreviousImgSrc(refs.lightboxImg.src);
  }
};

const bodyScrollLock = () => {
  if (refs.lightbox.classList.contains('is-open')) {
    document.body.style.overflow = 'hidden';
    document.body.style.width = 'calc(100% - 15px)';
  } else {
    document.body.style.overflow = 'auto';
    document.body.style.width = '100%';
  }
};

const onGalleryImgClick = event => {
  event.preventDefault();

  if (event.target.nodeName !== 'IMG') {
    return;
  }

  refs.lightboxImg.src = `${event.target.dataset.source}`;
  setTimeout(() => {
    refs.lightbox.classList.add('is-open');
    bodyScrollLock();

    refs.lightboxBtnClose.addEventListener('click', onLigthboxCloseClick);
    window.addEventListener('keydown', onLigthboxCloseEsc);
    refs.lightbox.addEventListener('click', onLigthboxCloseBackdropClick);

    window.addEventListener('keydown', onLightboxNextImg);
    window.addEventListener('keydown', onLightboxPriviousImg);
  }, 100);
};

refs.gallery.addEventListener('click', onGalleryImgClick);
