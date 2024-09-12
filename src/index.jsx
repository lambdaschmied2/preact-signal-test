import { render } from "preact";
import { LocationProvider, Router, Route } from "preact-iso";

import { FooPage } from "./pages/Foo/index.jsx";

import "./css/vars.css";
import "./css/layout.css";
import "./css/components.css";
import "./css/main.css";

export function App() {
  return (
    <LocationProvider>
      <Router>
        <Route path="/" component={FooPage} />
        <Route path="/:id" component={FooPage} />
        <Route path="/:id/:tab" component={FooPage} />
      </Router>
    </LocationProvider>
  );
}

render(<App />, document.getElementById("app"));
