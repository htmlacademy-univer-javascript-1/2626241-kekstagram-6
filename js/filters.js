import { renderThumbnails } from './thumbnail.js';

const filtersContainer = document.querySelector('.img-filters');
const filterButtons = {
  default: document.querySelector('#filter-default'),
  random: document.querySelector('#filter-random'),
  discussed: document.querySelector('#filter-discussed')
};

let currentFilter = 'default';
let photos = [];
let applyFilterTimeout = null;

const getDefaultPhotos = () => [...photos];

const getRandomPhotos = () => {
  const shuffled = [...photos].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 10);
};

const getDiscussedPhotos = () => [...photos].sort((a, b) => b.comments.length - a.comments.length);

const setActiveButton = (filterName) => {
  Object.values(filterButtons).forEach((button) => {
    if (button) {
      button.classList.remove('img-filters__button--active');
    }
  });

  if (filterButtons[filterName]) {
    filterButtons[filterName].classList.add('img-filters__button--active');
  }

  currentFilter = filterName;
};

const applyFilter = () => {
  if (!photos.length) {
    return;
  }

  let filteredPhotos;
  switch (currentFilter) {
    case 'random':
      filteredPhotos = getRandomPhotos();
      break;
    case 'discussed':
      filteredPhotos = getDiscussedPhotos();
      break;
    default:
      filteredPhotos = getDefaultPhotos();
  }

  if (applyFilterTimeout) {
    clearTimeout(applyFilterTimeout);
  }

  applyFilterTimeout = setTimeout(() => {
    renderThumbnails(filteredPhotos);
  }, 500);
};

const onDefaultClick = (evt) => {
  evt.preventDefault();
  setActiveButton('default');
  applyFilter();
};

const onRandomClick = (evt) => {
  evt.preventDefault();
  setActiveButton('random');
  applyFilter();
};

const onDiscussedClick = (evt) => {
  evt.preventDefault();
  setActiveButton('discussed');
  applyFilter();
};

const initFilters = (loadedPhotos) => {
  if (loadedPhotos && loadedPhotos.length) {
    photos = loadedPhotos;
  }

  filtersContainer.classList.remove('img-filters--inactive');

  if (filterButtons.default) {
    filterButtons.default.addEventListener('click', onDefaultClick);
    filterButtons.default.classList.add('img-filters__button--active');
  }

  if (filterButtons.random) {
    filterButtons.random.addEventListener('click', onRandomClick);
  }

  if (filterButtons.discussed) {
    filterButtons.discussed.addEventListener('click', onDiscussedClick);
  }
};

export { initFilters, setActiveButton };
