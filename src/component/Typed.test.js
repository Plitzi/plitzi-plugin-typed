// Packages
import React from 'react';
import { render } from '@testing-library/react';
import { PlitziServiceProvider } from '@plitzi/plitzi-sdk';
import { describe, it, expect } from '@jest/globals';

// Relatives
import Typed from './Typed';

describe('Typed', () => {
  it('should render successfully', () => {
    const ref = { current: null };

    const BaseElement = render(
      <PlitziServiceProvider value={{ settings: { previewMode: true } }}>
        <Typed ref={ref} />
      </PlitziServiceProvider>
    );

    expect(BaseElement).toBeTruthy();
  });
});
