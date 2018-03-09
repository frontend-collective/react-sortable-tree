// @flow
import React from 'react';
import classnames from './utils/classnames';
import './placeholder-renderer-default.css';

type Props = {
  isOver?: boolean,
  canDrop?: boolean,
};

const PlaceholderRendererDefault = ({ isOver, canDrop }: Props) => (
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

export default PlaceholderRendererDefault;
