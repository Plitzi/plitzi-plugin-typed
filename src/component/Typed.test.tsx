import { ElementContext, PlitziServiceProvider } from '@plitzi/plitzi-sdk';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import Typed from './Typed';

import type { PlitziServiceContextValue } from '@plitzi/plitzi-sdk';

describe('Typed', () => {
  it('should render successfully', () => {
    const ref = { current: null };

    const BaseElement = render(
      <PlitziServiceProvider value={{ settings: { previewMode: true } } as PlitziServiceContextValue}>
        <ElementContext value={{ id: '', rootId: '', plitziJsxSkipHOC: true }}>
          <Typed ref={ref} />
        </ElementContext>
      </PlitziServiceProvider>
    );

    expect(BaseElement).toBeTruthy();
  });
});
