
var Header = React.createClass({
  render: function() {
    return (
      <nav>
        <div className="nav-wrapper">
          <div className="brand-logo left"><a href="#" onClick={this.props.skipStatsSet}>LifeCoach</a></div>
          <ul className="right">
            {this.props.personId != null ? <li onClick={this.props.resetPerson}><a><i className="material-icons">exit_to_app</i></a></li> : null}
            <li><a onClick={this.props.openAbout}><i className="material-icons">help</i></a></li>
          </ul>
        </div>
      </nav>
    );
  }
});