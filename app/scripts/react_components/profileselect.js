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
         <li key={personIndex} className="collection-item avatar" onClick={this.selectPerson.bind(this, person.idPerson)}>
            <img src={person.imageUrl} alt="Profile image" className="circle"/>
            <span className="title">{person.firstname + " " + person.lastname}</span>
            <p>Birthdate: {person.birthdate}</p>
          </li>
        );
      }, this);

      return (
          <div className="profileSelect">
            <h3>Choose your profile</h3>
            <div className="card-panel">
              <ul className="collection">
                {personProfiles}
              </ul>
            </div>
          </div>
      );
    } 
});