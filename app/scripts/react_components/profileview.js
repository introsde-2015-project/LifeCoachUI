var ProfileView = React.createClass({
    getInitialState: function () {  
      return {
        activeTab: "timeline"
      }
    },
    componentDidMount: function() {
        $('ul.tabs').tabs();
    },
    changeTab: function(tabName) {
      this.setState({
        activeTab: tabName
      });
    },
    render: function () {
      return (
        <div className="row">
          <div className="col s12">
            <ul className="tabs">
              <li className="active tab col s4"><a href="#timeline" onClick={this.changeTab.bind(this, "timeline")}>TIMELINE</a></li>
              <li className="tab col s4"><a href="#stats" onClick={this.changeTab.bind(this, "stats")}>STATISTICS</a></li>
              <li className="tab col s4"><a href="#goals" onClick={this.changeTab.bind(this, "goals")}>GOALS</a></li>
            </ul>
          </div>
          <div className="tab-container">
            <div id="timeline" className="col s12">
              <TimelineView personId={this.props.personId}/>
            </div>
            <div id="stats" className="col s12">
              <StatsView personId={this.props.personId}/>
            </div>
            <div id="goals" className="col s12">
              <GoalsView personId={this.props.personId}/>
            </div>
          </div>
        </div>
      );
    }
});