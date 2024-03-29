import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import CreatePlaylist from './CreatePlaylist';

jest.setTimeout(30000);

test('playlist creation', async () => {
  const onCreate = jest.fn();

  render(
    <CreatePlaylist
      waypoints={{
        track_ids: [
          '1O0xeZrBDbq7HPREdmYUYK',
          '1b7LMtXCXGc2EwOIplI35z'
        ]
      }}
      onCreate={onCreate}
      savePlaylist={false}
    />
  );
  fireEvent.click(screen.getByTestId('create-playlist'));
  await waitFor(() => expect(onCreate).toHaveBeenCalledTimes(1), { timeout: 30000 });
  expect(onCreate).toMatchSnapshot();
});
