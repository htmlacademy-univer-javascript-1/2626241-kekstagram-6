import { photos } from './thumbnail.js';
import { renderThumbnails } from './thumbnail.js';

const filtersContainer = document.querySelector('.img-filters');
const filtersForm = document.querySelector('.img-filters__form');
const filterButtons = filtersForm.querySelectorAll('.img-filters__button');

const FilterType = {
  DEFAULT: 'filter-default',
  RANDOM: 'filter-random',
  DISCUSSED: 'filter-discussed'
};

// Функции фильтрации
const filterDefault = () => photos;

const filterRandom = () => {
  const shuffled = [...photos].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 10);
};

const filterDiscussed = () => [...photos].sort((a, b) => b.comments.length - a.comments.length);

const filterFunctions = {
  [FilterType.DEFAULT]: filterDefault,
  [FilterType.RANDOM]: filterRandom,
  [FilterType.DISCUSSED]: filterDiscussed
};

// Устранение дребезга
const debounce = (callback, timeoutDelay = 500) => {
  let timeoutId;
  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
};

// Обработчик изменения фильтра
const onFilterChange = (evt) => {
  if (!evt.target.classList.contains('img-filters__button')) {
    return;
  }

  // Убираем активный класс у всех кнопок
  filterButtons.forEach((button) => {
    button.classList.remove('img-filters__button--active');
  });

  // Добавляем активный класс текущей кнопке
  evt.target.classList.add('img-filters__button--active');

  const filterType = evt.target.id;
  const filteredPhotos = filterFunctions[filterType]();
  renderThumbnails(filteredPhotos);
};

// Инициализация фильтров
const initFilters = () => {
  // Показываем блок фильтров
  filtersContainer.classList.remove('img-filters--inactive');

  // Добавляем обработчик с устранением дребезга
  filtersForm.addEventListener('click', debounce(onFilterChange));
};

export { initFilters };
