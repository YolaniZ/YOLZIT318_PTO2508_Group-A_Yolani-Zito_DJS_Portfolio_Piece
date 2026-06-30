import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <section className="page-wrap not-found">
      <p className="eyebrow">404</p>
      <h2>That page drifted off the dial.</h2>
      <p>Try heading back to the home page to keep listening.</p>
      <Link to="/" className="text-link">
        Go home
      </Link>
    </section>
  );
}

export default NotFoundPage;
