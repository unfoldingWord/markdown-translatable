import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Tooltip } from '@material-ui/core';
import {
  Save,
  SaveOutlined,
  Pageview,
  PageviewOutlined,
  ShortText,
  Subject,
  ViewStream,
  ViewStreamOutlined,
} from '@material-ui/icons';
import { localString } from '../../core/localStrings';

function Actions({
  sectionable,
  onSectionable,
  blockable,
  onBlockable,
  preview,
  onPreview,
  changed,
  onSave,
}) {
  const classes = useStyles();

  const _onSave = useCallback(onSave, [onSave]);
  const _onPreview = useCallback(onPreview, [onPreview]);
  const _onSectionable = useCallback(onSectionable, [onSectionable]);
  const _onBlockable = useCallback(onBlockable, [onBlockable]);
  const togglePreview = useCallback(() => _onPreview(!preview), [preview, _onPreview]);
  const toggleSectionable = useCallback(() => _onSectionable(!sectionable), [sectionable, _onSectionable]);
  const toggleBlockable = useCallback(() => _onBlockable(!blockable), [blockable, _onBlockable]);

  const saveIcon = useMemo(() => (changed ? <Save /> : <SaveOutlined />), [changed]);
  const previewIcon = useMemo(() => (!preview ? <Pageview /> : <PageviewOutlined />), [preview]);
  const sectionableIcon = useMemo(() => (sectionable ? <ViewStream /> : <ViewStreamOutlined /> ), [sectionable]);
  const blockableIcon = useMemo(() => (blockable ? <ShortText /> : <Subject />), [blockable]);

  const sectionsAction = useMemo(() => (
    <Tooltip title={
      sectionable ? 
        localString("Sections") :
        localString("NoSections")
      } arrow
    >
      <IconButton className={classes.action} aria-label="Sections" onClick={toggleSectionable}>
        {sectionableIcon}
      </IconButton>
    </Tooltip>
  ), [classes.action, sectionableIcon, toggleSectionable]);
  const blocksAction = useMemo(() => (
    <Tooltip title={
      blockable ? 
        localString("Blocks") :
        localString("NoBlocks")
      } arrow
    >
      <IconButton className={classes.action} aria-label="Blocks" onClick={toggleBlockable}>
        {blockableIcon}
      </IconButton>
    </Tooltip>
  ), [classes.action, blockableIcon, toggleBlockable]);
  const previewAction = useMemo(() => (
    <Tooltip title={localString("Preview")} arrow>
      <IconButton className={classes.action} aria-label="Preview" onClick={togglePreview}>
        {previewIcon}
      </IconButton>
    </Tooltip>
  ), [classes.action, previewIcon, togglePreview]);
  const saveAction = useMemo(() => (
    <Tooltip title={localString("Save")} arrow>
      <IconButton className={classes.action} aria-label="Save" disabled={!changed} onClick={_onSave}>
        {saveIcon}
      </IconButton>
    </Tooltip>
  ), [_onSave, changed, classes.action, saveIcon]);

  return (
    <div className={classes.actions}>
      {sectionsAction}
      {blocksAction}
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
  /** Divide segments by blocks */
  blockable: PropTypes.bool,
  /** Function to propogate changes to blockable. */
  onBlockable: PropTypes.func.isRequired,
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
