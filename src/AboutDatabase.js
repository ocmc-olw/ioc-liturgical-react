import React from 'react';
import PropTypes from 'prop-types';

class AboutDatabase extends React.Component {
  render() {
    return <div className="App-page App-page-about">
      <h2>{this.props.session.labels.pageAbout.pageTitle}</h2>
      <div className="jumbotron">
        <p>
          {this.props.session.labels.pageAbout.para01}
        </p>
        <p>
          {this.props.session.labels.pageAbout.para02}
        </p>
        <p>
          {this.props.session.labels.pageAbout.para03s1}
          <a href="https://www.ocmc.org/" target="_blank"> (OCMC)</a>.
        </p>
        <p>
          {this.props.session.labels.pageAbout.para03s2}
        </p>
        <p>
          {this.props.session.labels.pageAbout.para04s1}
          <a href="https://www.agesinitiatives.org/" target="_blank"> AGES Initiatives, Inc.</a>
        </p>
        <p>
          {this.props.session.labels.pageAbout.para04s2}
          <a href="https://www.agesinitiatives.com/dcs/public/dcs/dcs.html" target="_blank"> Digital Choir Stand</a>.
        </p>
        <p>
          {this.props.session.labels.pageAbout.para04s3}
        </p>
      </div>
      <h2>{this.props.session.labels.pageAbout.acknowledgements}</h2>
      <div className="jumbotron">
        <p>{this.props.session.labels.pageAbout.ackPara01s1} <a href="https://www.agesinitiatives.com/dcs/public/dcs/about.html" target="_blank">{this.props.session.labels.pageAbout.ackPara01s2}</a> {this.props.session.labels.pageAbout.ackPara01s3}</p>
        <p/>
        <p>{this.props.session.labels.pageAbout.ackPara02s1} <a href="https://ccat.sas.upenn.edu/gopher/text/religion/biblical/lxxmorph/" target="_blank">{this.props.session.labels.pageAbout.website}</a>.</p>
        <p/>
        <p>{this.props.session.labels.pageAbout.ackPara03s1} <a href="https://ebible.org/find/show.php?id=eng-webbe" target="_blank">{this.props.session.labels.pageAbout.website}</a>.</p>
        <p/>
        <p>{this.props.session.labels.pageAbout.ackPara04s1} <a href="https://ebible.org/eng-lxx2012/" target="_blank">{this.props.session.labels.pageAbout.website}</a>.</p>
        <p>{this.props.session.labels.pageAbout.ackHebrew} <a href="https://www.tanach.us/Tanach.xml" target="_blank">{this.props.session.labels.pageAbout.website}</a>.</p>
      </div>
    </div>
  }

}

AboutDatabase.propTypes = {
  session: PropTypes.object.isRequired
};

AboutDatabase.defaultProps = {

};

export default AboutDatabase;
