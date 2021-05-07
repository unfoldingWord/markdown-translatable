import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
  root: {
    height: '100%',
    width: '100%',
  },
  html: {
    'height': '100%',
    'width': 'calc(100% - 1em)',
    'display': 'grid',
    'padding': '0 0.5em',
    'lineHeight': '1.4',
    '& h1, h2, h3, h4, h5, h6': { fontSize: ({ fontSize }) => (fontSize ? `${fontSize} !important` : 'unset') },
  },
  markdown: {
    height: '100%',
    width: 'calc(100% - 1em)',
    display: 'grid',
    whiteSpace: 'pre-wrap',
    paddingBlockStart: '1em',
    paddingBlockEnd: '1em',
    fontFamily: 'unset',
    padding: '0 0.5em',
    lineHeight: '1.4',
    fontSize: 'unset',
  },
  pre: {
    margin: 0,
    fontFamily: 'unset',
    fontSize: 'unset',
    whiteSpace: 'normal',
  },
}));