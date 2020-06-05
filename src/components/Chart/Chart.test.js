import React from 'react';
import { render } from '@testing-library/react';
import Chart from './Chart';

describe('<Chart />', () => {
  const { container, getByText } = render(<Chart base="USD" symbol="EUR" symbols={['USD', 'EUR', 'CAD']} setCompareSymbol={() => {}} />);
  it('should render symbol correctly', () => {
    expect(getByText('Compare to: EUR')).toBeInTheDocument();
  });
});
