import { getRegistryItem, registry, type RegistryItem } from '@chameleon-ui/registry';
import { RegistryStore } from './store.js';

function cloneItem(
  item: RegistryItem,
  namespace: string,
  version: string,
): RegistryItem {
  return {
    ...item,
    namespace,
    version,
    files: item.files.map((file) => ({ ...file })),
    dependencies: item.dependencies ? [...item.dependencies] : [],
  };
}

export function seedDefaultStore(): RegistryStore {
  const store = new RegistryStore();
  for (const item of registry) {
    store.put(cloneItem(item, 'public', item.version ?? '0.0.0'));
  }

  const button = getRegistryItem('button');
  if (button) {
    store.put(cloneItem(button, 'acme', '0.9.0'));
    store.put(cloneItem(button, 'acme', '1.0.0'));
    store.put(cloneItem(button, 'acme', '1.1.0'));
  }

  return store;
}
