import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {replace} from 'react-router-redux';
import cn from 'classnames';

// Models
import Job from '../../../models/Job';

// Actions
import {
  api_workspace,
  api_upload,
  api_ready_job,
} from '../../../actions/api';

@connect(({form}) => form, {
  api_workspace,
  api_upload,
  api_ready_job,
  replace,
})
export default class Actions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sending: false,
    };
  }
  render() {
    const {files} = this.props.target;
    // TODO: more validation (But not here)
    const valid = files.length > 1;
    return (
      <div className="action-area">
        <div className="message">
        </div>
        <div className="buttons">
          <button
            className={cn('btn btn-large', (!valid || this.state.sending) ? 'btn-default' : 'btn-primary')}
            disabled={!valid || this.state.sending}
            onClick={this.onClickCommit.bind(this)}
          >Start</button>
        </div>
      </div>
    );
  }
  onClickCommit(ev) {
    this.setState({sending:true});
    ev.stopPropagation();
    ev.preventDefault();
    const {files} = this.props.target;
    this.props.api_workspace().then(({job}) => {
      return Promise.all([
        Promise.resolve(job),
        this.props.api_upload(job, files[0]),
        this.props.api_upload(job, files[1]),
      ]);
    }).then(([job]) => {
      return this.props.api_ready_job(job._id);
    }).then(({job}) => {
      this.setState({sending:false});
      Job.create(job);
      this.context.router.history.push(`/archive/${job._id}`);
    }).catch(err => {
      this.setState({sending:false});
      console.log('NG!', err);
    });
  }
  static propTypes = {
    target: PropTypes.shape({
      files: PropTypes.arrayOf(PropTypes.object).isRequired,
    }).isRequired,
    api_workspace: PropTypes.func.isRequired,
    api_upload:    PropTypes.func.isRequired,
    api_ready_job: PropTypes.func.isRequired,
    replace:       PropTypes.func.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object
  }
}