import React from 'react';
import { create as createTestRenderer } from 'react-test-renderer';
import { MemoryRouter as Router, Outlet, Routes, Route } from 'react-router';

describe('Descendant <Routes>', () => {
  describe('when the parent route path does not have a trailing *', () => {
    it('warns when you visit the parent route', () => {
      let spy = jest.spyOn(console, 'warn').mockImplementation();

      function ReactFundamentals() {
        return <h1>React Fundamentals</h1>;
      }

      function ReactCourses() {
        return (
          <div>
            <h1>React</h1>

            <Routes>
              <Route
                path="react-fundamentals"
                element={<ReactFundamentals />}
              />
            </Routes>
          </div>
        );
      }

      function Courses() {
        return (
          <div>
            <h1>Courses</h1>
            <Outlet />
          </div>
        );
      }

      createTestRenderer(
        <Router initialEntries={['/courses/react']}>
          <Routes>
            <Route path="courses" element={<Courses />}>
              <Route path="react" element={<ReactCourses />} />
            </Route>
          </Routes>
        </Router>
      );

      expect(spy).toHaveBeenCalledWith(
        expect.stringContaining('child routes will never render')
      );

      spy.mockRestore();
    });
  });

  describe('when the parent route has a trailing *', () => {
    it('does not warn when you visit the parent route', () => {
      let spy = jest.spyOn(console, 'warn').mockImplementation();

      function ReactFundamentals() {
        return <h1>React Fundamentals</h1>;
      }

      function ReactCourses() {
        return (
          <div>
            <h1>React</h1>

            <Routes>
              <Route
                path="react-fundamentals"
                element={<ReactFundamentals />}
              />
            </Routes>
          </div>
        );
      }

      function Courses() {
        return (
          <div>
            <h1>Courses</h1>
            <Outlet />
          </div>
        );
      }

      createTestRenderer(
        <Router initialEntries={['/courses/react']}>
          <Routes>
            <Route path="courses" element={<Courses />}>
              <Route path="react/*" element={<ReactCourses />} />
            </Route>
          </Routes>
        </Router>
      );

      expect(spy).not.toHaveBeenCalled();

      spy.mockRestore();
    });
  });
});
