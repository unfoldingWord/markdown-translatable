import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    width: '100%',
  },
  html: {
    height: '100%',
    width: 'calc(100% - 1em)',
    display: 'grid',
    padding: '0 0.5em',
    lineHeight: '1.4',
  },
  markdown: {
    height: '100%',
    width: 'calc(100% - 1em)',
    // fontSize: '1.1em',
    display: 'grid',
    whiteSpace: 'pre-wrap',
    paddingBlockStart: '1em',
    paddingBlockEnd: '1em',
    fontSize: 'unset',
    fontFamily: 'unset',
    padding: '0 0.5em',
    lineHeight: '1.4',
  },
  pre: {
    margin: 0,
    fontFamily: 'unset',
    fontSize: 'unset',
  },
}));