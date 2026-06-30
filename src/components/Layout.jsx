import { Outlet } from 'react-router-dom';
import Header from './Header';
import AudioPlayerBar from './AudioPlayerBar';

function Layout() {
  return (
    <div className="app-shell">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <AudioPlayerBar />
    </div>
  );
}

export default Layout;
