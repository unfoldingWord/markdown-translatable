import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {FileContext} from 'gitea-react-toolkit';

export const MarkdownContext = React.createContext({ state: {}, actions: [] });

export function MarkdownContextProvider({
  children,
}) {
  const [isChanged, setIsChanged] = useState(false);

  const state = { isChanged };
  const actions = { setIsChanged };

  // Optional context:
  const { state: file, stateValues: fileStateValues, actions: fileActions } = useContext(FileContext) || {state: null, stateValues: null, actions: null};

  useEffect(() => {
    if (fileStateValues && fileActions) {
      fileActions.setIsChanged(isChanged);
    }
  }, [isChanged]);

  const context = {
    state,
    actions,
  };

  return (
    <MarkdownContext.Provider value={context}>
      {children}
    </MarkdownContext.Provider>
  );
};

MarkdownContextProvider.propTypes = {
  /** Children to render inside of Provider */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
