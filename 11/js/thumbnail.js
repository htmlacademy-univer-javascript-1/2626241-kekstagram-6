import { getData } from './api.js';
import { openFullPhoto } from './full-photo.js';

const picturesContainer = document.querySelector('.pictures');
const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');

let photos = [];

// Функция для отрисовки миниатюр
const renderThumbnails = (data) => {
  photos = data;

  const fragment = document.createDocumentFragment();

  photos.forEach((photo) => {
    const thumbnail = pictureTemplate.cloneNode(true);
    const image = thumbnail.querySelector('.picture__img');
    const likes = thumbnail.querySelector('.picture__likes');
    const comments = thumbnail.querySelector('.picture__comments');

    image.src = photo.url;
    image.alt = photo.description;
    likes.textContent = photo.likes;
    comments.textContent = photo.comments.length;

    // Добавляем обработчик клика на миниатюру
    thumbnail.addEventListener('click', (evt) => {
      evt.preventDefault();
      openFullPhoto(photo);
    });

    fragment.appendChild(thumbnail);
  });

  // Очищаем контейнер и добавляем новые миниатюры
  const existingThumbnails = picturesContainer.querySelectorAll('.picture');
  existingThumbnails.forEach((thumbnail) => thumbnail.remove());

  picturesContainer.appendChild(fragment);
};

// Функция для загрузки и отрисовки данных
const loadAndRenderThumbnails = () => {
  getData()
    .then((data) => {
      renderThumbnails(data);
    })
    .catch((error) => {
      // Показываем сообщение об ошибке
      const errorMessage = document.createElement('div');
      errorMessage.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #ff4d4d;
        color: white;
        padding: 20px;
        border-radius: 5px;
        text-align: center;
        z-index: 1000;
      `;
      errorMessage.textContent = error.message;
      document.body.appendChild(errorMessage);

      // Убираем сообщение через 5 секунд
      setTimeout(() => {
        errorMessage.remove();
      }, 5000);
    });
};

export { loadAndRenderThumbnails, photos };
