import { generatePhotos } from './data.js';

export const initFilters = () => {
  const photos = generatePhotos();

  const filterDefault = () => photos;
  const filterRandom = () => [...photos].sort(() => Math.random() - 0.5).slice(0, 10);
  const filterDiscussed = () => [...photos].sort((a, b) => b.comments.length - a.comments.length);

  return { filterDefault, filterRandom, filterDiscussed };
};
