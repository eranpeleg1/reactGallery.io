import React, {Component} from 'react';
import style from './Gallery.css'

class Gallery extends Component {
    render() {
        const HREF_PREFIX="https://www.reddit.com";
        return (
            <div className={style["gallery"]}>
                {this.props.images.map((image,key) => {
                        return(
                            <div key={key} className={style["image-wrapper"]}>
                                <a href={HREF_PREFIX+image.link} title={image.title} target="_blank" >
                                    <img className={style["image"]} src={image.url.startsWith("http")? image.url : "noimage.jpg" }/>
                                </a>
                            </div>
                        )
                    }
                )
                }
            </div>
        );
    }
}
export default Gallery;