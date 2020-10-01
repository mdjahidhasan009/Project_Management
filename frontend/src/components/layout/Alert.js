import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

//Layout of alert for whole application
const Alert = ({ alerts }) =>
    //Loop through all available alert and display that
    alerts !== null && alerts.length > 0 &&
    alerts.map(alert => (
        <div key={alert.id} className={`alert alert-${alert.alertType}`}>
            {alert.msg}
        </div>
    ));

Alert.prototype = {
    alerts: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
    alerts: state.alert
});

export default connect(mapStateToProps)(Alert);