import React, { component } from 'react'
import axios from 'Axios'

class MiniForm extends Component{
    constructor(props){
        super(props)
        this.state = {
            author: ''
            body: ''
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handlesubmit.bind(this)
    }
    handleChange(event){
        const target = event.target
        const value = target.value
        const name = target.id
        this.setState({
            [name]: value
        })
    }
    handleSubmit(event){
        event.preventDefault()
        const question_id = this.props.question_id
        url = ''
        if(question_id){
            url = 'http://question-api.herokuapp.com/questions/'+question_id+'/answers'
            axios.post(url,{
                author: {this.state.author}
                question: {this.state.body}
            }).then((res) => {
                res.json()
            }).catch((error) => {
                console.log(error)
            })
        }
        
    }
    render(){
        return(
            <form onSubmit={this.handleSubmit}>
                <label htmlFor="author">Author:</label>
                <input id="author" type="text" onChange={this.handleChange}/>
                <label htmlFor="body">Author:</label>
                <input id="body" type="text" onChange={this.handleChange}/>
                
        )
    }
}