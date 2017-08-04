import React from 'react';
import PropTypes from 'prop-types';
import styles from './placeholder-renderer-default.scss';

const PlaceholderRendererDefault = ({ isOver, canDrop }) =>
  <div
    className={
      styles.placeholder +
      (canDrop ? ` ${styles.placeholderLandingPad}` : '') +
      (canDrop && !isOver ? ` ${styles.placeholderCancelPad}` : '')
    }
  />;

PlaceholderRendererDefault.defaultProps = {
  isOver: false,
  canDrop: false,
};

PlaceholderRendererDefault.propTypes = {
  isOver: PropTypes.bool,
  canDrop: PropTypes.bool,
};

export default PlaceholderRendererDefault;
