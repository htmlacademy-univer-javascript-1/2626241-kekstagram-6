import { renderThumbnails } from './thumbnail.js';
import './form.js'; // Импортируем модуль формы

const initApp = () => {
  renderThumbnails();
};

document.addEventListener('DOMContentLoaded', initApp);