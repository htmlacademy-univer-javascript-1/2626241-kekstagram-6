import { isEscapeKey } from './util.js';
import { sendData } from './api.js';

const uploadForm = document.querySelector('.img-upload__form');
const uploadOverlay = document.querySelector('.img-upload__overlay');
const uploadInput = document.querySelector('#upload-file');
const uploadCancel = document.querySelector('#upload-cancel');
const uploadSubmit = document.querySelector('#upload-submit');
const hashtagsInput = uploadForm.querySelector('.text__hashtags');
const descriptionInput = uploadForm.querySelector('.text__description');
const body = document.querySelector('body');

let pristine = null;

const initPristine = () => {
  if (typeof Pristine === 'undefined') {
    return null;
  }

  if (pristine) {
    pristine.destroy();
  }

  const pristineConfig = {
    classTo: 'img-upload__field-wrapper',
    errorClass: 'img-upload__field-wrapper--invalid',
    successClass: 'img-upload__field-wrapper--valid',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextTag: 'div',
    errorTextClass: 'img-upload__error'
  };

  pristine = new Pristine(uploadForm, pristineConfig);

  const validateHashtags = (value) => {
    if (value.trim() === '') {
      return true;
    }

    const hashtags = value.trim().split(/\s+/).filter((tag) => tag !== '');

    if (hashtags.length > 5) {
      return false;
    }

    const hashtagRegex = /^#[a-zа-яё0-9]{1,19}$/i;
    const seen = new Set();

    for (const tag of hashtags) {
      if (!hashtagRegex.test(tag)) {
        return false;
      }

      const lowerTag = tag.toLowerCase();
      if (seen.has(lowerTag)) {
        return false;
      }
      seen.add(lowerTag);
    }

    return true;
  };

  const getHashtagErrorMessage = (value) => {
    if (value.trim() === '') {
      return '';
    }

    const hashtags = value.trim().split(/\s+/).filter((tag) => tag !== '');

    if (hashtags.length > 5) {
      return 'Не более 5 хэш-тегов';
    }

    const hashtagRegex = /^#[a-zа-яё0-9]{1,19}$/i;
    const seen = new Set();

    for (const tag of hashtags) {
      if (!tag.startsWith('#')) {
        return 'Хэш-тег должен начинаться с #';
      }
      if (tag === '#') {
        return 'Хэш-тег не может состоять только из #';
      }
      if (tag.length > 20) {
        return 'Максимальная длина хэш-тега - 20 символов';
      }
      if (!hashtagRegex.test(tag)) {
        return 'Хэш-тег содержит недопустимые символы';
      }

      const lowerTag = tag.toLowerCase();
      if (seen.has(lowerTag)) {
        return 'Хэш-теги не должны повторяться';
      }
      seen.add(lowerTag);
    }
    return '';
  };

  pristine.addValidator(hashtagsInput, validateHashtags, getHashtagErrorMessage, 1, false);

  const validateDescription = (value) => value.length <= 140;

  const getDescriptionErrorMessage = () => 'Комментарий не может быть длиннее 140 символов';

  pristine.addValidator(descriptionInput, validateDescription, getDescriptionErrorMessage, 2, false);

  return pristine;
};

const showMessage = (template) => {
  const message = template.cloneNode(true);
  const button = message.querySelector('button');
  const inner = message.querySelector('div');

  const closeMessage = () => {
    message.remove();
    document.removeEventListener('click', onDocumentClick);
    document.removeEventListener('keydown', onMessageKeydown);
  };

  function onDocumentClick(evt) {
    if (!inner.contains(evt.target)) {
      closeMessage();
    }
  }

  function onMessageKeydown(evt) {
    if (isEscapeKey(evt)) {
      evt.stopPropagation();
      closeMessage();
    }
  }

  button.addEventListener('click', closeMessage);
  document.addEventListener('click', onDocumentClick);
  document.addEventListener('keydown', onMessageKeydown);

  document.body.appendChild(message);
};

const hideModal = () => {
  uploadForm.reset();

  if (window.imageEditor && window.imageEditor.resetImageEditor) {
    window.imageEditor.resetImageEditor();
  }

  if (pristine) {
    pristine.reset();
  }

  uploadOverlay.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);

  uploadSubmit.disabled = false;
  uploadSubmit.textContent = 'Опубликовать';
};

function onDocumentKeydown(evt) {
  if (isEscapeKey(evt)) {
    if (document.activeElement === hashtagsInput ||
        document.activeElement === descriptionInput ||
        document.querySelector('.error')) {
      return;
    }
    evt.preventDefault();
    hideModal();
  }
}

const showModal = () => {
  uploadOverlay.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);

  initPristine();

  if (window.imageEditor && window.imageEditor.updateScale) {
    window.imageEditor.updateScale(100);
  }
};

uploadInput.addEventListener('change', () => {
  if (uploadInput.files.length > 0) {
    showModal();
    if (window.imageUpload && window.imageUpload.loadUserImage) {
      window.imageUpload.loadUserImage();
    }
  }
});

uploadCancel.addEventListener('click', hideModal);

hashtagsInput.addEventListener('keydown', (evt) => {
  if (isEscapeKey(evt)) {
    evt.stopPropagation();
  }
});

descriptionInput.addEventListener('keydown', (evt) => {
  if (isEscapeKey(evt)) {
    evt.stopPropagation();
  }
});

const handleFormSubmit = async (evt) => {
  evt.preventDefault();

  if (!pristine) {
    return;
  }

  const isValid = pristine.validate(true);

  if (!isValid) {
    return;
  }

  uploadSubmit.disabled = true;
  uploadSubmit.textContent = 'Публикую...';

  try {
    const formData = new FormData(uploadForm);

    await sendData(formData);
    hideModal();
    const successTemplate = document.querySelector('#success').content.querySelector('.success');
    showMessage(successTemplate);
  } catch (error) {
    const errorTemplate = document.querySelector('#error').content.querySelector('.error');
    showMessage(errorTemplate);
    setTimeout(() => {
      uploadSubmit.disabled = false;
      uploadSubmit.textContent = 'Опубликовать';
    }, 500);
  }
};

uploadForm.addEventListener('submit', handleFormSubmit);

export { hideModal, showModal };
