import { useEffect, useState } from "react";
import { authService } from "../firebase";
import GlobalStyles from "./GlobalStyle";
import AppRouter from "./Router";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setUserObj({
          displayName: user.displayName ? user.displayName : "anonymous",
          uid: user.uid,
          updateProfile: (who) => user.updateProfile(who),
        });
      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);

  return init ? (
    <>
      <AppRouter isLogIn={Boolean(userObj)} userObj={userObj}></AppRouter>
      <GlobalStyles />
    </>
  ) : (
    "Loading...."
  );
}

export default App;
