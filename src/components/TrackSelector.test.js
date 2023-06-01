import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import TrackSelector from './TrackSelector';

jest.setTimeout(20000);

test('track search', async () => {
  render(<TrackSelector />);
  fireEvent.change(screen.getByRole('textbox'), {
    target: { value: 'james brown' },
  });
  const tracks = await waitFor(() => screen.getAllByTestId('track'), {timeout: 20000});
  expect(tracks).toMatchSnapshot();
});
