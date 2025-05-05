import {
  createContext,
  useState,
  useEffect,
  useContext,
  type ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, data } from '../fire-basesetting';
import { Loader2 } from 'lucide-react';

export type User = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
};

type AuthContext = {
  user: User | null;
  signIn: () => void;
  signOut: () => void;
};

const defaultValues = {
  user: null,
  signIn: () => {},
  signOut: () => {},
};

export const authContext = createContext<AuthContext>(defaultValues);
export const useAuth = () => useContext(authContext);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = (props: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (isLoading) setIsLoading(false);
      if (user == null) return;
      const newUser = {
        id: user.uid,
        name: user.displayName,
        email: user.email,
        image: user.photoURL,
      };
      setUser(newUser);
    });

    return unsub;
  }, []);

  const signIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);

      const userRef = doc(data, 'users', res.user.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) return;

      await setDoc(userRef, {
        id: res.user.uid,
        name: res.user.displayName,
        email: res.user.email,
        image: res.user.photoURL,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  if (isLoading) {
    return (
      <div className='grid h-full w-full place-items-center text-xl font-black'>
        <div className='flex gap-2 animate-in zoom-in-50'>
          <Loader2 className='h-7 w-7 animate-spin' /> Chess
        </div>
      </div>
    );
  }

  return (
    <authContext.Provider value={{ signIn, user, signOut }}>
      {props.children}
    </authContext.Provider>
  );
};
