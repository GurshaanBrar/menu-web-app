import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import './App.css';
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
// Be sure to include styles at some point, probably during your bootstraping
import '@trendmicro/react-sidenav/dist/react-sidenav.css';


const mql = window.matchMedia(`(min-width: 919px)`);

@inject('globalStore')
@inject('routing')
@observer
class App extends Component {
    constructor(props) {
        super(props);
        
        this.store = this.props.globalStore;
        this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
        this.push = this.props.routing.push;
        this.connections = {
            n1: "",
            n2_s1: "create/photos",
            n2_s2: "create/items",
            n2_s3: "create/menus",
            n3_s1: "analyze/dashboard",
            n3_s2: "analyze/audiences",
            n3_s3: "analyze/insights",
            n4: "settings"
        }
    }

    componentWillMount() {
        mql.addListener(this.mediaQueryChanged);
    }

    componentDidMount() {
        var keys = Object.keys(this.connections);
        var values = Object.values(this.connections);

        var loc = this.props.location.pathname.split('/');
        var locNegOne = loc.pop();
        var locNegTwo = loc.pop();

        var count = 0;

        console.log(locNegTwo, locNegOne)

        for(let el of values) {
            if(locNegOne === el) {
                console.log(el);
            }
            else if (`${locNegTwo}/${locNegOne}` === el) {
                console.log(count);
            }
            count++;
        }
    }

    componentWillUnmount() {
        mql.removeListener(this.mediaQueryChanged);
    }

    mediaQueryChanged() {
        this.store.toggleSideMenuVisible(mql.matches)
    }

    _handleNavToggle(s) {
        this.store.toggleSideMenuOpen(s);
    }

    // handles case if active menu is clicked
    _handleNavItemClick(val) {
        if(this.store.activeTab !== val) {
            this.store.setActiveTab(val);
        }
        else {
            this.store.setActiveTab("");
        }
    }

    // links to clicked tab, configurations at this.connections
    _link() {
        if(this.store.activeTab === "n0") {
            this.push("/")
        }
        else {
            this.push(`/console/${this.connections[this.store.activeTab]}`)
        }
    }

    render() {
        var n1 = "var(--text_prim)";
        var n2 = "var(--text_prim)";
        var n2_s1 = "var(--text_prim)";
        var n2_s2 = "var(--text_prim)";
        var n2_s3 = "var(--text_prim)";
        var n3 = "var(--text_prim)";
        var n3_s1 = "var(--text_prim)";
        var n3_s2 = "var(--text_prim)";
        var n3_s3 = "var(--text_prim)";
        var n4 = "var(--text_prim)";

        // used to change color on drop down request
        var n1_bg = "var(--prim_one)";
        var n2_bg = "var(--prim_one)";
        var n3_bg = "var(--prim_one)";
        var n4_bg = "var(--prim_one)";

        // change the arrow directions
        var n2_arrow = "down";
        var n3_arrow = "down";

        switch(this.store.activeTab) {
            case "n1":
                n1 = "var(--prim_two)";
                break;

            case "n2":
                n2_bg = "var(--prim_three)";
                n2_arrow = "up";
                break;
            case "n2_s1":
                n2_s1 = "var(--prim_two)";
                n2_bg = "var(--prim_three)";
                break;
            case "n2_s2":
                n2_s2 = "var(--prim_two)";
                n2_bg = "var(--prim_three)";
                break;           
            case "n2_s3":
                n2_s3 = "var(--prim_two)";
                n2_bg = "var(--prim_three)";
                break;   

            case "n3":
                n3_bg = "var(--prim_three)";
                n3_arrow = "up";
                break;    
            case "n3_s1":
                n3_s1 = "var(--prim_two)";
                n3_bg = "var(--prim_three)";
                break;
            case "n3_s2":
                n3_s2 = "var(--prim_two)";
                n3_bg = "var(--prim_three)";
                break;           

            case "n3_s3":
                n3_s3 = "var(--prim_two)";
                n3_bg = "var(--prim_three)";
                break; 
            case "n4":
                n4= "var(--prim_two)";
                break;
            default:
                break;
        } 

        return(
        <span>
        {
            this.store.sideMenuVisible ?
            (
            <SideNav
                    onSelect={(selected) => {
                        this.store.setActiveTab(selected);
                        this._link();
                        }}
                    expanded={Boolean(this.store.sideMenuOpen)}
                    onToggle={(expanded) => this._handleNavToggle(expanded)}
                    style={{backgroundColor:'var(--prim_one)'}}
            >
                <SideNav.Nav style={{marginTop: "5%"}}>
                    {/* n0 */}
                    <NavItem eventKey="n0">
                        <NavIcon>
                            <i className="fa fa-cookie-bite" style={{ color: "#FFCB2C",fontSize: '2em'}} />
                        </NavIcon>
                        <NavText style={{fontSize:'1.5em', color:"white"}}>
                            Appetize
                        </NavText>
                    </NavItem>

                    {/* n1 */}
                    <NavItem eventKey="n1" style={{backgroundColor: n1_bg}}>
                        <NavIcon>
                            <i className="fa fa-fw fa-home" style={{ fontSize: '1.75em', color: n1 }} />
                        </NavIcon>
                        <NavText style={{color: n1}}>
                            Home
                        </NavText>
                    </NavItem>

                    {/* n2 */}
                    <NavItem eventKey="n2" onClick={() => this._handleNavItemClick("n2")} style={{backgroundColor: n2_bg}}>
                        <NavIcon >
                            <i class="fas fa-edit" style={{ fontSize: '1.75em', color: n2}} />
                        </NavIcon>
                        <NavText style={{color: n2}}>
                            Create <i class={`fas fa-chevron-${n2_arrow}`} style={{fontSize: '1em', color: n2, position:"absolute", right:12, marginTop:'7%'}}/>
                        </NavText>
                        {/* n2_s1 */}
                        <NavItem eventKey="n2_s1" style={{background: 'var(--prim_three)', marginTop:0}}>
                            <NavText style={{color: n2_s1}}>
                                Photos
                            </NavText>
                        </NavItem>
                        {/* n2_s2 */}
                        <NavItem eventKey="n2_s2" style={{background: 'var(--prim_three)'}}>
                            <NavText style={{color: n2_s2}}>
                                Items
                            </NavText>
                        </NavItem>
                        {/* n2_s3 */}
                        <NavItem eventKey="n2_s3" style={{background: 'var(--prim_three)', paddingBottom: '5%'}}>
                            <NavText style={{color: n2_s3}}>
                                Menus
                            </NavText>
                        </NavItem>
                    </NavItem>

                    {/* n3 */}
                    <NavItem eventKey="n3"  onClick={() => this._handleNavItemClick("n3")} style={{backgroundColor: n3_bg}}>
                        <NavIcon>
                            <i className="fab fa-think-peaks" style={{ fontSize: '1.75em', color: n3 }} />
                        </NavIcon>
                        <NavText style={{color: n3}}>
                            Analyze <i class={`fas fa-chevron-${n3_arrow}`} style={{fontSize: '1em', color: n2, position:"absolute", right:12, marginTop:'7%'}}/>
                        </NavText>
                        {/* n3_s1 */}
                        <NavItem eventKey="n3_s1" style={{background: 'var(--prim_three)', marginTop:0}}>
                            <NavText style={{color: n3_s1}}>
                                Dashboard
                            </NavText>
                        </NavItem>
                        {/* n3_s2 */}
                        <NavItem eventKey="n3_s2" style={{background: 'var(--prim_three)'}}>
                            <NavText style={{color: n3_s2}}>
                                Audiences
                            </NavText>
                        </NavItem>
                        {/* n3_s3 */}
                        <NavItem eventKey="n3_s3" style={{background: 'var(--prim_three)', paddingBottom: '5%'}}>
                            <NavText style={{color: n3_s3}}>
                                Insights
                            </NavText>
                        </NavItem>
                    </NavItem>

                    {/* n4 */}
                    <NavItem eventKey="n4" style={{backgroundColor: n4_bg}}>
                        <NavIcon>
                            <i className="fas fa-cog" style={{ fontSize: '1.75em', color: n4  }} />
                        </NavIcon>
                        <NavText style={{color: n4}}>
                            Settings
                        </NavText>
                    </NavItem>
                    <hr style={{backgroundColor: "grey", border: 'none',  height: 1, margin: "2%"}}/>
                    <SideNav.Toggle onClick={()=>this.store.toggleSideMenuOpen(!this.store.sideMenuOpen)} />
                </SideNav.Nav>
            </SideNav>
            ):
            (null)
        }
        </span>
        )
    }
}

    export default App;
