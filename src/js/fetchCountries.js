export function fetchCountries(searchQuery) {
  const END_POINT = 'https://restcountries.com/v3.1/name';
  const options = 'fields=name,capital,population,flags,languages';

  return fetch(`${END_POINT}/${searchQuery}?${options}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
