import React from 'react';

class AboutDatabase extends React.Component {
  render() {
    return <div className="App-page App-page-about">
      <h2>{this.props.labels.pageTitle}</h2>
      <div className="jumbotron">
        <p>
          {this.props.labels.para01}
        </p>
        <p>
          {this.props.labels.para02}
        </p>
        <p>
          {this.props.labels.para03s1}
          <a href="http://www.ocmc.org/" target="_blank"> (OCMC)</a>.
        </p>
        <p>
          {this.props.labels.para03s2}
        </p>
        <p>
          {this.props.labels.para04s1}
          <a href="http://www.agesinitiatives.org/" target="_blank"> AGES Initiatives, Inc.</a>
        </p>
        <p>
          {this.props.labels.para04s2}
          <a href="http://www.agesinitiatives.com/dcs/public/dcs/dcs.html" target="_blank"> Digital Choir Stand</a>.
        </p>
        <p>
          {this.props.labels.para04s3}
        </p>
      </div>
      <h2>{this.props.labels.acknowledgements}</h2>
      <div className="jumbotron">
        <p>{this.props.labels.ackPara01s1} <a href="http://www.agesinitiatives.com/dcs/public/dcs/about.html" target="_blank">{this.props.labels.ackPara01s2}</a> {this.props.labels.ackPara01s3}</p>
        <p/>
        <p>{this.props.labels.ackPara02s1} <a href="http://ccat.sas.upenn.edu/gopher/text/religion/biblical/lxxmorph/" target="_blank">{this.props.labels.website}</a>.</p>
        <p/>
        <p>{this.props.labels.ackPara03s1} <a href="http://ebible.org/find/show.php?id=eng-webbe" target="_blank">{this.props.labels.website}</a>.</p>
        <p/>
        <p>{this.props.labels.ackPara04s1} <a href="http://ebible.org/eng-lxx2012/" target="_blank">{this.props.labels.website}</a>.</p>
      </div>
    </div>
  }

}

AboutDatabase.propTypes = {
  labels: React.PropTypes.object.isRequired
};

AboutDatabase.defaultProps = {

};

export default AboutDatabase;
