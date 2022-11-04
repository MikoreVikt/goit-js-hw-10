import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const getEl = selector => document.querySelector(selector);
getEl(`#search-box`).addEventListener(
  `input`,
  debounce(onInput, DEBOUNCE_DELAY)
);

function onInput(evt) {
  const countryName = evt.target.value.trim();
  if (!countryName) {
    getEl(`.country-list`).innerHTML = '';
    getEl(`.country-info`).innerHTML = '';
    return;
  }

  fetchCountries(countryName)
    .then(createMarkup)
    .catch(() =>
      Notiflix.Notify.failure('Oops, there is no country with that name')
    );
}

function createMarkup(data) {
  if (data.length > 10) {
    return Notiflix.Notify.warning(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (data.length > 2 && data.length < 10) {
    getEl(`.country-info`).innerHTML = '';
    getEl(`.country-list`).innerHTML = data
      .map(item => {
        return `<li class="country-list__item"><img src="${item.flags.svg}"></img><span class="country-list__text">${item.name.official}</span></li>`;
      })
      .join('');
  } else {
    getEl(`.country-list`).innerHTML = '';
    getEl(`.country-info`).innerHTML = `
    <li class="country-info__item"><img src="${
      data[0].flags.svg
    }"></img><span class="country-info__Name">${
      data[0].name.official
    }</span></li>
    <p>Capital: <span class="country-info__text">${data[0].capital}</span></p>
    <p>population: <span class="country-info__text">${
      data[0].population
    }</span></p>
    <p>languages: <span class="country-info__text">${Object.values(
      data[0].languages
    )}</span></p>`;
  }
}
