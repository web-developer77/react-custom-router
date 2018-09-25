export {
  HashRouter,
  Link,
  MemoryRouter,
  NavLink,
  Prompt,
  Redirect,
  Route,
  Router,
  StaticRouter,
  Switch,
  generatePath,
  matchPath,
  withRouter
} from "../../packages/react-router-dom";

// Need to shim <BrowserRouter> so people can copy/paste
// examples into create-react-app but our docs site already
// has a <BrowserRouter> rendered up top!
export const BrowserRouter = ({ children }) => children;
