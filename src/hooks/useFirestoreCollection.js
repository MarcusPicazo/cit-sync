import { useState, useEffect } from 'react';
import { onSnapshot } from 'firebase/firestore';
import { publicPath } from '../config/firebase';

export function useFirestoreCollection(collectionName) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!collectionName) return;
    
    const unsubscribe = onSnapshot(
      publicPath(collectionName), 
      (snapshot) => {
        setData(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      },
      (error) => {
        console.warn(`Aviso de Firebase (${collectionName}):`, error.message);
        // ¡ESTO ES CLAVE! Si Firebase falla por la llave falsa, apagamos la carga para que la app se muestre
        setLoading(false); 
      }
    );

    return () => unsubscribe();
  }, [collectionName]);

  return { data, loading };
}