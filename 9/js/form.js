import Pristine from '/vendor/pristine/pristine.min.js';

const uploadForm = document.querySelector('.img-upload__form');
const uploadOverlay = document.querySelector('.img-upload__overlay');
const uploadInput = document.querySelector('#upload-file');
const uploadCancel = document.querySelector('#upload-cancel');
const hashtagsInput = uploadForm.querySelector('.text__hashtags');
const descriptionInput = uploadForm.querySelector('.text__description');
const body = document.querySelector('body');

// Создаем экземпляр Pristine для валидации
const pristine = new Pristine(uploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__field-wrapper--error'
});

// Валидация хэш-тегов
const validateHashtags = (value) => {
  if (value === '') {
    return true; // хэш-теги не обязательны
  }

  const hashtags = value.trim().toLowerCase().split(/\s+/);
  
  // Проверка на максимальное количество хэш-тегов
  if (hashtags.length > 5) {
    return false;
  }

  const hashtagRegex = /^#[a-zа-яё0-9]{1,19}$/i;

  for (let i = 0; i < hashtags.length; i++) {
    const hashtag = hashtags[i];
    
    // Проверка формата хэш-тега
    if (!hashtagRegex.test(hashtag)) {
      return false;
    }
    
    // Проверка на повторяющиеся хэш-теги
    if (hashtags.indexOf(hashtag) !== i) {
      return false;
    }
  }

  return true;
};

// Сообщения об ошибках для хэш-тегов
const getHashtagErrorMessage = (value) => {
  if (value === '') {
    return '';
  }

  const hashtags = value.trim().toLowerCase().split(/\s+/);
  
  if (hashtags.length > 5) {
    return 'Нельзя указать больше пяти хэш-тегов';
  }

  const hashtagRegex = /^#[a-zа-яё0-9]{1,19}$/i;

  for (let i = 0; i < hashtags.length; i++) {
    const hashtag = hashtags[i];
    
    if (!hashtagRegex.test(hashtag)) {
      if (hashtag[0] !== '#') {
        return 'Хэш-тег должен начинаться с символа #';
      }
      if (hashtag === '#') {
        return 'Хэш-тег не может состоять только из одной решётки';
      }
      if (hashtag.length > 20) {
        return 'Максимальная длина хэш-тега 20 символов';
      }
      return 'Хэш-тег содержит недопустимые символы';
    }
    
    if (hashtags.indexOf(hashtag) !== i) {
      return 'Один и тот же хэш-тег не может быть использован дважды';
    }
  }

  return '';
};

// Валидация комментария
const validateDescription = (value) => {
  return value.length <= 140;
};

// Добавляем валидаторы к Pristine
pristine.addValidator(
  hashtagsInput,
  validateHashtags,
  getHashtagErrorMessage
);

pristine.addValidator(
  descriptionInput,
  validateDescription,
  'Длина комментария не может составлять больше 140 символов'
);

// Функция закрытия формы
const closeUploadForm = () => {
  uploadOverlay.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
  
  // Сбрасываем форму и валидацию
  uploadForm.reset();
  pristine.reset();
};

// Обработчик клавиши Esc
function onDocumentKeydown(evt) {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    
    // Не закрываем форму, если фокус в полях ввода
    if (document.activeElement === hashtagsInput || document.activeElement === descriptionInput) {
      return;
    }
    
    closeUploadForm();
  }
}

// Обработчики для предотвращения закрытия формы при фокусе в полях
hashtagsInput.addEventListener('keydown', (evt) => {
  evt.stopPropagation();
});

descriptionInput.addEventListener('keydown', (evt) => {
  evt.stopPropagation();
});

// Функция открытия формы
const openUploadForm = () => {
  uploadOverlay.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
};

// Обработчик выбора файла
uploadInput.addEventListener('change', openUploadForm);

// Обработчик кнопки отмены
uploadCancel.addEventListener('click', closeUploadForm);

// Обработчик отправки формы
uploadForm.addEventListener('submit', (evt) => {
  const isValid = pristine.validate();
  
  if (!isValid) {
    evt.preventDefault();
  }
});

export { closeUploadForm };