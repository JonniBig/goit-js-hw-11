import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { createMarkup } from './js/markup';
import { getPhotos } from './js/getPhotos';

const gallery = document.querySelector('.gallery');
const searchForm = document.querySelector('.search-form');
const lightbox = new SimpleLightbox('.gallery a', {});

let currentPage = 1;
let loadedPhotosCount = 0;
let requestWord = '';

searchForm.addEventListener('submit', onFormSubmit);
window.addEventListener('scroll', handleScroll);

async function onFormSubmit(e) {
  try {
    e.preventDefault();

    const searchQuery = e.target.elements.searchQuery.value.trim();

    if (searchQuery === '') {
      Notify.warning('Please enter a search query.');
      return;
    }

    gallery.innerHTML = '';
    loadedPhotosCount = 0;
    currentPage = 1;
    requestWord = searchQuery;

    const response = await getPhotos(requestWord, currentPage);

    if (response.data.totalHits === 0) {
      Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );

      e.target.elements.searchQuery.value = '';

      return;
    }

    Notify.info(`Hooray! We found ${response.data.totalHits} images.`);
    updateScreen(response);

    e.target.elements.searchQuery.value = '';
  } catch (error) {
    console.log(error);
  }
}

function updateScreen(response) {
  const hits = response.data.hits;

  loadedPhotosCount += hits.length;

  gallery.insertAdjacentHTML('beforeend', createMarkup(hits));
  lightbox.refresh();
}

function handleScroll() {
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollPosition = window.scrollY;

  const remainingDistance = documentHeight - (windowHeight + scrollPosition);

  if (remainingDistance <= 200) {
    onLoadMore();
  }
}

function onLoadMore() {
  currentPage += 1;
  getPhotos(requestWord, currentPage)
    .then(response => {
      updateScreen(response);

      const { height: cardHeight } = document
        .querySelector('.gallery')
        .lastElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    })
    .catch(error => {
      console.log(error);
    });
}
