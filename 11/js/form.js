import Pristine from '/vendor/pristine/pristine.min.js';
import { initImageEditor, resetImageEditor } from './image-editor.js';
import { sendData } from './api.js';

const uploadForm = document.querySelector('.img-upload__form');
const uploadOverlay = document.querySelector('.img-upload__overlay');
const uploadInput = document.querySelector('#upload-file');
const uploadCancel = document.querySelector('#upload-cancel');
const uploadSubmit = document.querySelector('#upload-submit');
const hashtagsInput = uploadForm.querySelector('.text__hashtags');
const descriptionInput = uploadForm.querySelector('.text__description');
const body = document.querySelector('body');
const successTemplate = document.querySelector('#success').content.querySelector('.success');
const errorTemplate = document.querySelector('#error').content.querySelector('.error');

// Создаем экземпляр Pristine для валидации
const pristine = new Pristine(uploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__field-wrapper--error'
});

// Валидация хэш-тегов
const validateHashtags = (value) => {
  if (value === '') {
    return true;
  }

  const hashtags = value.trim().toLowerCase().split(/\s+/);

  if (hashtags.length > 5) {
    return false;
  }

  const hashtagRegex = /^#[a-zа-яё0-9]{1,19}$/i;

  for (let i = 0; i < hashtags.length; i++) {
    const hashtag = hashtags[i];

    if (!hashtagRegex.test(hashtag)) {
      return false;
    }

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
const validateDescription = (value) => value.length <= 140;

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

// Блокировка/разблокировка кнопки отправки
const blockSubmitButton = () => {
  uploadSubmit.disabled = true;
  uploadSubmit.textContent = 'Публикую...';
};

const unblockSubmitButton = () => {
  uploadSubmit.disabled = false;
  uploadSubmit.textContent = 'Опубликовать';
};

// Показ сообщений
const showMessage = (template, closeCallback) => {
  const message = template.cloneNode(true);
  const button = message.querySelector('button');

  // Объявляем все функции ДО их использования
  const closeMessage = () => {
    message.remove();
    document.removeEventListener('click', onMessageClick);
    document.removeEventListener('keydown', onMessageKeydown);
    if (closeCallback) {
      closeCallback();
    }
  };

  function onMessageClick(evt) {
    if (!evt.target.closest('.success__inner') && !evt.target.closest('.error__inner')) {
      closeMessage();
    }
  }

  function onMessageKeydown(evt) {
    if (evt.key === 'Escape') {
      closeMessage();
    }
  }

  button.addEventListener('click', closeMessage);
  document.addEventListener('click', onMessageClick);
  document.addEventListener('keydown', onMessageKeydown);

  document.body.appendChild(message);
};

// Функция закрытия формы
const closeUploadForm = () => {
  uploadOverlay.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);

  // Сбрасываем форму, валидацию и редактор изображения
  uploadForm.reset();
  pristine.reset();
  resetImageEditor();
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

// Обработчик кнопки отмена
uploadCancel.addEventListener('click', closeUploadForm);

// Обработчик отправки формы
const onFormSubmit = (evt) => {
  evt.preventDefault();

  const isValid = pristine.validate();

  if (!isValid) {
    return;
  }

  blockSubmitButton();

  const formData = new FormData(evt.target);

  sendData(formData)
    .then(() => {
      closeUploadForm();
      showMessage(successTemplate);
    })
    .catch(() => {
      showMessage(errorTemplate, () => {
        unblockSubmitButton();
      });
    })
    .finally(() => {
      unblockSubmitButton();
    });
};

uploadForm.addEventListener('submit', onFormSubmit);

// Инициализация редактора изображения при загрузке модуля
initImageEditor();

export { closeUploadForm };
