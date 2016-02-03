
var Header = React.createClass({
  skipStatsSet: function() {
    this.props.skipStatsSet();
  },
  resetPerson: function() {
    this.props.resetPerson();
  },
  render: function() {
    return (
      <div className="header">
        <ul className="nav nav-pills pull-right">
          {this.props.personId != null ? <li><span className="glyphicon glyphicon-user" onClick={this.skipStatsSet}></span></li> : null}
          {this.props.personId != null ? <li><span className="glyphicon glyphicon-log-out" onClick={this.resetPerson}></span></li> : null}
          <li><span className="glyphicon glyphicon-question-sign"></span></li>
        </ul>
        <h3>LifeCoach</h3>
      </div>

      
    );
  }
});