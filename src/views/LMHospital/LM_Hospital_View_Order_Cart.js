import React, { Component } from 'react';
import {Input, Button, Form, FormGroup, Table, Card, Row, Col, InputGroup, InputGroupAddon} from 'reactstrap';
import { Link } from 'react-router-dom';
import LM_Hospital_Update_Order_Cart from './LM_Hospital_Update_Order_Cart';

class LM_Hospital_View_Order_Cart extends Component {
  orderList= {
    orderId:'',
    date:new Date(),
    direct_hospital:[]
    };
    orderDetailList={
      odId:'',
      qty:'',
      state:'',
      medicine:[],
      lm_hospital_request_order:[]
    }

    constructor(props) {
      super(props);
      this.state = { 
        reg_no:'',
        orderCart:[],
        search:'',
        hospital:[],
        orderItem:this.orderList
      }
      this.state.reg_no=localStorage.getItem('reg_no');
      this.handleSubmit = this.handleSubmit.bind(this); 
    }

    async componentDidMount(){    
      fetch('/dhRequestOrder/viewcart/'+this.state.reg_no)
      .then(response => response.json())
      .then(data => this.setState({orderCart : data}));
    }

    updateSearch(event){
      this.setState({search:event.target.value.substr(0,20)});
    }
     
    updateQty(cartId,name,sr,qty){
      localStorage.setItem('orderCartId',cartId);
      localStorage.setItem('name',name);
      localStorage.setItem('sr',sr);
      localStorage.setItem('qty',qty);
      window.location.replace("/#/updateordercart");    
    }

    async handleSubmit(event){
      event.preventDefault();
      console.log('This is submit');
      let orderItem={...this.state.orderItem};
      orderItem['direct_hospital']=this.state.hospital;
      this.setState({orderItem});
      console.log('item',orderItem);

      await fetch('/dhRequestOrder/addOrder',{
        method:'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderItem),
      });

      const response= await fetch('/dhRequestOrder/nxtid');
      const body=await response.json();
      const id=body;
    }
    
    async deleteItem(id){
      await fetch('/dhRequestOrder/deleteCartItem/'+id,{
          method:'DELETE',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
      }).then(()=>{
          let updateItm=[...this.state.orderCart].filter(i=>i.cartId !== id);
          this.setState({orderCart:updateItm});
      });
      alert("Deleted....");
    }
 
    render() { 
      const {orderCart} =this.state; 
      let filteredData=orderCart.filter((order) => {
        return order.medicine.name.toLowerCase().indexOf(this.state.search.toLowerCase())!==-1;
      });

      let optionList=filteredData.map(drug => <option>{drug.medicine.name}</option>)
      
      let orderRow=filteredData.map(ordered=>
        <tr>
          <td><b>{ordered.medicine.sr_no}</b></td>
          <td><b>{ordered.medicine.name}</b></td>
          <td><b>{ordered.qty}</b></td>
          <td><Button color="primary" onClick={()=>this.updateQty(ordered.cartId,ordered.medicine.name,ordered.medicine.sr_no,ordered.qty)} >Update</Button></td>
          <td><Button color="danger" onClick={()=>this.deleteItem(ordered.cartId)}>Remove</Button></td>
        </tr>
      )
      return ( 
        <Form onSubmit={this.handleSubmit} method="POST"  encType="multipart/form-data" className="form-horizontal">  
          <FormGroup row>
            <Col md="4">
              <Link to='/sortbyqty'><Button color="secondary" style={{width:100}}>Back</Button></Link>{' '}{' '}{' '}{' '}
            </Col>
            <Col xs="12" md="7">
              <Button color="success"  type="submit" style={{width:300,height:50,font:170}}>Place Order</Button>
            </Col> 
          </FormGroup>
          <div>
            <Row>
              <Col>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <Button type="button" color="primary"><i className="fa fa-search"></i></Button>
                  </InputGroupAddon>
                  <Input type="test" id="batchNo" name="batchNo" list="datalist1"  onChange={this.updateSearch.bind(this)} placeholder="Search by Name"> </Input>
                    <datalist id="datalist1">
                      {optionList}
                    </datalist>
                </InputGroup>
                <br></br>
              </Col>
            </Row>
          </div>
          <Card>
            <Table className="mt-4">
              <thead style={{ backgroundColor: '#607D8B', color: 'white', borderRadius: '5px' }}>
                <tr color='blue'>
                  <th width="25%">SR Number</th>
                  <th width="25%">Name</th>
                  <th width="25%">Order Quantity</th>
                </tr>
              </thead>
              <tbody>
               {orderRow}
              </tbody>
            </Table>
          </Card>
        </Form>
      );
    }
  }
 
export default LM_Hospital_View_Order_Cart;