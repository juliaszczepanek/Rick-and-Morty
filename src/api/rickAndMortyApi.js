const BASE_URL = "https://rickandmortyapi.com/api";

export const fetchCharacters = async (page = 1, species = "", status = "", gender = "") => {
  try {
    let url = `${BASE_URL}/character/?page=${page}`;

    if (species) url += `&species=${species}`;
    if (status) url += `&status=${status}`;
    if (gender) url += `&gender=${gender}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Error occurs while fetching characters");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error while fetching characters", error);
    throw error;
  }
};

export const fetchEpisodes = async (page = 1, query = "") => {
  try {
    let url = `${BASE_URL}/episode/?page=${page}`;
    if (query) {
      url += `&name=${encodeURIComponent(query)}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Error occurs while fetching episodes");
    }
    const data = await response.json();
    return data;
  } catch (er) {
    console.error("Error while fetching episodes", er);
    throw error;
  }
};

export const fetchEpisodesGraphQl = (page = 1, searchQuery = "") => {
  const BASE_URL_GRAPHQL = "https://rickandmortyapi.com/graphql";

  const query = `
  query  ($page: Int, $filter: FilterEpisode){
    episodes(page: $page, filter: $filter) {
      info {
        pages
      }
      results {
        id
        name
        air_date
        episode
        characters {
          name
        }
      }
    }
  }
`;

  const variables = {
    page: page,
    filter: { name: searchQuery },
  };

  return fetch(`${BASE_URL_GRAPHQL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  })
    .then((response) => response.json())
    .catch((error) => console.error(error));
};

export const fetchLocations = async (page = 1, name = "", type = "", dimension = "") => {
  try {
    let url = `${BASE_URL}/location/?page=${page}`;

    if (name) url += `&name=${encodeURIComponent(name)}`;
    if (type) url += `&type=${encodeURIComponent(type)}`;
    if (dimension) url += `&dimension=${encodeURIComponent(dimension)}`;

    const response = await fetch(url);

    if (response.status === 404) {
      return {
        results: [],
        info: {
          pages: 1,
          count: 0,
        },
      };
    }
    if (!response.ok) {
      throw new Error("Error occurs while fetching locations");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error while fetching locations", error);
    throw error;
  }
};
