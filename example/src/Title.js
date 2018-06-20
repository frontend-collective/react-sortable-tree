import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import styles from './Title.module.css';
import image from './tree.png';

export default class Title extends Component {
  render() {
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand className={styles.brand}>
            <img
              className={styles.brandImage}
              src={image}
              height="33"
              width="40"
              alt="react-sortable-tree"
            />
            <a href="/">React Sortable Tree</a>
          </Navbar.Brand>
          <iframe
            title="github"
            className={styles.github}
            src="https://ghbtns.com/github-btn.html?user=frontend-collective&repo=react-sortable-tree&type=star&count=true"
            frameBorder="0"
            scrolling="0"
            width="110px"
            height="20px"
          />
        </Navbar.Header>
        <Nav>
          <NavItem
            eventKey={1}
            href="https://github.com/frontend-collective/react-sortable-tree#props"
          >
            Docs
          </NavItem>
          <NavItem
            eventKey={2}
            href="https://frontend-collective.github.io/react-sortable-tree"
          >
            Storybook
          </NavItem>
          <NavItem
            eventKey={3}
            href="https://github.com/frontend-collective/react-sortable-tree"
          >
            GitHub
          </NavItem>
        </Nav>
      </Navbar>
    );
  }
}
