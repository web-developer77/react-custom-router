import * as React from 'react';
import { create as createTestRenderer } from 'react-test-renderer';
import {
  MemoryRouter as Router,
  Routes,
  Route,
  Outlet,
  useRouteData
} from 'react-router';

describe('data loading', () => {
  describe('initial render', () => {
    it('uses initialData', () => {
      let data = {
        layout: { id: 'layout' },
        home: { id: 'home' }
      };

      function Layout() {
        let data = useRouteData();
        return (
          <div>
            <h1>{data.id}</h1>
            <Outlet />
          </div>
        );
      }
      let layoutLoader = () => Promise.resolve(data.layout);

      function Home() {
        let data = useRouteData();
        return <h2>{data.id}</h2>;
      }
      let homeLoader = () => Promise.resolve(data.home);

      let renderer = createTestRenderer(
        <Router initialEntries={['/']}>
          <Routes
            layout={<Layout />}
            loader={layoutLoader}
            initialData={data.layout}
          >
            <Route
              path="/"
              element={<Home />}
              loader={homeLoader}
              initialData={data.home}
            />
          </Routes>
        </Router>
      );

      expect(renderer.toJSON()).toMatchSnapshot();
    });
  });
});
