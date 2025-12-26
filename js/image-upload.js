const FILE_TYPES = ['jpg', 'jpeg', 'png'];

const uploadInput = document.querySelector('#upload-file');
const uploadPreview = document.querySelector('.img-upload__preview img');
const effectsPreviews = document.querySelectorAll('.effects__preview');

const loadUserImage = () => {
  const file = uploadInput.files[0];
  if (!file) {
    return;
  }

  const fileName = file.name.toLowerCase();
  const matches = FILE_TYPES.some((it) => fileName.endsWith(it));

  if (!matches) {
    return;
  }

  const blobUrl = URL.createObjectURL(file);

  uploadPreview.src = blobUrl;

  effectsPreviews.forEach((preview) => {
    preview.style.backgroundImage = `url(${blobUrl})`;
  });

  if (window.imageUpload && window.imageUpload.currentBlobUrl) {
    URL.revokeObjectURL(window.imageUpload.currentBlobUrl);
  }
  window.imageUpload.currentBlobUrl = blobUrl;
};

const onFileInputChange = () => {
  if (uploadInput.files.length > 0) {
    loadUserImage();
  }
};

const initImageUpload = () => {
  uploadInput.addEventListener('change', onFileInputChange);
};

const cleanupBlobUrl = () => {
  if (window.imageUpload && window.imageUpload.currentBlobUrl) {
    URL.revokeObjectURL(window.imageUpload.currentBlobUrl);
    window.imageUpload.currentBlobUrl = null;
  }
};

export { initImageUpload, loadUserImage, cleanupBlobUrl };
