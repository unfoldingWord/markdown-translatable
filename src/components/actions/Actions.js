import React, {useCallback, useMemo} from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import {IconButton} from '@material-ui/core';
import {
  Save,
  SaveOutlined,
  Pageview,
  PageviewOutlined,
  ShortText,
  Subject,
} from '@material-ui/icons';

function Actions({
  sectionable,
  onSectionable,
  preview,
  onPreview,
  changed,
  onSave,
}) {
  const classes = useStyles();

  const _onSave = useCallback(onSave, [onSave]);
  const _onPreview = useCallback(onPreview, [onPreview]);
  const _onSectionable = useCallback(onSectionable, [onSectionable]);
  const togglePreview = useCallback(() => _onPreview(!preview), [preview, _onPreview]);
  const toggleSectionable = useCallback(() => _onSectionable(!sectionable), [sectionable, _onSectionable]);

  const saveIcon = useMemo(() => (changed ? <Save /> : <SaveOutlined />), [changed]);
  const previewIcon = useMemo(() => (!preview ? <Pageview /> : <PageviewOutlined />), [preview]);
  const sectionableIcon = useMemo(() => (sectionable ? <ShortText /> : <Subject />), [sectionable]);

  const sectionAction = useMemo(() => (
      <IconButton className={classes.action} aria-label="Sections" onClick={toggleSectionable}>
        {sectionableIcon}
      </IconButton>
  ), [classes.action, sectionableIcon, toggleSectionable]);
  const previewAction = useMemo(() => (
      <IconButton className={classes.action} aria-label="Preview" onClick={togglePreview}>
        {previewIcon}
      </IconButton>
  ), [classes.action, previewIcon, togglePreview]);
  const saveAction = useMemo(() => (
    <IconButton className={classes.action} aria-label="Save" disabled={!changed} onClick={_onSave}>
      {saveIcon}
    </IconButton>
  ), [_onSave, changed, classes.action, saveIcon]);

  return (
    <div className={classes.actions}>
      {sectionAction}
      {previewAction}
      {saveAction}
    </div>
  );
};

Actions.propTypes = {
  /** Divide editor by segments */
  sectionable: PropTypes.bool,
  /** Function to propogate changes to sectionable. */
  onSectionable: PropTypes.func.isRequired,
  /** Preview HTML or RAW Markdown */
  preview: PropTypes.bool,
  /** Function to propogate changes to preview. */
  onPreview: PropTypes.func.isRequired,
  /** Enable/Disable save icon if changed. */
  changed: PropTypes.bool,
  /** Function to propogate changes to save. */
  onSave: PropTypes.func.isRequired,
};

const useStyles = makeStyles(theme => ({
  actions: {
    textAlign: 'right',
    paddingRight: `${theme.spacing(1.5)}px`,
  },
  action: {
    marginLeft: `${theme.spacing(1)}px`,
  }
}));

export default Actions;
