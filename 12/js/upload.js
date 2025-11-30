import { isEscapeKey } from './util.js';

export const initUploadForm = () => {
  const uploadForm = document.querySelector('.img-upload__form');
  const uploadOverlay = document.querySelector('.img-upload__overlay');

  const closeUploadForm = () => {
    uploadOverlay.classList.add('hidden');
    document.removeEventListener('keydown', onDocumentKeydown);
    uploadForm.reset();
  };

  const openUploadForm = () => {
    uploadOverlay.classList.remove('hidden');
    document.addEventListener('keydown', onDocumentKeydown);
  };

  // Function declaration - можно использовать до определения
  function onDocumentKeydown(evt) {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      closeUploadForm();
    }
  }

  document.querySelector('#upload-file').addEventListener('change', openUploadForm);
  document.querySelector('#upload-cancel').addEventListener('click', closeUploadForm);

  return { openUploadForm, closeUploadForm };
};
