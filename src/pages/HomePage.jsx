import { useMemo, useState } from 'react';
import { useEffect } from 'react';
import { getShows } from '../api/podcasts';
import ShowCard from '../components/ShowCard';
import RecommendedCarousel from '../components/RecommendedCarousel';
import { ALL_GENRES } from '../constants/genres';

function HomePage() {
  const [shows, setShows] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [genreFilter, setGenreFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadShows() {
      try {
        setIsLoading(true);
        const allShows = await getShows();

        if (isMounted) {
          setShows(allShows);
          setErrorMessage('');
        }
      } catch {
        if (isMounted) {
          setErrorMessage('Unable to load shows right now.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadShows();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredShows = useMemo(() => {
    const loweredSearch = searchValue.trim().toLowerCase();

    return [...shows]
      .filter((show) => {
        const matchesSearch =
          loweredSearch.length === 0 ||
          show.title.toLowerCase().includes(loweredSearch) ||
          show.description.toLowerCase().includes(loweredSearch);

        const matchesGenre =
          genreFilter === 'all' || show.genres.includes(Number(genreFilter));

        return matchesSearch && matchesGenre;
      })
      .sort((a, b) => {
        if (sortBy === 'az') {
          return a.title.localeCompare(b.title);
        }

        if (sortBy === 'za') {
          return b.title.localeCompare(a.title);
        }

        if (sortBy === 'oldest') {
          return new Date(a.updated) - new Date(b.updated);
        }

        return new Date(b.updated) - new Date(a.updated);
      });
  }, [shows, searchValue, genreFilter, sortBy]);

  return (
    <section className="page-wrap">
      <div className="section-headline home-intro">
        <div>
          <p className="eyebrow">Discover your next listen</p>
          <h2>Explore podcasts with smooth listening across every page.</h2>
        </div>
      </div>

      <RecommendedCarousel shows={shows} />

      <section className="controls-panel" aria-label="Filter podcasts">
        <label>
          Search
          <input
            type="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Find by title or description"
          />
        </label>

        <label>
          Genre
          <select value={genreFilter} onChange={(event) => setGenreFilter(event.target.value)}>
            <option value="all">All genres</option>
            {Object.entries(ALL_GENRES).map(([id, genre]) => (
              <option key={id} value={id}>
                {genre}
              </option>
            ))}
          </select>
        </label>

        <label>
          Sort
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="newest">Newest updated</option>
            <option value="oldest">Oldest updated</option>
            <option value="az">A to Z</option>
            <option value="za">Z to A</option>
          </select>
        </label>
      </section>

      {isLoading && <p className="status-message">Loading shows...</p>}
      {errorMessage && <p className="status-message error">{errorMessage}</p>}

      {!isLoading && !errorMessage && (
        <section className="show-grid" aria-live="polite">
          {filteredShows.length > 0 ? (
            filteredShows.map((show) => <ShowCard key={show.id} show={show} />)
          ) : (
            <p className="status-message">No shows match those filters.</p>
          )}
        </section>
      )}
    </section>
  );
}

export default HomePage;
