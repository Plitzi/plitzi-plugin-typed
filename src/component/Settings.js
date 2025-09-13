// Packages
import React, { useCallback } from 'react';
import noop from 'lodash/noop';
import Input from '@plitzi/plitzi-ui/Input';
import Switch from '@plitzi/plitzi-ui/Switch';

/**
 * @param {{
 *   prefix: string;
 *   separator: string;
 *   words: string[];
 *   suffix: string;
 *   loop: boolean;
 *   onUpdate?: (key: string, value: string) => void;
 * }} props
 * @returns {React.ReactElement}
 */
const Settings = props => {
  const { prefix = '', suffix = '', loop = true, separator = '', words = [], onUpdate = noop } = props;

  const handleChangePrefix = useCallback(value => onUpdate('prefix', value), [onUpdate]);

  const handleChangeSuffix = useCallback(value => onUpdate('suffix', value), [onUpdate]);

  const handleChangeSeparator = useCallback(value => onUpdate('separator', value), [onUpdate]);

  const handleChangeLoop = useCallback(e => onUpdate('loop', e.target.checked), [onUpdate]);

  const handleChangeWords = useCallback(
    value =>
      onUpdate(
        'words',
        value.split(',').map(word => word.trim())
      ),
    [onUpdate]
  );

  return (
    <div className="flex flex-col">
      <div className="bg-[#1A2835] px-4 py-2 flex items-center justify-center">
        <h1 className="text-white m-0">Lottie Settings</h1>
      </div>
      <div className="flex flex-col grow p-2 gap-2">
        <div className="flex flex-col w-full py-2">
          <label>Prefix</label>
          <Input value={prefix} onChange={handleChangePrefix} inputClassName="rounded" />
        </div>
        <div className="flex flex-col w-full py-2">
          <label>Suffix</label>
          <Input value={suffix} onChange={handleChangeSuffix} inputClassName="rounded" />
        </div>
        <div className="flex flex-col w-full py-2">
          <label>Separator</label>
          <Input value={separator} onChange={handleChangeSeparator} inputClassName="rounded" />
        </div>
        <div className="flex gap-1">
          <Switch value={loop} size="sm" className="!w-auto rounded" onChange={handleChangeLoop}>
            Loop
          </Switch>
        </div>
        <div className="flex flex-col w-full py-2">
          <label>Words (comma separator)</label>
          <Input value={words.join(',')} onChange={handleChangeWords} inputClassName="rounded" />
        </div>
      </div>
    </div>
  );
};

export default Settings;
