import React, { Component } from 'react';
import { Container } from 'reactstrap';

export class Home extends Component {
  static displayName = Home.name;

  render () {
    return (
      <Container>
        <h1>Home</h1>
        <h4>Home</h4>
        <p>Home page</p>
      </Container>
    );
  }
}
