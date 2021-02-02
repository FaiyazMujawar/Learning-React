import "semantic-ui-css/semantic.min.css";
import "./App.css";

import { Container } from "semantic-ui-react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import PrivateRoute from "./context/PrivateRoute";
import { AuthProvider } from "./context/Auth";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/Login";
import Home from "./pages/Home";

function App() {
  return (
    <div className="App">
      <Container>
        <AuthProvider>
          <Router>
            <Switch>
              <PrivateRoute exact path="/" component={Home} />
              <Route exact path="/login" component={LogIn} />
              <Route exact path="/signup" component={SignUp} />
            </Switch>
          </Router>
        </AuthProvider>
      </Container>
    </div>
  );
}

export default App;