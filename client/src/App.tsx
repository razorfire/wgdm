import { Router, Route, Switch } from "wouter";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { ContentList } from "./pages/ContentList";
import { ContentEditor } from "./pages/ContentEditor";

function App() {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/content" component={ContentList} />
          <Route path="/content/new" component={ContentEditor} />
          <Route path="/content/:id" component={ContentEditor} />
          <Route path="/content/:id/edit" component={ContentEditor} />
          <Route>
            <div className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
              <p className="text-muted-foreground">
                The page you're looking for doesn't exist.
              </p>
            </div>
          </Route>
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;