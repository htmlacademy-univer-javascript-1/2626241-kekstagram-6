const FILE_TYPES = ['jpg', 'jpeg', 'png'];

const uploadInput = document.querySelector('#upload-file');
const uploadPreview = document.querySelector('.img-upload__preview img');
const effectsPreviews = document.querySelectorAll('.effects__preview');

// Функция для загрузки и отображения изображения
const loadUserImage = () => {
  const file = uploadInput.files[0];
  const fileName = file.name.toLowerCase();

  const matches = FILE_TYPES.some((it) => fileName.endsWith(it));

  if (!matches) {
    return;
  }

  const reader = new FileReader();

  reader.addEventListener('load', () => {
    const result = reader.result;

    // Устанавливаем изображение в основное превью
    uploadPreview.src = result;

    // Устанавливаем изображение во все превью эффектов
    effectsPreviews.forEach((preview) => {
      preview.style.backgroundImage = `url(${result})`;
    });
  });

  reader.readAsDataURL(file);
};

// Обработчик изменения файла
const onFileInputChange = () => {
  if (uploadInput.files.length > 0) {
    loadUserImage();
  }
};

// Инициализация загрузки изображения
const initImageUpload = () => {
  uploadInput.addEventListener('change', onFileInputChange);
};

export { initImageUpload };
