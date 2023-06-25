import { getQuery } from '../API/Api';
import { useEffect, useState } from 'react';
import { useSearchParams, NavLink, useLocation } from 'react-router-dom';
import { Notify } from 'notiflix';
Notify.init({ showOnlyTheLastOne: true, clickToClose: true });

const Movies = () => {
  const [movies, setSearchedMovie] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const query = searchParams.get('search');
  const [queryString, setQueryString] = useState(query ? query : '');

  function onInputChange(e) {
    setQueryString(e.target.value);
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setSearchParams(queryString.trim() !== '' ? { search: queryString } : {});

    if (queryString.trim() === '') {
      Notify.warning('Please enter movie title to search');
      setSearchedMovie([]);
    }
  }
  
  useEffect(() => {
    async function getData() {
      try {
        if (!query) return;
        getQuery(query).then(setSearchedMovie);
        
        if (getQuery.data.results.length === 0) Notify.failure('Sorry, this movie not found');
      } finally {
  
      setSearchedMovie(getQuery.data.results);
      }
    }
    getData();
  }, [query]);

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={queryString} onChange={onInputChange} />
      <button type="submit">Search</button>
      {movies.length === 0 && query ? (
        <div>No results. Please try again.</div>
      ) : (
        <ul>
          {movies.map(movie => (
            <li key={movie.id}>
              <NavLink to={`/movies/${movie.id}`} state={{ from: location }}>
                {movie.title}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
};

export default Movies;