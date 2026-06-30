import { MoonStar, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      type="button"
      aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
    >
      {isLight ? <MoonStar size={18} /> : <Sun size={18} />}
      <span>{isLight ? 'Dark' : 'Light'} mode</span>
    </button>
  );
}

export default ThemeToggle;
