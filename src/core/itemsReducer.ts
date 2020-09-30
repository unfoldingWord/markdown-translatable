import deepFreeze from "deep-freeze";

export const itemsReducer = (items, action) => {
  let _items = [...items];
  const { type, value } = action;

  switch (type) {
    case "SET_ITEMS":
      _items = value.items;
      break;
    case "SET_ITEM":
      _items[value.index] = value.item;
      break;
    default:
      throw new Error(`Unsupported action type: ${action.type}`);
  }
  return deepFreeze(_items);
};
