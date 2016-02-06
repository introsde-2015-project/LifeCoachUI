
var Header = React.createClass({
  skipStatsSet: function() {
    this.props.skipStatsSet();
  },
  resetPerson: function() {
    this.props.resetPerson();
  },
  render: function() {
    return (
      <nav>
        <div className="nav-wrapper">
          <div className="brand-logo left" onClick={this.resetPerson}><a href="#">LifeCoach</a></div>
          <ul className="right">
            {this.props.personId != null ? <li onClick={this.skipStatsSet}><a><i className="material-icons">account_circle</i></a></li> : null}
            <li><a><i className="material-icons">help</i></a></li>
          </ul>
        </div>
      </nav>
    );
  }
});