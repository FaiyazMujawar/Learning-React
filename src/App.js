import "semantic-ui-css/semantic.min.css";
import "./App.css";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import PrivateRoute from "./context/PrivateRoute";
import { AuthProvider } from "./context/Auth";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/Login";
import Home from "./pages/Home";
import User from "./pages/User";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Switch>
            <PrivateRoute exact path="/" component={Home} />
            <PrivateRoute exact path="/user/:id" component={User} />
            <Route exact path="/login" component={LogIn} />
            <Route exact path="/signup" component={SignUp} />
          </Switch>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
