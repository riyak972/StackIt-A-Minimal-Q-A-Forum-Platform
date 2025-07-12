import React from 'react';
import { connect } from 'react-redux';
import { Alert } from 'react-bootstrap';

const CustomAlert = ({ alerts }) => 
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map(alert => (
    <Alert 
      key={alert.id} 
      variant={alert.alertType}
      className="fixed-top mx-auto mt-3"
      style={{ width: '80%', zIndex: 1100 }}
    >
      {alert.msg}
    </Alert>
  ));

const mapStateToProps = state => ({
  alerts: state.alert
});

export default connect(mapStateToProps)(CustomAlert);