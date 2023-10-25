import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import TrackSelector from './TrackSelector';

jest.setTimeout(30000);

test('track search', async () => {
  render(<TrackSelector />);
  fireEvent.change(screen.getByRole('textbox'), {
    target: { value: 'james brown' },
  });
  const tracks = await waitFor(() => screen.getAllByTestId('track'), {timeout: 30000});
  expect(tracks).toMatchSnapshot();
});
