import * as React from 'react';
import { create as createTestRenderer } from 'react-test-renderer';
import {
  MemoryRouter as Router,
  Routes,
  Route,
  Outlet,
  useRouteData,
  useNavigate
} from 'react-router';

import { render, fireEvent, waitFor, screen } from '@testing-library/react';

describe.only('data loading', () => {
  let data = {
    layout: { id: 'layout' },
    home: { id: 'home' },
    about: { id: 'about' }
  };

  function Layout() {
    let data = useRouteData();
    let navigate = useNavigate();
    return (
      <div>
        <h1>{data.id}</h1>
        <button
          data-testid="navigate"
          onClick={() => {
            navigate('/about');
          }}
        />
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

  function About() {
    let data = useRouteData();
    return <h2 data-testid="about">{data.id}</h2>;
  }
  let aboutLoader = () => Promise.resolve(data.about);

  describe('transitioning', () => {
    test('loads route data', async () => {
      render(
        <div data-testid="root">
          <Router initialEntries={['/']}>
            <Routes>
              <Route
                element={<Layout />}
                loader={layoutLoader}
                initialData={data.layout}
              >
                <Route
                  path="/"
                  element={<Home />}
                  loader={homeLoader}
                  initialData={data.home}
                />
                <Route path="/about" element={<About />} loader={aboutLoader} />
              </Route>
            </Routes>
          </Router>
        </div>
      );

      fireEvent.click(screen.getByTestId('navigate'));

      await waitFor(() => screen.getByTestId('about'));

      expect(screen.getByTestId('root')).toMatchSnapshot();
    });
  });

  describe('initial render', () => {
    it('uses initialData', () => {
      let renderer = createTestRenderer(
        <Router initialEntries={['/']}>
          <Routes>
            <Route
              element={<Layout />}
              loader={layoutLoader}
              initialData={data.layout}
            >
              <Route
                path="/"
                element={<Home />}
                loader={homeLoader}
                initialData={data.home}
              />
            </Route>
          </Routes>
        </Router>
      );

      expect(renderer.toJSON()).toMatchSnapshot();
    });
  });
});
