var ProfileSelect = React.createClass({
    getInitialState: function () {  
    return null;  
    },
    // Create test image to test state.src. If that img return error, set state.src empty
    selectPerson: function(personId) {
      this.props.callback(personId);
    },
    render: function () {
      var self = this;
      var personProfiles = this.props.personsData.map(function(person, personIndex) {
        return (
          <button key={personIndex} type="button" className="list-group-item" onClick={this.selectPerson.bind(this, person.idPerson)}>
            <div className="media">
              <div className="media-left">
                <a href="#">
                  <img className="media-object" src="" alt="..."/>
                </a>
              </div>
              <div className="media-body">
                <h4 className="media-heading">{person.firstname + " " + person.lastname} </h4>
                Birthdate: {person.birthdate}
              </div>
            </div>
          </button>
        );
      }, this);

      return (
          <div className="profileSelect">
            <h3>Choose your profile</h3>
            <div className="list-group">
              {personProfiles}
            </div>
          </div>
      );
    } 
});