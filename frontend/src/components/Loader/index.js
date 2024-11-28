import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import './index.css';

class Loader extends Component {

  constructor(props) {
    super(props)
    this.state = { }
  }

  render() {
    return (
      <>
        {/* <div className='col-12 loader-spinner'>
          <i className='fa fa-spinner fa-spin fa-5x fa-fw' />
        </div> */}
        <div className="loading">Loading&#8230;</div>
      </>
    )
  }
}

export default connect(null, null)(Loader);