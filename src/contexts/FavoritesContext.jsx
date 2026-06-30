import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { readFromStorage, writeToStorage } from '../utils/storage';

const FavoritesContext = createContext(null);
const FAVORITES_STORAGE_KEY = 'djs_favourites';

export function FavoritesProvider({ children }) {
  const [favouritesById, setFavouritesById] = useState(() =>
    readFromStorage(FAVORITES_STORAGE_KEY, {})
  );

  useEffect(() => {
    writeToStorage(FAVORITES_STORAGE_KEY, favouritesById);
  }, [favouritesById]);

  const value = useMemo(() => {
    const allFavourites = Object.values(favouritesById);

    return {
      favouritesById,
      allFavourites,
      isFavourite: (episodeId) => Boolean(favouritesById[episodeId]),
      toggleFavourite: (favouriteItem) => {
        setFavouritesById((current) => {
          const next = { ...current };

          if (next[favouriteItem.episodeId]) {
            delete next[favouriteItem.episodeId];
          } else {
            next[favouriteItem.episodeId] = {
              ...favouriteItem,
              addedAt: new Date().toISOString()
            };
          }

          return next;
        });
      }
    };
  }, [favouritesById]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error('useFavorites must be used inside FavoritesProvider');
  }

  return context;
}
