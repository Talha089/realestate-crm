import { render, screen } from '@testing-library/react';
import Dialpad from './';

test('renders component', () => {
  render(<Dialpad />);

  expect(screen.getByTestId('dial-pad')).toBeInTheDocument()
});
