import { createContext, useContext, useEffect, useState } from "react";
import { Loader } from "semantic-ui-react";
import { auth, firestore, timestamp } from "../firebase/config";

const AuthContext = createContext({
  user: null,
  login: async (_email, _password) => {},
  signup: async (_email, _password) => {},
  logout: async () => {},
});

const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // FIXME: setIsLoading here raises 'Cannot perform React State Update on unmounted component' warning.
        console.log("onAuthStateChanged called");
        setIsLoading(true);
        const { email, uid, photoURL, displayName } = user;
        firestore
          .collection("users")
          .doc(uid)
          .get()
          .then((doc) => {
            if (doc.exists) {
              const { firstName, lastName } = doc.data();
              setCurrentUser({
                email,
                uid,
                photoURL,
                displayName,
                firstName,
                lastName,
              });
            }
            setIsLoading(false);
          });
      } else {
        setCurrentUser(null);
        setIsLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const signup = async (firstName, lastName, dob, gender, email, password) => {
    const user = await auth.createUserWithEmailAndPassword(email, password);
    await firestore
      .collection("users")
      .doc(user.user.uid)
      .set({ firstName, lastName, dob, gender, createdOn: timestamp() });
  };

  const login = async (email, password) =>
    auth.signInWithEmailAndPassword(email, password);

  const logout = async () => auth.signOut();
  return (
    <AuthContext.Provider value={{ user: currentUser, login, signup, logout }}>
      {isLoading ? <Loader /> : children}
    </AuthContext.Provider>
  );
};

export { useAuth, AuthProvider };
