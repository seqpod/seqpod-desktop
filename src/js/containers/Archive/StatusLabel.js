import React, {Component} from 'react';
import PropTypes from 'prop-types';

export class StatusBadge extends Component {
  render() {
    return (
      <div className="status-badge">
        {this.renderIcon()}
      </div>
    );
  }
  renderIcon() {
    if (this.props.status == 'completed') {
      return (
        <div className="circle success">
          <span className="icon icon-check" />
        </div>
      );
    }
    if (this.props.status == 'ready') {
      return (
        <div className="circle" style={{backgroundColor:'cornflowerblue'}}>
          <span className="icon icon-clock" />
        </div>
      );
    }
    if (this.props.status == 'running') {
      return (
        <div className="circle" style={{backgroundColor:'coral'}}>
          <span className="icon icon-arrows-ccw spinning" />
        </div>
      );
    }
    if (this.props.status === '') { // FIXME: should be set by server
      return (
        <div className="circle" style={{backgroundColor:'orange'}}>
          <span className="icon icon-upload-cloud blinking" />
        </div>
      );
    }
    return (
      <div className="circle" style={{backgroundColor:'grey'}}>
        <span className="icon icon-minus" />
      </div>
    );
  }
  static propTypes = {
    status: PropTypes.string.isRequired,
  }
}

export default class StatusLabel extends Component {
  render() {
    const {started_at, finished_at, errors = []} = this.props.job;
    if (finished_at) {
      if (errors.length == 0) {
        return <span className="label success">Finished</span>;
      } else {
        return <span className="label danger">Errored</span>;
      }
    }
    if (started_at) {
      return <span className="label primary">Running</span>;
    }
    return <span className="label info">Waiting for worker node</span>;
  }
  static propTypes = {
    job: PropTypes.shape({
      started_at:  PropTypes.string,
      finished_at: PropTypes.string,
      errors:      PropTypes.array,
    })
  }
}
