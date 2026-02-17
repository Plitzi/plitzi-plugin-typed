import PlitziSdk, { PlitziServiceProvider, ElementContext } from '@plitzi/plitzi-sdk';
import Provider from '@plitzi/plitzi-ui/Provider';
import { useRef, useState } from 'react';

import Settings from './Settings';
import Typed from './Typed';

import type { SettingsProps } from './Settings';
import type { PlitziServiceContextValue, OfflineDataRaw, Schema } from '@plitzi/plitzi-sdk';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Typed',
  component: Typed,
  // parameters: {
  //   layout: 'centered'
  // }
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof Typed>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
  render: function Render(args) {
    const ref = useRef<HTMLDivElement>(null);

    return (
      <PlitziServiceProvider value={{ settings: { previewMode: true } } as PlitziServiceContextValue}>
        <ElementContext value={{ id: '', rootId: '', plitziJsxSkipHOC: true }}>
          <Typed ref={ref} {...args} />
        </ElementContext>
      </PlitziServiceProvider>
    );
  }
};

const schema: Schema = {
  settings: {
    customCss: ''
  },
  flat: {
    '5f544375ced80ed16f382b7b': {
      attributes: {
        name: 'Home'
      },
      definition: {
        label: 'Page',
        type: 'page',
        slug: '',
        rootId: '5f544375ced80ed16f382b7b',
        parentId: undefined,
        items: ['5f47e7ca8294097d8b0a1715'],
        styleSelectors: {
          base: ''
        }
      },
      id: '5f544375ced80ed16f382b7b'
    },
    '5f47e7ca8294097d8b0a1715': {
      id: '5f47e7ca8294097d8b0a1715',
      attributes: {
        prefix: 'Unleash your creativity, supercharge your ',
        words: ['space', 'web', 'app'],
        separator: ''
      },
      definition: {
        label: 'Typed',
        type: 'typed',
        description: '',
        rootId: '5f544375ced80ed16f382b7b',
        parentId: '5f544375ced80ed16f382b7b',
        styleSelectors: {
          base: ''
        }
      }
    }
  },
  pages: ['5f544375ced80ed16f382b7b'],
  variables: [],
  definition: { name: 'Schema1', permanentUrl: '' },
  pageFolders: []
};

export const WithHoc: Story = {
  args: {},
  render: () => (
    <PlitziSdk offlineMode offlineData={{ schema, style: {} } as OfflineDataRaw}>
      <PlitziSdk.Plugin
        renderType="typed"
        component={Typed}
        assets={[{ id: 'asset-1', type: 'link', params: { href: '/main.css', rel: 'stylesheet', type: 'text/css' } }]}
      />
    </PlitziSdk>
  )
};

export const WithHocNoPreview: Story = {
  args: {},
  render: () => (
    <PlitziSdk className="w-full" offlineMode offlineData={{ schema, style: {} } as OfflineDataRaw} previewMode={false}>
      <PlitziSdk.Plugin
        renderType="typed"
        component={Typed}
        assets={[{ id: 'asset-1', type: 'link', params: { href: '/main.css', rel: 'stylesheet', type: 'text/css' } }]}
      />
    </PlitziSdk>
  )
};

export const WithHocNoIframe: Story = {
  args: {},
  render: () => (
    <PlitziSdk className="w-full" offlineMode renderMode="raw" offlineData={{ schema, style: {} } as OfflineDataRaw}>
      <PlitziSdk.Plugin renderType="typed" component={Typed} />
    </PlitziSdk>
  )
};

export const ComponentSettings: Story = {
  args: {},
  render: function Render(args: SettingsProps) {
    const [props, setProps] = useState({});

    const onUpdate = (key: string, value: string | string[] | boolean) => {
      setProps(state => ({ ...state, [key]: value }));
    };

    return (
      <Provider>
        <Settings {...args} {...props} onUpdate={onUpdate} />
      </Provider>
    );
  }
};
