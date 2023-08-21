import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '38920750-ce35b8fd2527c3f11d87386ea';

export async function getPhotos(request, page = 1) {
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
