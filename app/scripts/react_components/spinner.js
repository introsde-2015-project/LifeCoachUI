var Spinner = React.createClass({
  render: function () {
      return (
        <div className={this.props.overlay ? "overlay-spinner" : "spinner"}>
          <div className="loader-screen">
            <div className="preloader-wrapper big active">
              <div className="spinner-layer">
                <div className="circle-clipper left">
                  <div className="circle"></div>
                </div><div className="gap-patch">
                  <div className="circle"></div>
                </div><div className="circle-clipper right">
                  <div className="circle"></div>
                </div>
              </div>
            </div>
          </div>  
        </div>
      );
  } 
});