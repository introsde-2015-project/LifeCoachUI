var ProfileView = React.createClass({
    getInitialState: function () {  
      return {
        activeTab: "timeline"
      }
    },
    componentDidUpdate: function() {
      if (this.state.statsSet) {
        this.props.callback(true);
      }
    },
    changeTab: function(tabName) {
      this.setState({
        activeTab: tabName
      });
    },
    render: function () {
      return (
        <div>
            <ul className="nav nav-pills nav-justified" role="tablist">
              <li role="presentation" className="active" onClick={this.changeTab.bind(this, "timeline")}><a href="#timeline" role="tab" data-toggle="tab">TIMELINE</a></li>
              <li role="presentation" onClick={this.changeTab.bind(this, "stats")}><a href="#stats" role="tab" data-toggle="tab">STATISTICS</a></li>
              <li role="presentation" onClick={this.changeTab.bind(this, "goals")}><a href="#goals" role="tab" data-toggle="tab">GOALS</a></li>
            </ul>
            {/*Wrapper for all dynamically changing tab content, each navigation link has it's own tab content*/}
            <div className="tab-content">
              <div role="tabpanel" className="tab-pane active" id="timeline">
                <TimelineView personId={this.props.personId} timeline={this.props.timeline}/>
              </div>
              <div role="tabpanel" className="tab-pane" id="stats">
                <StatsView personId={this.props.personId}/>
              </div>
              <div role="tabpanel" className="tab-pane" id="goals">
                <GoalsView personId={this.props.personId}/>
              </div>
            </div>
        </div> 
      );
    }
});