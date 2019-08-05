import deepFreeze from 'deep-freeze';

export const blocksReducer = (blocks, action) => {
  let _blocks = [...blocks];
  const {type, value} = action;
  switch (type) {
    case 'SET_BLOCKS':
      _blocks = value.blocks;
      return deepFreeze(_blocks);
    case 'SET_BLOCK':
      _blocks[value.index] = value.markdown;
      return deepFreeze(_blocks);
    default:
      throw new Error(`Unsupported action type: ${action.type}`);
  }
};