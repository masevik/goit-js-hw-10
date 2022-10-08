import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { refs, countryList, countryInfo } from './js/refs';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;
const debouncedOnSearchQuery = debounce(onSearchQuery, DEBOUNCE_DELAY);

refs.input.addEventListener('input', debouncedOnSearchQuery);

function onSearchQuery() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
  const searchQuery = refs.input.value.trim().toLowerCase();

  if (!searchQuery) {
    Notify.warning('Enter country name');
    return;
  }

  fetchCountries(searchQuery).then(onFetchSuccess).catch(onFetchError);
}

function onFetchSuccess(countries) {
  if (countries.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name');
  } else if ((countries.length > 1) & (countries.length < 10)) {
    const markup = createMarkupToTen(countries);
    refs.countryList.insertAdjacentHTML('beforeend', markup);
  } else {
    const markup = createMarkupForOne(countries);
    refs.countryInfo.insertAdjacentHTML('beforeend', markup);
  }
}

function onFetchError(searchQuery) {
  if (searchQuery) {
    Notify.failure('Oops, there is no country with that name');
  }
}

function createMarkupToTen(countries) {
  return countries
    .map(({ flags, name }) => {
      return /*HTML*/ `<li class="country-list__item">
      <img src="${flags.svg}" alt="flag" width="50px"/>
      <p class="country-list__name">${name.common}</p>
      </li>`;
    })
    .join('');
}

function createMarkupForOne(countries) {
  return countries
    .map(({ name, capital, population, flags, languages }) => {
      const languagesList = Object.values(languages).join(', ');

      return /*HTML*/ `<div class="country-info__name-wrap">
      <img src="${flags.svg}" alt="flag of ${name.common}" width="50px"/>
      <p class="country-list__name-one">${name.common}</p>
      </div>
      <p class="country-list__capital"><span class="country-list__span"> Capital: </span>${capital}</p>
      <p class="country-list__population"><span class="country-list__span"> Population: </span>${population}</p>
      <p class="country-list__languages"><span class="country-list__span"> Languages: </span>${languagesList}</p>`;
    })
    .join('');
}
