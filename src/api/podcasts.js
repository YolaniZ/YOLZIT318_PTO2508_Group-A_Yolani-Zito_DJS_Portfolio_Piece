const API_BASE_URL = 'https://podcast-api.netlify.app';

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

export function getShows() {
  return fetchJson(`${API_BASE_URL}`);
}

export function getShowById(showId) {
  return fetchJson(`${API_BASE_URL}/id/${showId}`);
}
