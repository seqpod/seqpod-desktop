import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {api_status} from '../../actions/api';

import SettingSection from '../../components/settings/SettingSection';
import SettingRow     from '../../components/settings/row/SettingRow';

import AddNewWorkflow from './AddNewWorkflow';
import AddedWorkflows from './AddedWorkflows';
import Workflow from '../../models/Workflow';

@connect(null, {
  api_status,
})
export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      server: {},
      _ts: Date.now(),
    };
  }
  componentDidMount() {
    this.props.api_status().then(server => this.setState({server}));
    // console.log(this.context.router);
  }
  render() {
    return(
      <div>

        <SettingSection title="Workflow Registry">
          <SettingRow title="Add New Workflow">
            <AddNewWorkflow refresh={() => this.setState({_ts:Date.now()})} />
          </SettingRow>
          <SettingRow title="Registered Workflows">
            <AddedWorkflows workflows={Workflow.list()} ts={this.state._ts} />
          </SettingRow>
        </SettingSection>

        <SettingSection title="AWS Cluster Settings">
          <SettingRow title="Server Version">
            <h3 style={{fontStyle:'italic'}}>{this.state.server.version}</h3>
          </SettingRow>
        </SettingSection>
      </div>
    );
  }
  static propTypes = {
    api_status: PropTypes.func.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object
  }
}
