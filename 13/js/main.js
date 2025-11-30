import { loadAndRenderThumbnails } from './thumbnail.js';
import { initFilters } from './filters.js';
import './form.js';

const initApp = () => {
  loadAndRenderThumbnails().then(() => {
    initFilters();
  });
};

document.addEventListener('DOMContentLoaded', initApp);
