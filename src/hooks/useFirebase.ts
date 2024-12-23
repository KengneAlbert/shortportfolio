import { useState, useEffect } from 'react';
import * as firebaseService from '../services/firebase';

export function useFirebase() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [videos, about, contact] = await Promise.all([
        firebaseService.getVideos(),
        firebaseService.getAbout(),
        firebaseService.getContact()
      ]);

      setData({ videos, about, contact });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateData = async (type: 'videos' | 'about' | 'contact', newData: any) => {
    try {
      setLoading(true);
      switch (type) {
        case 'about':
          await firebaseService.updateAbout(newData);
          break;
        case 'contact':
          await firebaseService.updateContact(newData);
          break;
      }
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, updateData, refreshData: fetchData };
}