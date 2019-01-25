import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Row, Col, Image, Table, Button } from "react-bootstrap";
import HandHoldingModal from "../../../../Components/HandHoldingModal/HandHoldingModal";

@inject("CreateTabStore")
@inject("globalStore")
@observer
class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchQuery: "",
      show: false, //hides and shows modal for items
      menuSelected: false
    };

    this.store = this.props.CreateTabStore;
    this.globalStore = this.props.globalStore;
    this.store.getPlaceData(this.globalStore.placeId);
  }

  componentDidMount() {}

  _handleSearch(val) {
    this.setState({ searchQuery: val });
  }

  // closes the modal
  handleClose() {
    this.setState({ show: false });
  }

  // opens the modal
  handleShow() {
    this.setState({ show: true });
  }

  handleSave() {
    this.setState({ show: false })
  }

  render() {
    let pData = this.store.profileSubStore.profileData;
    console.log(pData);
    
    
    return (
      <div style={{ overflowY: "scroll", height: "100vh" }}>
        { this.store.profileSubStore.loading !== true? (
          <div>
            <Row className="show-grid" style={{ margin: "2%" }}>
              <Col xs={12} md={12}>
                <div style={{ textAlign: "center" }}>
                  <h1>{pData.name}</h1>
                  {/* <Image
                style={{margin:"1%", width: 75, height: 75}}
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARsAAACyCAMAAABFl5uBAAAArlBMVEUjHyARCQucm5z///8AAAAfGxwhHR8eGRocFxgeGx4LAAMYExTHxsYiHyAIAAAVDxEzMDFEQUK/vr8/PT2Bf4Cvrq5WVFRNS0v4+PhvbW2VlJUYFhzu7u7m5uanpqf09PRlY2SbglheXF0vKyyIh4d/a0pzYUTZ2dm3tragn6AqJic8NCtZTDhhUjzMy8s6NzeRelN2dHVNQjOfhVoxKyZ7Z0hFOy+KdFBfUDuEgoPTFF62AAAICElEQVR4nO2de3eiOhfGgwkBoQVFq2i9a4s6M146nel7vv8Xe3cuKKC154w9qz1dz++PQZRsnjwkOwlrVsq4YZCMakAxSgbWE6b/zSaOcIBBOJPs6E1bhJKBHBmKdu7NTHy0mk+HmBlvJsFHK/mEBBPlzRKt5hxiyVk69z5axqfEm6csQbM5j0hYO/xoEZ+UsM1a7keL+KS4rY9WAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4vLhhHJc3SKzue+fGcWj3e3NzzIm9QB52g/PC+PzOcHSX0L2tXi6rESjya/vCXtQpj6ryz68G+tv4gk0W7WbkFETs4+IVTtTaL3pz4aufGjlKw3xrxcwbtqTY7tstcepOHG11jLB0+fGTXG/X+gNFdp3gTK2szqCgk+0P5lCgXBXFshLXV5ojuhuz+fPicJ+4PXaOUV3x11BfsemQORHPWbtMbLjZdTJa8q56oq6XqJ8Sr2KOFG0TI5spg8UNb5orgjuuopL/Na4q6jW1llV44m500HloOqTzsOmlML/yHgVxVlZi36lG+WfWLKgqvc5klVqR6rtM38Ja42z4uDbr7BOulIS1fn/Jk36/Zupovbkz3kQJ38w69E9ZlHQSnq5mnR45pwqIhNstGYNR7k1f35O8yfqjjN9U985VOpe9zmw15pNcm9KZN3CSQsr6NeU5+XzXVyedq7ZSjRZ82BChH0ZiObHehBN6vscHkvGlCOgK0dxEqhKO2PO2cJwz3riMCoahuNuXExY91KWIQj8W2+xNb+5ERL/P/FIE5y8+bBmdSc/+5HcKOklKHDiOo8KSNzO9zfdV1ngtPlibekhnfbzNDW/ZuEGfqmU6mG/7Wdzm7Ti/suQN1WykvnDK1lDFEpuCTLUuerOM1NMpdwe3wcfS6oxLOrv+4WSd90PyZnL9LqqUJyZx5Tt3y5NmvuuxZONBNbO+7o30+FBU4zHpD8blBPSmNz2+KIURZ3TSc00aPN9ml6TculLqx6e9kfbkT5E+1bz6paD0KLJ0rsXTE1xFlQte90Ydhz3hlEWFM+on5Vtc7lOC4nZL/UGkw5PNu6MR9ZyMxzKXwnzP08O28sbx7Mmf4m1Pd8V219SJ471t1MHqmKJzLnjDRF+NJHGpCFW70sQv5+LVcsj7JVlu64xOmQ6VzlqQS9E0TC4+Dlp/itfld9VWQSLbjhSpGR6p0s1qRrvkDYsaNIAOW0VzaEjtlv296I0ZqXvFdkJZd3Sic0Eq3Hg8MA1HjVMKNaXR45Q6aV6xP7F77K850hmMKceLlZ5unE1rF71hXkBlU6/QnKkW1XHrjT4V7Ael5krt+6babsRgoHTStCi2UuKIhibbp8w4dc3WzTIcjCv3DPf00IixGR5Pc8Vlb7QaMSqlUn9W7RFv5WIZdMtmiLx5HEX0Sjr/jXHqji8OjdW0TZp3aYZaNLnH117xgpI3CbdumMpKR68hVBcodolgyLd5KyheXqxGYD4Yb5QZw6I3lHdPdSZWZ9dOtd/ZG7eRpk1TDT/Y0k3DDvUyjX3YNDfZCFMxZy4r3tDD3qvSrhhydXSyoZoLOfvy9IQyZmZjxHr4O3pDzbRmnvtGJzbrjeelJW/cdcpznWGDbuF3jzp1Wnh/b5hDc+CeoAmlaA7VvJhuYTs6VVdPSmhqkbWo90Zib+UevaHxY0y/BdSJdK6k6VJfOBG1tXl5PnPHsybFCERvbOfFc6qWmhHFY5ox0O0X9AjYYQxnCa+VJn8x6dxrna2h6nviMOsjnaqxVryZad+uNCjopTyrLfq0VKOMQfO+fBZOGdTIo4rxm/5iNeSDqjeqhfDlop/xTP/BGZeNebJYDXi/MhuJaPDa6Bip9eYmSW7UcocSGhWhCAPd3cibYZJkpKkySYom9N1K66TlBCXnLDroXAUn3mwS4uaaMVzX1B+N1ah50zUr2Pz1hDsfDE1oWqmndMF4xA79IPeGRR31J3nSVWSXBA21HB60TyeU3ZtCjGiZEmb6ETdVkfTONbm8ycdpOt60T15zxK7WmW60ztpBp0pNkQ55eCPh9FNNZXL9B7hR1Jx1mE0I4XEBfniP5AvWmTUjW38m3cIbhFBsZ53wkCc9Ou06ZyT5wu3OuoGN4YVxmL8t80Rj1pG5F24YxrE4XXi8rlManV7hTyXpIHEYvsdfNPF8//D67ewF0vcL9ykvVKhw8dz1X1FUiiGLyx23GOHSMqigsxT59Bspr11PAQAAAAAAAN6R27cP/+DSSon/NvV6/exBHg/SHOyPt+bs9rWCX8ed+uPuO9Wq/mP3Qx2+7x7V4Wn3S94y+W33QlW9fX55eZa0KnzYfSNX6g+73/Viwf+dlP8aSLabPtwzdv8y3anDw3RH390/TqfPt1Th6U9yo/708yfZUP89nar6r39OH++ZXNuCu+lLufy1/znk81D//qBagfz98KQO3x5UY5DPD8oFtv5FLpBXj4/qXUL98deaOsz9j4dnqQvqVvRkyj8Vy38V6ve6MvLcgd3fm7N7ac5uTQlZOpwrCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPiKtK7ZqPYr47ZY+x12Hf2ShG1W3bwZWETC0vl77Bz59fDmKTvdhR0oxJIzzicn2/cDFky48obP0HKqiBk33vC2CL/MhjLvgAxFm+fe8Gzi6E35ASGcScaP3nA+SEY1oBglA+vJ/wFV3Jx4yMQdwwAAAABJRU5ErkJggg=="
              /> */}
                </div>
              </Col>
            </Row>
            <Row className="show-grid" style={{ margin: "2%" }}>
              <Col xs={12} md={6} style={{ alignItems: "center" }}>
                <Image
                  style={{ width: "100%" }}
                  src={pData.cover_uri}
                />
                <div style={{ marginTop: "4%" }}>
                  <h4 style={{ textAlign: "center" }}>
                    <b>Description</b>
                  </h4>
                  <p
                    style={{
                      marginTop: "4%",
                      marginRight: "2%",
                      marginLeft: "2%"
                    }}
                  >
                  {pData.description}
                  </p>
                </div>
              </Col>
              <Col xs={12} md={6} style={{ textAlign: "center" }}>
                <div>
                  <h4>
                    <b>Address</b>
                  </h4>
                  <p>{pData.address}</p>
                </div>
                <div style={{ marginTop: "4%" }}>
                  <h4>
                    <b>Phone</b>
                  </h4>
                  <p>{pData.phone_number}</p>
                </div>
                <div style={{ marginTop: "4%" }}>
                  <h4>
                    <b>Website</b>
                  </h4>
                  <p>
                    <a>{pData.website}</a>
                  </p>
                </div>
                <div style={{ marginTop: "4%" }}>
                  <h4>
                    <b>Tags</b>
                  </h4>
                  <p>todo</p>
                </div>
                <div
                  style={{ marginTop: "4%", width: "50%", marginLeft: "25%" }}
                >
                  <h4>
                    <b>Hours</b>
                  </h4>
                  <Table>
                    <tbody>
                      <tr>
                        <td>
                          <b>Sunday</b>
                        </td>
                        <td>{pData.hours[0].opens} - {pData.hours[0].closes}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Monday</b>
                        </td>
                        <td>{pData.hours[1].opens} - {pData.hours[1].closes}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Tuesday</b>
                        </td>
                        <td>{pData.hours[2].opens} - {pData.hours[2].closes}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Wednesday</b>
                        </td>
                        <td>{pData.hours[3].opens} - {pData.hours[3].closes}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Thursday</b>
                        </td>
                        <td>{pData.hours[4].opens} - {pData.hours[4].closes}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Friday</b>
                        </td>
                        <td>{pData.hours[5].opens} - {pData.hours[5].closes}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Saturday</b>
                        </td>
                        <td>{pData.hours[6].opens} - {pData.hours[6].closes}</td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
                <Button onClick={() => this.handleShow()} style={{ marginTop: "4%" }}><i className="fas fa-edit"></i> Edit</Button>
              </Col>
            </Row>

            {/* modal is available to all components in container */}
            <HandHoldingModal
              handleClose={this.handleClose.bind(this)}
              show={this.state.show}
              title={"Edit Profile"}
              handleSave={() => this.handleSave()}
              pages={[
                <div>0ne</div>,
                <div>two</div>,
                <div>three</div>,
                <div>four</div>
              ]}
            />
          </div>
        ) : (
          <div>loading...</div>
        )}
      </div>
    );
  }
}

export default Profile;
