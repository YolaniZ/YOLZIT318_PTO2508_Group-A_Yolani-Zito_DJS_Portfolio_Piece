import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { genreNameById } from '../constants/genres';

function RecommendedCarousel({ shows }) {
  const recommendedShows = useMemo(
    () => [...shows].sort((a, b) => new Date(b.updated) - new Date(a.updated)).slice(0, 8),
    [shows]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % recommendedShows.length);
  };

  const previousSlide = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? recommendedShows.length - 1 : prevIndex - 1
    );
  };

  const handleTouchStart = (event) => {
    setTouchStartX(event.changedTouches[0].screenX);
  };

  const handleTouchEnd = (event) => {
    const swipeDistance = event.changedTouches[0].screenX - touchStartX;

    if (Math.abs(swipeDistance) < 40) {
      return;
    }

    if (swipeDistance > 0) {
      previousSlide();
    } else {
      nextSlide();
    }
  };

  if (recommendedShows.length === 0) {
    return null;
  }

  const activeShow = recommendedShows[activeIndex];

  return (
    <section className="carousel-section">
      <div className="section-headline">
        <h2>Recommended right now</h2>
        <div className="carousel-controls">
          <button type="button" className="icon-button" onClick={previousSlide} aria-label="Previous">
            <ChevronLeft size={18} />
          </button>
          <button type="button" className="icon-button" onClick={nextSlide} aria-label="Next">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        className="carousel"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        role="region"
        aria-label="Recommended shows carousel"
      >
        <Link to={`/show/${activeShow.id}`} className="carousel-card">
          <img src={activeShow.image} alt={activeShow.title} />
          <div>
            <h3>{activeShow.title}</h3>
            <p>{activeShow.description.slice(0, 100)}...</p>
            <div className="tag-list">
              {activeShow.genres.slice(0, 3).map((genreId) => (
                <span key={genreId}>{genreNameById(genreId)}</span>
              ))}
            </div>
          </div>
        </Link>
      </div>

      <div className="carousel-dots" aria-hidden="true">
        {recommendedShows.map((show, index) => (
          <span key={show.id} className={index === activeIndex ? 'active' : ''} />
        ))}
      </div>
    </section>
  );
}

export default RecommendedCarousel;
