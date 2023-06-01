import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import CreatePlaylist from './CreatePlaylist';

jest.setTimeout(20000);

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
  await waitFor(() => expect(onCreate).toHaveBeenCalledTimes(1), { timeout: 20000 });
  expect(onCreate).toMatchSnapshot();
});
