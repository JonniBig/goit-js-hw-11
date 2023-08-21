import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';
import { createMarkup } from './js/markup';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '38920750-ce35b8fd2527c3f11d87386ea';

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
    Notify.info(`Hooray! We found ${response.data.totalHits} images.`);
    updateScreen(response);

    e.target.elements.searchQuery.value = '';
  } catch (error) {
    console.log(error);
  }
}

async function getPhotos(request, page = 1) {
  try {
    const response = await axios.get(`${BASE_URL}?key=${API_KEY}`, {
      params: {
        q: request,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page: page,
        per_page: '40',
      },
    });

    return response;
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
