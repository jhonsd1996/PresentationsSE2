import React, { Component } from 'react'

class Question extends Component {
    
    render(){
        
        const item = this.props.item
        return(
            <div>
                <h4>{item.question}</h4>
                <h6>{item.author}</h6>
            </div>
        
        )
    }
    
}
export default Question;