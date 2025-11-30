import { loadAndRenderThumbnails } from './thumbnail.js';
import './form.js';

const initApp = () => {
  loadAndRenderThumbnails();
};

document.addEventListener('DOMContentLoaded', initApp);
