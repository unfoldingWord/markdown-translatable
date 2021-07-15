import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export const MarkdownContext = React.createContext({ state: {}, actions: [] });

export function MarkdownContextProvider({
  children,
}) {
  const [isChanged, setIsChanged] = useState(false);

  const state = { isChanged };
  const actions = { setIsChanged };

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
