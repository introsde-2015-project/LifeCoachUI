var MeasureModal = React.createClass({
	getInitialState: function() {
		return {
			measureType: "",
			measureValue: ""
		}
	},
	onMeasureTypeChange: function(event) {
	this.setState({
        measureType: event.target.value
      });
	},
	onValueChange: function(event) {
      this.setState({
        measureValue: event.target.value
      });
    },
    createNewMeasure: function(value) {
      var measure = {
        "value" : + value
      }
      return JSON.stringify(measure);
    },
    handleSubmit: function(event) {
    	console.log("handleSubmit");
    	var self = this;
		event.preventDefault();
    	var measure = this.createNewMeasure(this.state.measureValue);
    	console.log(measure);
		$.ajax({
	      url:processBaseUrl+"persons/" + this.props.personId + "/" + this.state.measureType,
	      type:"POST",
	      data:measure,
	      contentType:"application/json; charset=utf-8",
	      dataType:"json",
	      success: function(data){
	      	console.log("success");
	      	console.log(data);
	      	$('#measureModal').closeModal();
	        self.props.cbLoadData();
	      },
	      fail: function() {
	      	console.log("fail");
	      	$('#measureModal').closeModal();
	      }
	    })
    },
    closeModal: function() {
    	$('#measureModal').closeModal();
    },
	render: function () {
		var measureTypes = this.props.measureTypes;

		var measureOptions = $.map(measureTypes, function(measureType, index) {
			return (
				<option key={index} className="measureOption" value={measureType}>{measureType}</option>
			)
		});

		return (
			<div id="measureModal" className="modal">
				<div className="modal-content">
					<a className="modal-close-btn" onClick={this.closeModal}><i className="material-icons">clear</i></a>
					<div className="col s12">
						<h4>Add new measure</h4>
					</div>
					<form onSubmit={this.handleSubmit}>
						<div className="col s12 m6 l6">	
							<label>Measure type</label>
							<select value={this.state.measureType} onChange={this.onMeasureTypeChange} className="browser-default" required aria-required="true">
								<option value="" disabled>Choose measure</option>
								{measureOptions}
							</select>
						</div>
						<div className="input-field col s12 m6 l6">
							<input id="measureValue" placeholder="Value in numbers" type="number" className="validate" value={this.state.measureValue} onChange={this.onValueChange} required aria-required="true"/>
							<label className="active" htmlFor="measureValue">Measure value</label>
						</div>
						<div className="col s12 modalBtnContainer">
							<button className="btn waves-effect waves-light" type="submit">
								OK<i className="material-icons right">send</i>
							</button>
						</div>
					</form>
				</div>
			</div>
		);
	}
});