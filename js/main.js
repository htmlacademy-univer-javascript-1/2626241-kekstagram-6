import { getData } from './api.js';
import { renderThumbnails, photos } from './thumbnail.js';
import { initFilters } from './filters.js';
import { initImageEditor } from './image-editor.js';
import { initImageUpload } from './image-upload.js';

const createDataError = () => {
  const errorElement = document.createElement('div');
  errorElement.className = 'data-error';
  errorElement.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    padding: 15px;
    background-color: #ff4e4e;
    color: white;
    text-align: center;
    font-family: "Open Sans", "Arial", sans-serif;
    font-weight: 700;
  `;
  errorElement.textContent = 'Не удалось загрузить данные. Попробуйте обновить страницу';
  return errorElement;
};

const showDataError = () => {
  let errorElement = document.querySelector('.data-error');
  if (!errorElement) {
    errorElement = createDataError();
    document.body.appendChild(errorElement);

    setTimeout(() => {
      if (errorElement && errorElement.parentNode) {
        errorElement.remove();
      }
    }, 5000);
  }
};

const loadAndRenderThumbnails = () => getData()
  .then((data) => {
    photos.length = 0;
    photos.push(...data);
    renderThumbnails(photos);

    const filtersContainer = document.querySelector('.img-filters');
    if (filtersContainer) {
      filtersContainer.classList.remove('img-filters--inactive');

      const defaultButton = filtersContainer.querySelector('#filter-default');
      if (defaultButton) {
        defaultButton.classList.add('img-filters__button--active');
      }
    }

    initFilters(photos);

    return data;
  })
  .catch(() => {
    const filtersContainer = document.querySelector('.img-filters');
    if (filtersContainer) {
      filtersContainer.classList.add('img-filters--inactive');
    }
    throw new Error('Failed to load photos');
  });

const initApp = () => {
  initImageEditor();
  initImageUpload();

  loadAndRenderThumbnails()
    .catch(() => {
      showDataError();
    });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

export { loadAndRenderThumbnails };
