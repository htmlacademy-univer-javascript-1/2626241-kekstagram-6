const body = document.querySelector('body');
const bigPicture = document.querySelector('.big-picture');
const bigPictureImg = bigPicture.querySelector('.big-picture__img img');
const likesCount = bigPicture.querySelector('.likes-count');
const commentsCount = bigPicture.querySelector('.comments-count');
const socialComments = bigPicture.querySelector('.social__comments');
const socialCaption = bigPicture.querySelector('.social__caption');
const commentCountBlock = bigPicture.querySelector('.social__comment-count');
const commentsLoader = bigPicture.querySelector('.comments-loader');
const closeButton = bigPicture.querySelector('.big-picture__cancel');

const COMMENTS_PER_PORTION = 5;
let currentComments = [];
let commentsShown = 0;

// Функция для создания одного комментария
const createComment = (comment) => {
  const commentElement = document.createElement('li');
  commentElement.classList.add('social__comment');

  commentElement.innerHTML = `
    <img class="social__picture" src="${comment.avatar}" alt="${comment.name}" width="35" height="35">
    <p class="social__text">${comment.message}</p>
  `;

  return commentElement;
};

// Функция для отрисовки комментариев порциями
const renderComments = () => {
  const commentsPortion = currentComments.slice(commentsShown, commentsShown + COMMENTS_PER_PORTION);
  const fragment = document.createDocumentFragment();

  commentsPortion.forEach((comment) => {
    const commentElement = createComment(comment);
    fragment.appendChild(commentElement);
  });

  socialComments.appendChild(fragment);

  // Обновляем счетчик показанных комментариев
  commentsShown += commentsPortion.length;
  commentCountBlock.innerHTML = `${commentsShown} из <span class="comments-count">${currentComments.length}</span> комментариев`;

  // Скрываем кнопку, если все комментарии показаны
  if (commentsShown >= currentComments.length) {
    commentsLoader.classList.add('hidden');
  } else {
    commentsLoader.classList.remove('hidden');
  }
};

// Обработчик кнопки "Загрузить ещё"
const onCommentsLoaderClick = () => {
  renderComments();
};

// Функция закрытия полноразмерного фото
const closeFullPhoto = () => {
  bigPicture.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
  commentsLoader.removeEventListener('click', onCommentsLoaderClick);

  // Сбрасываем состояние
  currentComments = [];
  commentsShown = 0;
};

// Обработчик клавиши Esc
function onDocumentKeydown(evt) {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeFullPhoto();
  }
}

// Функция открытия полноразмерного фото
const openFullPhoto = (photoData) => {
  // Заполняем данные
  bigPictureImg.src = photoData.url;
  bigPictureImg.alt = photoData.description;
  likesCount.textContent = photoData.likes;
  commentsCount.textContent = photoData.comments.length;
  socialCaption.textContent = photoData.description;

  // Сохраняем комментарии и сбрасываем счетчик
  currentComments = photoData.comments;
  commentsShown = 0;
  socialComments.innerHTML = '';

  // Показываем блоки с комментариями (убираем hidden)
  commentCountBlock.classList.remove('hidden');
  commentsLoader.classList.remove('hidden');

  // Отрисовываем первую порцию комментариев
  renderComments();

  // Показываем окно
  bigPicture.classList.remove('hidden');
  body.classList.add('modal-open');

  // Добавляем обработчики
  document.addEventListener('keydown', onDocumentKeydown);
  closeButton.addEventListener('click', closeFullPhoto);
  commentsLoader.addEventListener('click', onCommentsLoaderClick);
};

export { openFullPhoto };
