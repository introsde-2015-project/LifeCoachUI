var GoalsView = React.createClass({
    getInitialState: function () {  
      return null;
    },
    componentDidMount: function() {
      //this.loadGoalData();
    },
    deleteGoal: function(goalId) {
      var self = this;
      var goalUrl = logicBaseUrl + "persons/" + this.props.personId + "/goals/" + goalId;
      $.ajax({
          url: goalUrl,
          type: 'DELETE',
          success: function(result) {
          }
      });
    },
    openModal: function() {
      $('#goalModal').openModal();
    },
    render: function () {
      var self = this;
      var goalData = this.props.goalData;

      var goalRows = goalData.map(function(goalObj, index) {
        return (
          <tr key={index}>
            <td>{goalObj.goalName}</td>
            <td>{goalObj.value}</td>
            <td>{goalObj.date}</td>
            <td>
              <a href="#" onClick={this.deleteGoal.bind(this, goalObj.gid)}><i className="material-icons red-icon">clear</i></a>
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
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {goalRows}
            </tbody>
          </table>
          <GoalModal personId={this.props.personId} cbDataInit={this.setDataInit} goalTypes={this.props.goalTypes} cbLoadData={this.props.cbLoadData}/>
        </div>
      );
    }
});