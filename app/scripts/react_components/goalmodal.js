var GoalModal = React.createClass({
	 getInitialState: function () {  
      return {
        goalType: "",
        goalValue: "",
        spinner: false
      }
    },
    onGoalTypeChange: function(event) {
	this.setState({
        goalType: event.target.value
      });
	},
	onValueChange: function(event) {
      this.setState({
        goalValue: event.target.value
      });
    },
    createNewGoal: function(value, goalType) {
      var goal = {
        "value" : + value,
        "goalName" : goalType
      }
      return JSON.stringify(goal);
    },
    handleSubmit: function(event) {
		event.preventDefault();
		this.setState({
    		spinner:true
    	}, function() {
    		this.postGoal();
    	});
    },
    postGoal: function() {
    	var self = this;
    	var goal = this.createNewGoal(this.state.goalValue, this.state.goalType);
    	$.ajax({
	      url:processBaseUrl+"persons/" + this.props.personId + "/goals",
	      type:"POST",
	      data:goal,
	      contentType:"application/json; charset=utf-8",
	      dataType:"json",
	      timeout: 10000,
	      success: function(data){
	      	self.setState({
	      		spinner: false
	      	}, function() {
		      	$('#goalModal').closeModal();
	        	self.props.cbLoadData();
	      	})
	      },
	      fail: function() {
	      	console.log("Failed to add goal");
	      	self.setState({
	      		spinner: false
	      	}, function() {
		      	$('#goalModal').closeModal();
	      	})
	      }
	    })
    },
    checkOnlyNumbers: function(event) {
      if ($.inArray(event.which, [46, 8, 9, 27, 13, 110, 190]) !== -1) {
        return;
      } else if (event.which < 48 || event.which > 57) {
        event.preventDefault();
      }
    },
    closeModal: function() {
    	$('#goalModal').closeModal();
    },
	render: function () {
		var goalTypes = this.props.goalTypes;

		var goalOptions = $.map(goalTypes, function(goalType, index) {
			return (
				<option key={index} className="goalOption" value={goalType}>{goalType}</option>
			)
		});

		return (
			<div id="goalModal" className="modal">
				<div className="modal-content">
					<a className="modal-close-btn" onClick={this.closeModal}><i className="material-icons">clear</i></a>
					<div className="col s12">
						<h4>Add new goal</h4>
					</div>
					<form onSubmit={this.handleSubmit}>
						<div className="col s12 m6 l6">
							<label>Goal type</label>
							<select value={this.state.goalType} onChange={this.onGoalTypeChange} className="browser-default" required aria-required="true">
								<option value="" disabled>Choose goal</option>
								{goalOptions}
							</select>
						</div>
						<div className="input-field col s12 m6 l6">
							<input id="goalValue" placeholder="Value in numbers" type="number" className="validate" onKeyDown={this.checkOnlyNumbers} value={this.state.goalValue} onChange={this.onValueChange} required aria-required="true"/>
							<label className="active" htmlFor="goalValue">Goal value</label>
						</div>
						<div className="col s12 modalBtnContainer">
							<button disabled={this.state.spinner} className="btn waves-effect waves-light" type="submit">
								OK<i className="material-icons right">send</i>
							</button>
						</div>
						{this.state.spinner ? <Spinner overlay={true}/> : null}
					</form>
				</div>
			</div>
		);
	}
});