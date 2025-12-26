import { getData } from './api.js';
import { initFilters } from './filters.js';
import { openFullPhoto } from './full-photo.js';

const picturesContainer = document.querySelector('.pictures');
const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
const filtersContainer = document.querySelector('.img-filters');

let photos = [];

const renderThumbnails = (data = photos) => {
  const fragment = document.createDocumentFragment();

  const existingThumbnails = picturesContainer.querySelectorAll('.picture');
  existingThumbnails.forEach((thumbnail) => thumbnail.remove());

  data.forEach((photo) => {
    const thumbnail = pictureTemplate.cloneNode(true);
    const image = thumbnail.querySelector('.picture__img');
    const likes = thumbnail.querySelector('.picture__likes');
    const comments = thumbnail.querySelector('.picture__comments');

    image.src = photo.url;
    image.alt = photo.description;
    likes.textContent = photo.likes;
    comments.textContent = photo.comments.length;

    thumbnail.dataset.id = photo.id;

    thumbnail.addEventListener('click', (evt) => {
      evt.preventDefault();
      openFullPhoto(photo);
    });

    fragment.appendChild(thumbnail);
  });

  picturesContainer.appendChild(fragment);
};

const loadAndRenderThumbnails = () => getData()
  .then((data) => {
    photos = data;
    renderThumbnails(photos);

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
    if (filtersContainer) {
      filtersContainer.classList.add('img-filters--inactive');
    }
    throw new Error('Failed to load photos');
  });

export { loadAndRenderThumbnails, photos, renderThumbnails };
