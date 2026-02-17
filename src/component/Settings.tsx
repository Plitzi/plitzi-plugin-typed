import Input from '@plitzi/plitzi-ui/Input';
import Provider from '@plitzi/plitzi-ui/Provider';
import Switch from '@plitzi/plitzi-ui/Switch';
import { useCallback } from 'react';

import type { ChangeEvent } from 'react';

export type SettingsProps = {
  prefix?: string;
  separator?: string;
  words?: string[];
  suffix?: string;
  loop?: boolean;
  onUpdate?: (key: string, value: string | string[] | boolean) => void;
};

const Settings = ({ prefix = '', suffix = '', loop = true, separator = '', words = [], onUpdate }: SettingsProps) => {
  const handleChangePrefix = useCallback((value: string) => onUpdate?.('prefix', value), [onUpdate]);

  const handleChangeSuffix = useCallback((value: string) => onUpdate?.('suffix', value), [onUpdate]);

  const handleChangeSeparator = useCallback((value: string) => onUpdate?.('separator', value), [onUpdate]);

  const handleChangeLoop = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => onUpdate?.('loop', (e.target as HTMLInputElement).checked),
    [onUpdate]
  );

  const handleChangeWords = useCallback(
    (value: string) =>
      onUpdate?.(
        'words',
        value.split(',').map(word => word.trim())
      ),
    [onUpdate]
  );

  return (
    <Provider>
      <div className="flex h-full flex-col gap-4 py-2">
        <Input id="prefix" label="Prefix" size="xs" value={prefix} onChange={handleChangePrefix} />
        <Input id="suffix" label="Suffix" size="xs" value={suffix} onChange={handleChangeSuffix} />
        <Input id="separator" label="Separator" size="xs" value={separator} onChange={handleChangeSeparator} />
        <Switch checked={loop} label="Loop" size="xs" onChange={handleChangeLoop} />
        <Input
          id="words"
          label="Words (comma separator)"
          size="xs"
          value={words.join(',')}
          onChange={handleChangeWords}
        />
      </div>
    </Provider>
  );
};

export default Settings;
