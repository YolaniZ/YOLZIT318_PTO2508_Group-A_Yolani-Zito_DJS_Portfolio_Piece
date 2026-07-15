import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getShowById } from '../api/podcasts';
import EpisodeCard from '../components/EpisodeCard';
import { genreNameById } from '../constants/genres';

function ShowPage() {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadShow() {
      try {
        setIsLoading(true);
        const showDetail = await getShowById(id);

        if (isMounted) {
          setShow(showDetail);
          setSelectedSeason(1);
          setErrorMessage('');
        }
      } catch {
        if (isMounted) {
          setErrorMessage('Unable to load this show.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadShow();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const seasonData = useMemo(() => {
    if (!show) {
      return null;
    }

    const seasons = Array.isArray(show.seasons) ? show.seasons : [];
    return seasons.find((season) => season.season === selectedSeason) || seasons[0] || null;
  }, [show, selectedSeason]);

  const episodes = Array.isArray(seasonData?.episodes) ? seasonData.episodes : [];
  const genres = Array.isArray(show?.genres) ? show.genres : [];

  if (isLoading) {
    return <p className="status-message">Loading show details...</p>;
  }

  if (errorMessage || !show) {
    return (
      <section className="page-wrap">
        <p className="status-message error">{errorMessage || 'Show not found.'}</p>
        <Link to="/" className="text-link">
          Return to home
        </Link>
      </section>
    );
  }

  return (
    <section className="page-wrap">
      <article className="show-hero">
        <img src={show.image} alt={show.title} />
        <div>
          <p className="eyebrow">Show details</p>
          <h2>{show.title}</h2>
          <p>{show.description}</p>
          <div className="tag-list">
            {genres.map((genreId) => (
              <span key={genreId}>{genreNameById(genreId)}</span>
            ))}
          </div>
        </div>
      </article>

      <section className="season-panel">
        <h3>Seasons</h3>
        <div className="season-buttons">
          {(Array.isArray(show.seasons) ? show.seasons : []).map((season) => (
            <button
              key={season.season}
              type="button"
              className={selectedSeason === season.season ? 'active' : ''}
              onClick={() => setSelectedSeason(season.season)}
            >
              Season {season.season}
            </button>
          ))}
        </div>
      </section>

      <section className="episodes-list">
        <h3>{seasonData?.title || `Season ${selectedSeason}`}</h3>
        {episodes.map((episode) => (
          <EpisodeCard
            key={episode.episode}
            show={show}
            seasonNumber={selectedSeason}
            episode={episode}
          />
        ))}
        {episodes.length === 0 && <p className="status-message">No episodes available for this season.</p>}
      </section>
    </section>
  );
}

export default ShowPage;
