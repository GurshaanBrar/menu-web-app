import React, { Component } from 'react';
import Board from 'react-trello';
import { Image } from 'react-bootstrap';


export default class App extends Component {
  render() {
    return ( 
        <Board data={data} 
            customCardLayout 
            draggable
            style={{"backgroundColor": "inherit"}}
        >
            <CustomCard/>
        </Board>
    )
  }
}

const CustomCard = props => {
    return (
      <div style={{padding:"2%", display: 'flex', flexDirection: 'row'}}>
        <Image style={{width:100, height: 100}} src={props.uri}/>
        <div style={{paddingLeft: '2%'}}>
            <div style={{fontWeight: 'bold'}}>{props.name}</div>
            <div>$ {props.price}</div>
        </div>
      </div>
    )
  }
  
  const data = {
    lanes: [
      {
        id: '1',
        title: 'Food Menu',
        cards: [
          {
            id: '1',
            name: "Chubby Chicken",
            price: 22,
            uri: "https://web.aw.ca/i/items/?i=teen-burger&d=teen-burger&cat=burgers&lang=teen-burger-en"
          },
          {
            id: '2',
            name: "Poutine",
            price: 10,
            uri: "https://www.seasonsandsuppers.ca/wp-content/uploads/2014/01/new-poutine-1-500x500.jpg"
          }
        ]
      },
      {
        id: '2',
        title: 'Drink Menu',
        cards: [
          {
            id: '3',
            name: "Coffee",
            price: 5,
            uri: "https://www.nespresso.com/ncp/res/uploads/recipes/1900px_Global_OL_ALL_Coffee%20Moment_Recipe_Latte%20Macchiato_2017_2019.jpg"
          },
          {
            id: '4',
            name: "Cosmo",
            price: 22,
            uri: "https://cdn.liquor.com/wp-content/uploads/2017/09/01105619/cosmopolitan-1200x628-social-Molly.jpg"
          }
        ]
      },
    ]
  }