var GoalsView = React.createClass({
    getInitialState: function () {  
      return {
        dataInit: false,
        goalData: {}
      }
    },
    componentDidMount: function() {
      //this.loadGoalData();
    },
    componentWillReceiveProps: function(nextProps) {
      if (!this.state.dataInit) {
        this.loadGoalData();
      }
    },
    setDataInit: function(dataInit) {
      this.setState({
        dataInit: dataInit
      });
    },
    loadGoalData: function() {
      var self = this;
      var goalsUrl = logicBaseUrl + "persons/" + this.props.personId + "/goals";
      $.getJSON(goalsUrl, function(goals) {
        self.setState({
          goalData: goals,
          dataInit: true
        }, function() {
          $('.modal-trigger').leanModal();
        });
      });
    },
    deleteGoal: function(goalId) {
      var self = this;
      var goalUrl = logicBaseUrl + "persons/" + this.props.personId + "/goals/" + goalId;
      $.ajax({
          url: goalUrl,
          type: 'DELETE',
          success: function(result) {
            self.setState({
              dataInit: false
            });
          }
      });
    },
    openModal: function() {
      $('#goalModal').openModal();
    },
    render: function () {
      var self = this;
      var goalData = this.state.goalData;
      var initGoalData = Object.keys(goalData).length > 0;
      if (!initGoalData) {
        return (
          <div></div>
        )
      }

      var goalRows = goalData.map(function(goalObj, index) {
        return (
          <tr key={index}>
            <td>{goalObj.goalName}</td>
            <td>{goalObj.value}</td>
            <td>{goalObj.created}</td>
            <td>
              <a href="#" onClick={this.deleteGoal.bind(this, goalObj.gid)}><i className="material-icons">clear</i></a>
            </td>
          </tr>
        );
      }, this);

      return (
        <div>
          <nav className="sub-nav">
            <div className="nav-wrapper">
              <div className="brand-logo left">Your goals</div>
              <ul className="right">
                <li><a onClick={this.openModal} className="btn-floating waves-effect waves-light"><i className="material-icons">add</i></a></li>
              </ul>
            </div>
          </nav>
          <table className="bordered">
            <thead>
              <tr>
                <th>Goal</th>
                <th>Value</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {goalRows}
            </tbody>
          </table>
          <GoalModal personId={this.props.personId} cbDataInit={this.setDataInit} goalData={goalData}/>
        </div>
      );
    }
});