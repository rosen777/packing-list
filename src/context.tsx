import { useState, createContext, PropsWithChildren } from 'react';
import {
  createItem,
  filterItems,
  getInitialItems,
  removeItem,
  updateItem,
} from './lib/items';

type PartialItem = Partial<Item>;
type WithoutId = Omit<PartialItem, 'id'>;

export type ItemsContextType = {
  items: Item[];
  unpackedItems: Item[];
  packedItems: Item[];
  markAllAsUnpacked: () => void;
  add: (name: string) => void;
  update: (id: string, updates: Omit<Partial<Item>, 'id'>) => void;
  remove: (id: string) => void;
};

export const ItemsContext = createContext({} as ItemsContextType);

const ItemsProvider = ({ children }: PropsWithChildren) => {
  // eslint-disable-next-line
  const [items, setItems] = useState(getInitialItems());

  const add = (name: string) => {
    const item = createItem(name);
    setItems([...items, item]);
  };

  const update = (id: string, updates: WithoutId) => {
    setItems(updateItem(items, id, updates));
  };

  const remove = (id: string) => {
    setItems(removeItem(items, id));
  };

  const unpackedItems = filterItems(items, { packed: false });
  const packedItems = filterItems(items, { packed: true });

  const markAllAsUnpacked = () => {
    return setItems(items.map((item) => ({ ...item, packed: false })));
  };

  const value = {
    items,
    unpackedItems,
    packedItems,
    markAllAsUnpacked,
    add,
    update,
    remove,
  };

  return (
    <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>
  );
};

export default ItemsProvider;
