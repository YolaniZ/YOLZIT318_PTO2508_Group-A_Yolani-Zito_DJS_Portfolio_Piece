import { Link } from 'react-router-dom';
import { genreNameById } from '../constants/genres';

function ShowCard({ show }) {
  const updatedAt = new Date(show.updated).toLocaleDateString();

  return (
    <article className="show-card">
      <Link to={`/show/${show.id}`}>
        <img src={show.image} alt={show.title} className="show-cover" />
      </Link>

      <div className="show-body">
        <h3>{show.title}</h3>
        <p>{show.description.slice(0, 120)}...</p>

        <div className="tag-list">
          {show.genres.slice(0, 3).map((genreId) => (
            <span key={genreId}>{genreNameById(genreId)}</span>
          ))}
        </div>

        <div className="show-meta">
          <span>{show.seasons} seasons</span>
          <span>Updated {updatedAt}</span>
        </div>
      </div>
    </article>
  );
}

export default ShowCard;
