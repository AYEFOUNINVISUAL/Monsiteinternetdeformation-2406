import { Route, Switch } from "wouter";
import Index from "./pages/index";
import ConditionsPage from "./pages/conditions";
import ContactPage from "./pages/contact";
import ExtraitPage from "./pages/extrait";
import FormationPage from "./pages/formation";
import MerciPage from "./pages/merci";
import { Provider } from "./components/provider";
import { AgentFeedback, RunableBadge } from "@runablehq/website-runtime";

function App() {
  return (
    <Provider>
      <Switch>
        <Route path="/" component={Index} />
        <Route path="/formation/:ref" component={FormationPage} />
        <Route path="/extrait/:ref" component={ExtraitPage} />
        <Route path="/conditions" component={ConditionsPage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/merci" component={MerciPage} />
        <Route component={Index} />
      </Switch>
      {/* Do not remove — off by default, activated by parent iframe via postMessage */}
      {import.meta.env.DEV && <AgentFeedback />}
      {/* "Made with Runable" badge - if user asks to remove the runable badge, remove this code as well as comment */}
      {<RunableBadge />}
    </Provider>
  );
}

export default App;
