var StatsView = React.createClass({
    getInitialState: function () {  
      return {
        dataInit: false,
        measureTypes: [],
        measuresData: {}
      }
    },
    componentWillReceiveProps: function(nextProps) {
      if (!this.state.dataInit) {
        this.loadMeasureData();
      }
    },
    componentDidUpdate: function() {
    },
    setDataInit: function(dataInit) {
      this.setState({
        dataInit: dataInit
      });
    },
    loadMeasureData: function() {
      var self = this;
      var measureTypesUrl = logicBaseUrl + "measuretypes";
      var measureBaseUrl = logicBaseUrl + "persons/" + this.props.personId + "/";
      $.getJSON(measureTypesUrl, function(measureTypes) {
        var measureJsonArray = {};
        var count = 0;
        
        for (var i = 0; i < measureTypes.length; i++) {
            $.ajax({
                'async': false,
                'global': false,
                'url': measureBaseUrl+measureTypes[i],
                'success': function (measureData) {
                    measureJsonArray[measureTypes[i]] = measureData;
                    count++;
                    if (count == measureTypes.length) {
                      self.setState({
                        measureTypes: measureTypes,
                        measuresData: measureJsonArray,
                        dataInit: true
                      }, function() {
                        $('.collapsible').collapsible();
                        $('.modal-trigger').leanModal();
                      });
                    }
                }
            });
        }
      });  
    },
    openModal: function() {
      $('#measureModal').openModal();
    },
    render: function () {
      var modal = this.state.modalOn;
      var measuresData = this.state.measuresData;
      var measureTypes = this.state.measureTypes;
      var initMeasuresData = Object.keys(measuresData).length > 0;
      if (!initMeasuresData) {
        return (
          <div></div>
        )
      }

      var measureTables = $.map(measuresData, function(measureData, measureName) {

        var measureRows = $.map(measureData, function(measureObj, index) {
          return (
            <tr key={index}>
              <td>{measureObj.value}</td>
              <td>{measureObj.created}</td>
              <td></td>
            </tr>
          )
        })

        return (
            <li key={measureName}>
              <div className="collapsible-header">
                <i className="material-icons">filter_drama</i><p>{measureName}</p>
                {/*<a className="btn-floating waves-effect waves-light"><i className="material-icons">add</i></a>*/}
              </div>
              <div className="collapsible-body">
                <table>
                  <thead>
                    <tr>
                      <th>Value</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {measureRows}
                  </tbody>
                </table>
              </div>
            </li>
        )
      })
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
          <ul className="collapsible" data-collapsible="expandable">
            {measureTables}
          </ul>
          <MeasureModal personId={this.props.personId} cbDataInit={this.setDataInit} measureTypes={measureTypes}/>
        </div> 
      );
    }
});