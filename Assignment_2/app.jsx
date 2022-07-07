/* 
  Name: Lo Tsz Yuk
  SID: 1155 133 625

*/

const data = [
  {filename: "cuhk-2013.jpg", year:2013, remarks: "Sunset over CUHK"},
  {filename: "cuhk-2017.jpg", year:2017, remarks: "Bird's-eye view of CUHK"},
  {filename: "sci-2013.jpg", year:2013, remarks: "The CUHK Emblem"},
  {filename: "shb-2013.jpg", year:2013, remarks: "The Engineering Buildings"},
  {filename: "stream-2009.jpg", year:2009, remarks: "Nature hidden in the campus"},
];
const {BrowserRouter, Routes, Route, Link} = ReactRouterDOM;
const {useMatch, useParams, useLocation} = ReactRouterDOM;
var interval=null; /*for setInterval */
    
/* Main body*/
class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <ul>
            <LongLink to="/" label="Home" />
            <LongLink to="/images" label="Images" />
            <LongLink to="/slideshow" label="Slideshow" />
          </ul>
          <Title name={this.props.name}/>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/images" element={<Images/>} />
            <Route path="/slideshow" element={<Slides/>} />
            <Route path="*" element={<NoMatch/>} />
          </Routes>
        </div>
      </BrowserRouter>
    );
  }
}

class Title extends React.Component {
  render() {
    return (
        <header className="bg-warning">
          <h1 className="display-4 text-center">{this.props.name}</h1>
        </header>
      );
    }
  }

class Gallery extends React.Component {
  render() {
    return (
      <main className="container">
        <h2>Images</h2>
        {data.map((file,index) => <FileCard i={index} key={index}/>)}
      </main>
    );
  }
}

class Slideshow extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      CurrentImageID:0,
      CurrentInterval:1500,
    };
  }

  fast(e){
    let speed = this.state.CurrentInterval;
    let index = this.state.CurrentImageID;
    if (this.state.CurrentInterval>250){
      speed=speed-250;
      this.setState({CurrentInterval: speed});
    }
    clearInterval(interval)
    interval = setInterval(() =>{
      index += 1;
      if (index == data.length){
        index = 0;
      }
      this.setState({CurrentImageID: index});
    }, this.state.CurrentInterval)
  }

  slow(e){
    let speed = this.state.CurrentInterval;
    let index = this.state.CurrentImageID;
    speed=speed+250;
    this.setState({CurrentInterval: speed});

    clearInterval(interval)
    interval = setInterval(() =>{
      console.log("Inside");
      index += 1;
      if (index == data.length){
        index = 0;
      }
      this.setState({CurrentImageID: index});
    }, this.state.CurrentInterval)
  }

  start_and_stop(i,e){
    /* i == 1 means start is clicked; 0 means stop is clicked*/
    if(i==0){
      clearInterval(interval);
      return;
    }

    let index = this.state.CurrentImageID;
      interval = setInterval(() =>{
      index += 1;
      if (index == data.length){
        index = 0;
      }
      this.setState({CurrentImageID: index});
    }, this.state.CurrentInterval)
  }


  render(){
    return(
    <div className="container" >
      <h2>Slideshow</h2>
      <div id="carouselExampleControls" className="carousel slide" data-ride="carousel">
          <div className="carousel-inner" style={{paddingLeft:'10%', paddingRight:'10%'}}>
            <div className="carousel-item active" >
              <img src={"images/"+data[this.state.CurrentImageID].filename} className="d-block w-100"/>
              <div className="container" style={{textAlign: "center"}}>{data[this.state.CurrentImageID].remarks}</div>
            </div>
          </div>

          <div style={{margin: "0",position: "absolute",left: "50%",msTransform: "translate(-50%, -50%)",transform: "translate(-50%, -50%)", paddingTop:'5%'}}>
            <button type="button" className="btn btn-primary btn-sm" style={{width:'10vh', marginLeft:'1vh', marginRight:'1vh'}} onClick={(e) => this.start_and_stop(1,e)}>Start</button>
            <button type="button" className="btn btn-secondary btn-sm" style={{width:'10vh', marginLeft:'1vh', marginRight:'1vh'}} onClick={(e) => this.start_and_stop(0,e)}>Stop</button>
            <button type="button" className="btn btn-primary btn-sm" style={{width:'10vh', marginLeft:'1vh', marginRight:'1vh'}} onClick={(e) => this.fast(e)}>Faster</button>
            <button type="button" className="btn btn-secondary btn-sm" style={{width:'10vh', marginLeft:'1vh', marginRight:'1vh'}} onClick = {(e)=>this.slow(e)}>Slower</button>
          </div>
      </div>
    </div>  
    )
  }
}



class FileCard extends React.Component{
  constructor(props) {
    super(props);
    this.state = { selected: -1 };
    {/* this syntax should only be used in the constructor, and otherwise this.setState() must be used */}
  }

  handleHover(index, e) {
    if (this.state.selected != index){
      this.setState({selected: index});
    }else{
      this.setState({selected: -1})
    }    
  }

  handleleave(index, e) {
    if (this.state.selected == index){
      this.setState({selected: -1});
    }   
  }

  render(){
    let i = this.props.i;
    return(
      <div className="card d-inline-block m-2" style={{width:this.state.selected==i ? '220' :200}} onMouseOver={(e) => this.handleHover(i,e)} onMouseOut ={(e) => this.handleHover(i,e)}>
        <img src={"images/"+data[i].filename} className="w-100" />
        <div className="card-body">
          <h6 className="card-title">{data[i].filename}</h6>
          <p className="card-text">{data[i].year}</p>
          { this.state.selected==i && <p className="card-text">{data[i].remarks}</p> }
        </div>
      </div>
    )
  }
}
      
function LongLink({label, to}) {
  let match = useMatch({path: to});
  return (
    <li className={match ? "active" : ""}>
        {match && "> "}
        <Link to={to}>{label}</Link>
    </li>
  );
}
      
class Home extends React.Component {
  render() {
    return (
    <div className="container">
      <h2>Home</h2>
      <img src={"images/tree_diagram.jpg"} className="d-block w-100"/>
    </div>
    )
  }
}
                
class Images extends React.Component {
  render() {
    return (
    <Gallery/>
    )
  }
}

class Slides extends React.Component {
  render() {
    return(
      <Slideshow/>
    )
  }
}
      
function NoMatch() {
  let location = useLocation();
  return (
    <div>
      <h3>No match for <code>{location.pathname}</code></h3>
    </div>
  );
}

ReactDOM.render(<App name="CUHK Pictures"/>,document.querySelector("#app"));
