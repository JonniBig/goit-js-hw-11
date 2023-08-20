export function createMarkup(array) {
  return array
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
<div class="photo-card">
  <a href="${largeImageURL}">
    <img class='gallery-img' src="${webformatURL}" alt="${tags}" loading="lazy" />
  </a>
  <div class="info">
<p class="info-item" title="Likes">&#x1F44D; ${likes}</p>
<p class="info-item" title="Views">&#x1F4C8; ${views}</p>
<p class="info-item" title="Comments">&#x1F4AC; ${comments}</p>
<p class="info-item" title="Downloads">&#x1F4E5; ${downloads}</p>

  </div>
</div>`
    )
    .join('');
}
