import React, {Component} from 'react';
import style from './App.css'
import {Button} from 'react-bootstrap'
import Gallery from './Gallery.jsx'
import {FormControl,FormGroup,InputGroup,Glyphicon} from 'react-bootstrap'

const MAX_CHILDS=20;

class App extends Component{

    constructor(props) {
        super(props);
        this.state={
            lastQuery:"",
            query:"",
            after:"",
            images:[]
        }
    }

    setResponseChildToMaxChilds(response){
        while (response.data.children.length>MAX_CHILDS) {
            response.data.children.pop();
        }
        let lastChildIndex=response.data.children.length-1;
        return response.data.children[lastChildIndex].data.name;

    }

    handleResponse(response){
        let after="";
        let images=this.state.query!==this.state.lastQuery? []: this.state.images;
        let newImages=[];
        let query=this.state.query;
        if (response.data!==undefined) {
            after = this.setResponseChildToMaxChilds(response);
            newImages = response.data.children.map(child => {
                let data = child.data;
                return {url: data.thumbnail, link: data.permalink, title: data.title};
            });
        }
        images=[...images,...newImages];
        this.setState({after,images,query,lastQuery:this.state.query});
    }

    search=()=>{
        let currentAfter=this.state.query!==this.state.lastQuery? null : this.state.after;
        window.reddit.hot(this.state.query,this.state.query)
            .limit(MAX_CHILDS)
            .after(currentAfter)
            .fetch((response) => {
                    this.handleResponse(response);
                }
                ,(error) => {
                    console.log(error);
                    this.setState({ lastQuery:"",
                        query:this.state.query,
                        after:"",
                        images:[]})
                });
    }

    render(){
        return (
            <div className={style.app}>
                <div className={style["app-title"]}>Photo Gallery</div>
                <FormGroup className={style["search-bar"]}>
                    <InputGroup bsSize="large">
                        <FormControl
                            type='text'
                            placeholder="Search for subrredit photos"
                            value={this.state.query}
                            onChange={(event) =>this.setState({query:event.target.value})}
                            onKeyPress={(event)=> event.key==="Enter"? this.search():''}
                        />
                        <InputGroup.Addon >
                            <Glyphicon className={style["search-icon"]} glyph='search'  onClick={this.search}/>
                        </InputGroup.Addon>
                    </InputGroup>
                </FormGroup>
                <Gallery images={this.state.images}/>
                <Button className={style["button-next"]} bsStyle='primary' bsSize='large' disabled={this.state.images.length===0} onClick={this.search}> load more </Button>
            </div>
        )
    }
}

export default App;