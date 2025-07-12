import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../../actions/auth';
import { Navbar, Nav, Button, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

const CustomNavbar = ({ auth: { isAuthenticated, user }, logout, notifications }) => {
  const authLinks = (
    <>
      <Nav.Link as={Link} to="/notifications" className="position-relative">
        <FontAwesomeIcon icon={faBell} />
        {notifications.unreadCount > 0 && (
          <Badge pill variant="danger" className="position-absolute" style={{ top: '-5px', right: '-5px' }}>
            {notifications.unreadCount}
          </Badge>
        )}
      </Nav.Link>
      <Nav.Link as={Link} to="/ask">
        <Button variant="outline-light">Ask Question</Button>
      </Nav.Link>
      <Nav.Link onClick={logout}>
        <Button variant="outline-light">Logout</Button>
      </Nav.Link>
    </>
  );

  const guestLinks = (
    <>
      <Nav.Link as={Link} to="/login">Login</Nav.Link>
      <Nav.Link as={Link} to="/register">Register</Nav.Link>
    </>
  );

  return (
    <Navbar bg="primary" variant="dark" expand="lg" sticky="top">
      <Navbar.Brand as={Link} to="/">StackIt</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          {isAuthenticated ? authLinks : guestLinks}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

const mapStateToProps = state => ({
  auth: state.auth,
  notifications: state.notification
});

export default connect(mapStateToProps, { logout })(CustomNavbar);