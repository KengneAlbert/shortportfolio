import { db, storage } from '../config/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  updateDoc, 
  setDoc,
  deleteDoc 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL,
  deleteObject 
} from 'firebase/storage';

// Videos Collection
export const getVideos = async () => {
  const showcaseSnapshot = await getDocs(collection(db, 'showcase'));
  const portfolioSnapshot = await getDocs(collection(db, 'portfolio'));

  return {
    showcase: showcaseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
    portfolio: portfolioSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  };
};

export const updateVideo = async (section: 'showcase' | 'portfolio', videoId: string, data: any) => {
  const videoRef = doc(db, section, videoId);
  await updateDoc(videoRef, data);
};

export const addVideo = async (section: 'showcase' | 'portfolio', data: any) => {
  const newVideoRef = doc(collection(db, section));
  await setDoc(newVideoRef, data);
  return newVideoRef.id;
};

export const deleteVideo = async (section: 'showcase' | 'portfolio', videoId: string) => {
  await deleteDoc(doc(db, section, videoId));
};

// File Upload
export const uploadFile = async (file: File, path: string) => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

export const deleteFile = async (path: string) => {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
};

// About Section
export const getAbout = async () => {
  const aboutDoc = await getDocs(collection(db, 'about'));
  return aboutDoc.docs[0]?.data();
};

export const updateAbout = async (data: any) => {
  const aboutRef = doc(db, 'about', 'main');
  await updateDoc(aboutRef, data);
};

// Contact Section
export const getContact = async () => {
  const contactDoc = await getDocs(collection(db, 'contact'));
  return contactDoc.docs[0]?.data();
};

export const updateContact = async (data: any) => {
  const contactRef = doc(db, 'contact', 'main');
  await updateDoc(contactRef, data);
};