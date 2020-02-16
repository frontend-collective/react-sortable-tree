import React from 'react';
import PropTypes from 'prop-types';
import classnames from './utils/classnames';
import './placeholder-renderer-default.css';

const PlaceholderRendererDefault = ({ isOver, canDrop }) => (
  <div
    className={classnames(
      'rst__placeholder',
      canDrop && 'rst__placeholderLandingPad',
      canDrop && !isOver && 'rst__placeholderCancelPad'
    )}
  />
);

PlaceholderRendererDefault.defaultProps = {
  isOver: false,
  canDrop: false,
};

PlaceholderRendererDefault.propTypes = {
  isOver: PropTypes.bool,
  canDrop: PropTypes.bool,
};

export default PlaceholderRendererDefault;
