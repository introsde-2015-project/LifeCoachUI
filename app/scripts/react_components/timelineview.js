var TimelineView = React.createClass({
    render: function () {
      var timelineData = this.props.timelineData;
      var timelines = $.map(timelineData, function(item, index) {
          var timelineString = item.JSONString.replace(/'/g, '"');
          var timelineObj = JSON.parse(timelineString);
          var timelineCard;
          var goalReached = timelineObj.goalReached;
          var measureType = timelineObj.measureType;
          if (timelineObj.mediaType == "joke") {
            timelineCard = <Joke joke={timelineObj}/>
          } else if (timelineObj.mediaType == "sleepMusic" || timelineObj.mediaType == "runningMusic") {
            timelineCard = <Music music={timelineObj}/>
          } else if (timelineObj.mediaType == "recipe") {
            timelineCard = <Recipe recipe={timelineObj}/>
          }

        return (
          <div className="row" key={index}>
            <div className="col s12 m12">
              <div className="card">
                <div className="card-top">
                  <div className="top-left">
                    <i className={goalReached ? "material-icons green-icon" : "material-icons red-icon"}>
                      {goalReached ? "trending_up" : "trending_down"}
                    </i>
                    {goalReached ? "Reached" : "Didn't reach"} goal: 
                    <span className="measure"> {measureType}</span>
                  </div>
                  <div className="top-right">{item.date}</div>
                </div>
                {timelineCard}
              </div>
            </div>    
          </div>
        )
      });

      var header;
      if (timelines.length == 0) {
        header = <p className="timeline-header">No actions yet. <br/>Go add your goals and daily results!</p>
      }

      return (
        <div className="timeline">
          {header}
          {timelines}
        </div> 
      );
    }
});





var Joke = React.createClass({
    render: function () {
      var joke = this.props.joke;
      return (
        <div className="card-body card-joke">
          <div className="card-header">
            {/*<i className="small material-icons left">free_breakfast</i>*/}
            Keep up the good work!
            {/*<i className="small material-icons right">local_dining</i>*/}
          </div>
          <div className="card-content">
            <blockquote dangerouslySetInnerHTML={{ __html: joke.joke }}></blockquote>
          </div>
        </div>
      );
    }
});

var Music = React.createClass({
    render: function () {
      var music = this.props.music;
      var spotifyUri = "https://embed.spotify.com/?uri="+music.uri;
      return (
        <div className="card-body card-music">
          <div className="card-header">
            {/*<i className="small material-icons left">free_breakfast</i>*/}
            {music.mediaType == "sleepMusic" ? 
              "This music will help you sleep better" :
              "Boost your next training with this tune!"}
            {/*<i className="small material-icons right">local_dining</i>*/}
          </div>
          <div className="card-content">
            <div className="col l6 m6 s12">
              <p><b>Artist:</b><br/>{music.artists[0].name}</p>
              <p><b>Track:</b><br/>{music.name}</p>
              <p><b>Album:</b><br/>{music.album.name}</p>
              <p><b>Source:</b><br/>Open track in <a href={music.external_urls.spotify}>Spotify</a></p>
            </div>
            <div className="col l6 m6 s12">
              <iframe src={spotifyUri} width="220" height="300" frameBorder="0" allowTransparency="true"></iframe>
            </div>
          </div>
        </div>
      );
    }
});

var Recipe = React.createClass({
    render: function () {
      var recipe = this.props.recipe;
      var ingredients = $.map(recipe.ingredientLines, function(item, index) {
        return (
          <li key={index}>{item}</li>
        )
      });
      return (
            <div className="card-body card-recipe">
              <div className="card-header">
                {/*<i className="small material-icons left">free_breakfast</i>*/}
                Healthy recipe for your next meal
                {/*<i className="small material-icons right">local_dining</i>*/}
              </div>
              <div className="card-image">
                <img src={recipe.image}/>
                <span className="card-title">{recipe.label}</span>
              </div>
              <div className="card-content">
                <p>Calories per serving: {Math.round(recipe.calories / recipe.yield)}</p>
                <ul>
                  Ingredients:
                  {ingredients}
                </ul>
                <p>Read more from: <a href={recipe.url}>{recipe.source}</a></p>
              </div>
            </div>
      );
    }
});