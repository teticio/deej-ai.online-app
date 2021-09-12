import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('app routing', async () => {
  const { asFragment } = render(<App />, { wrapper: MemoryRouter });
  fireEvent.click(screen.getByText("Create playlist"));
  expect(asFragment()).toMatchSnapshot();
  fireEvent.click(screen.getByText("Top rated playlists"));
  expect(asFragment()).toMatchSnapshot();
  fireEvent.click(screen.getByText("Latest playlists"));
  expect(asFragment()).toMatchSnapshot();
  fireEvent.click(screen.getByText("Search playlists"));
  expect(asFragment()).toMatchSnapshot();
  fireEvent.click(screen.getByText("About"));
  expect(asFragment()).toMatchSnapshot();
});
