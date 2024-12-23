import React, { createContext, useContext, useState, useEffect } from 'react';
import { useFirebase } from '../hooks/useFirebase';
import * as firebaseService from '../services/firebase';
import aboutData from '../content/about.json';
import videosData from '../content/videos.json';
import contactData from '../content/contact.json';

interface AppContextType {
  about: typeof aboutData;
  videos: typeof videosData;
  contact: typeof contactData;
  loading: boolean;
  error: string | null;
  updateAbout: (data: typeof aboutData) => Promise<void>;
  updateVideos: (section: 'showcase' | 'portfolio', data: any) => Promise<void>;
  updateContact: (data: typeof contactData) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { data, loading, error, updateData, refreshData } = useFirebase();
  const [about, setAbout] = useState(aboutData);
  const [videos, setVideos] = useState(videosData);
  const [contact, setContact] = useState(contactData);

  useEffect(() => {
    if (data) {
      if (data.about) setAbout(data.about);
      if (data.videos) setVideos(data.videos);
      if (data.contact) setContact(data.contact);
    }
  }, [data]);

  const updateAbout = async (newData: typeof aboutData) => {
    try {
      await firebaseService.updateAbout(newData);
      setAbout(newData);
      await refreshData();
    } catch (error) {
      console.error('Error updating about:', error);
      throw error;
    }
  };

  const updateVideos = async (section: 'showcase' | 'portfolio', videoData: any) => {
    try {
      if (videoData.id) {
        await firebaseService.updateVideo(section, videoData.id, videoData);
      } else {
        const newId = await firebaseService.addVideo(section, videoData);
        videoData.id = newId;
      }
      
      const updatedVideos = { ...videos };
      if (videoData.id) {
        updatedVideos[section] = videos[section].map((video: any) =>
          video.id === videoData.id ? videoData : video
        );
      } else {
        updatedVideos[section] = [...videos[section], videoData];
      }
      
      setVideos(updatedVideos);
      await refreshData();
    } catch (error) {
      console.error('Error updating videos:', error);
      throw error;
    }
  };

  const updateContact = async (newData: typeof contactData) => {
    try {
      await firebaseService.updateContact(newData);
      setContact(newData);
      await refreshData();
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  };

  return (
    <AppContext.Provider value={{ 
      about, 
      videos, 
      contact,
      loading,
      error,
      updateAbout, 
      updateVideos,
      updateContact
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}