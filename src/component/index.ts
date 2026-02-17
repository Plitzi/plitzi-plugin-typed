import Settings from './Settings';
import BaseTyped from './Typed';

const Typed = Object.assign(BaseTyped, { type: 'typed', pluginSettings: Settings, version: PLUGIN_VERSION });

export const plugins = {};

export const version = PLUGIN_VERSION;

export default Typed;
