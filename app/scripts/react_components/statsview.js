var StatsView = React.createClass({
    getInitialState: function () {
      return {
        activeMeasure: "weight"
      }  
    },
    componentDidMount: function() {
      $('.collapsible').collapsible({});
    },
    openModal: function() {
      $('#measureModal').openModal();
    },
    setActiveMeasure: function(measure) {
      this.setState({
        activeMeasure: measure
      });
    },
    render: function () {
      var measureData = this.props.measuresData[this.state.activeMeasure];
      var measures = $.map(this.props.measureTypes, function(measureName, index) {
        return (
          <li key={index} className={this.state.activeMeasure == measureName ? "active" : null}><a onClick={this.setActiveMeasure.bind(this, measureName)}>{measureName}</a></li>
        )
      }.bind(this));

      var measureView;
      if (measureData.length > 0) {
        measureView = <Chart data={measureData}/>
      } else {
        measureView = <div className="measure-view">No measures added yet.</div>
      }

      return (
        <div className="statsView">
          <nav className="sub-nav">
            <div className="nav-wrapper">
              <div className="brand-logo left">Your current statistics</div>
              <ul className="right">
                <li><a onClick={this.openModal} className="btn-floating waves-effect waves-light"><i className="material-icons">add</i></a></li>
              </ul>
            </div>
          </nav>
          <ul className="pagination">
            {measures}
          </ul>
          {measureView}
          <MeasureModal personId={this.props.personId} cbLoadData={this.props.cbLoadData} measureTypes={this.props.measureTypes}/>
        </div>
      )
    }
});