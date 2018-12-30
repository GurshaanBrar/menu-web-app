import { observable, action, toJS } from "mobx";
import RequestHandler from "../Services/RequestHandler";
import { observer } from "mobx-react";

export class CreateTabStore {
    /* #~#~#~#~#~#~ OBSERVABLES #~#~#~#~#~#~# */
    @observable items = []; //All items
    @observable loading = true;
    @observable menus = [];
    @observable menuCategories = [];
    @observable menusTree = [];
    @observable itemSubStore = {
        itemInView: ""
    };
    @observable menuSubStore = {
        loading: true,
        menuCats: [],
        itemInView: "",
        menuInView: "Food Menu"
    };

    /* #~#~#~#~#~#~ ACTIONS #~#~#~#~#~#~# */

    // Grabs all items from place menu
    @action
    getItems(placeId, withMenus = false) {
        RequestHandler.getDocument("Menus", placeId)
            .then(
                action("success", res => {
                    if (res.exists) {
                        // map data() to local var
                        let data = res.data();

                        // itr menus
                        for (let menu in data) {
                            this.menus.push(menu);

                            // itr categories in menu
                            for (var cat in data[`${menu}`]) {
                                // itr items in menu category
                                for (let item in data[`${menu}`][`${cat}`]) {
                                    if (item !== "type_description") {
                                        // format response
                                        let itemData =
                                            data[`${menu}`][`${cat}`][
                                                `${item}`
                                            ];
                                        let tempObj = {
                                            id: item,
                                            menu: menu,
                                            category: cat,
                                            breadcrumb: `${menu}.${cat}.${item}`
                                        };
                                        let retObj = {
                                            ...tempObj,
                                            ...itemData
                                        };

                                        this.items.push(retObj);
                                    }
                                }
                            }
                        }
                        this.loading = false;
                        console.log(this.items);
                    } else {
                        console.log("menu does not exist");
                    }
                })
            )
            .catch(err => {
                console.log(err);
            });
    }

    // Changes the item which will appear in modal
    @action
    setItemInView(newItem, subStore) {
        if (subStore === "item") {
            this.itemSubStore.itemInView = newItem;
        } else if (subStore === "menu") {
            this.menuSubStore.itemInView = newItem;
        }
    }

    @action
    setMenuCategories() {
        let retObj = {};
        let knownCats = [];
        let knownMenus = [];

        console.log(toJS(this.items));
        
        for (let i of this.items) {
            if (knownMenus.indexOf(i.menu) < 0) {
                knownMenus.push(i.menu);
                retObj[i.menu] = [];
            }
        }

        // get list of categories
        for (let i of toJS(this.items)) {
            // sort only the items in menu in view assuming menu exists
            if (knownCats.indexOf(i.category) < 0) {
                knownCats.push(i.category);
                retObj[i.menu].push(i.category);
            }
        }

        console.log(retObj);

        this.menuCategories = knownCats;
        this.menusTree = retObj;
    }

    // This creates the listener for the menus doc,
    // If the document changes, the local values will be updated to mach the db
    @action
    setListener(placeId) {
        RequestHandler.listenToDoc("Menus", placeId).onSnapshot(
            {
                includeMetadataChanges: true
            },
            action("success", doc => {
                console.log("has been changed");

                // Update local observable itemSubStore.itemInView
                if (this.itemSubStore.itemInView !== "") {
                    // copy breadcrumb key/value to new obj
                    const breadcrumb = {
                        breadcrumb: this.itemSubStore.itemInView.breadcrumb
                    };

                    // data to be passed onto new object
                    const copyData = {
                        menu: this.itemSubStore.itemInView.menu,
                        index: this.itemSubStore.itemInView.index,
                        category: this.itemSubStore.itemInView.category
                    };
                    let crumbs = this.itemSubStore.itemInView.breadcrumb.split(
                        "."
                    ); //Split into traceable obj keys

                    // Set local to new values if valid index aka not -1
                    if (this.itemSubStore.itemInView.index >= 0) {
                        this.items[this.itemSubStore.itemInView.index] = {
                            ...copyData,
                            ...doc.data()[crumbs[0]][crumbs[1]][crumbs[2]],
                            ...breadcrumb
                        };
                        this.itemSubStore.itemInView = {
                            ...doc.data()[crumbs[0]][crumbs[1]][crumbs[2]],
                            ...breadcrumb,
                            ...copyData
                        };
                    }
                }
                // update local observable menuSubStore.ItemInView
                else if (this.menuSubStore.itemInView !== "") {
                    // copy breadcrumb key/value to new obj
                    const breadcrumb = {
                        breadcrumb: this.menuSubStore.itemInView.breadcrumb
                    };
                    // data to be passed onto new object
                    const copyData = {
                        menu: this.menuSubStore.itemInView.menu,
                        index: this.menuSubStore.itemInView.index,
                        category: this.menuSubStore.itemInView.category
                    };
                    let crumbs = this.menuSubStore.itemInView.breadcrumb.split(
                        "."
                    ); //Split into traceable obj keys

                    // Set local to new values if valid index aka not -1
                    if (this.menuSubStore.itemInView.index >= 0) {
                        this.items[this.menuSubStore.itemInView.index] = {
                            ...copyData,
                            ...doc.data()[crumbs[0]][crumbs[1]][crumbs[2]],
                            ...breadcrumb
                        };
                        this.menuSubStore.itemInView = {
                            ...doc.data()[crumbs[0]][crumbs[1]][crumbs[2]],
                            ...breadcrumb,
                            ...copyData
                        };
                    }
                }
                // update entire item storage
                else {
                    console.log("resetting all");
                    
                    this.items = doc.data();
                }
                console.log(toJS(this.items));
                
                console.log("done");
            })
        );
    }

    // will sort all items belonging to the menuInView into there categories
    @action
    sortItems() {
        this.setMenuCategories();
        let tempCats = [];
        let menuName = this.menuSubStore.menuInView;

        // make new lane for each known category
        for (let m of toJS(this.menusTree[`${menuName}`])) {
            tempCats.push({
                id: m,
                title: m,
                cards: []
            });
        }

        for (let i of toJS(this.items)) {
            if (i.menu === menuName) {
                let el0 = toJS(this.menuCategories).indexOf(i.category);
                tempCats[`${el0}`].cards.push(i);
            }
        }

        this.menuSubStore.menuCats = tempCats;
    }

    @action
    clearItems() {
        this.items = [];
    }

    // Sets items with new values
    @action
    editItem(placeId, path, newVal) {
        let tempObj = {};
        tempObj[path] = newVal;
        RequestHandler.updateDocument("Menus", placeId, tempObj).then(res => {
            console.log("updated");
        });
    }
}

export default new CreateTabStore();

// const items =[
//   {
//     uri: "https://www.cactusclubcafe.com/wp-content/uploads/2016/05/050616_FortMcMurray_Blog_620px_400px_notext_web-620x400.jpg",
//     name: "Cactus Club Burger"
//   },
//   {
//     uri: "https://cdn-image.foodandwine.com/sites/default/files/styles/4_3_horizontal_-_1200x900/public/marinated-piquillo-peppers-and-whipped-eggplant-toasts-xl-recipe0516.jpg?itok=eiTQUEPt",
//     name: "Toast"
//   },
//   {
//     uri: "https://media-cdn.tripadvisor.com/media/photo-s/06/a7/be/64/homemade-lemonchees-cake.jpg",
//     name: "Lemon Cheesecake"
//   },
//   {
//     uri: "https://dishingouthealth.com/wp-content/uploads/2016/05/Greekpowerbowl3.jpg",
//     name: "For Goodness Sake Power Bowl"
//   },
//   {
//     uri: "https://www.reviewjournal.com/wp-content/uploads/2017/12/9711061_web1_crop-yardbird-mac-cheese.jpg",
//     name: "Mac & Cheese"
//   },
//   {
//     uri: "https://media1.popsugar-assets.com/files/thumbor/yEF2gPIXCCtdtYoEJxohnyJDWQY/fit-in/1024x1024/filters:format_auto-!!-:strip_icc-!!-/2015/08/06/876/n/1922398/484eafa6_IMG_1684-1024x742.jpg",
//     name: "Huevos Rancheros"
//   },
//   {
//     uri: "https://food-images.files.bbci.co.uk/food/recipes/alpine_pizza_32132_16x9.jpg",
//     name: "Medditarian Pizza"
//   },
//   {
//     uri: "https://static01.nyt.com/images/2017/12/13/dining/15COOKING-CREME-BRULEE1/15COOKING-CREME-BRULEE1-articleLarge.jpg",
//     name: "Creme Brulee"
//   },
//   {
//     uri: "https://www.cbc.ca/food/content/images/recipes/VanillaCremeBrulee.jpg",
//     name: "UBC Ponderosa Cake"
//   },
//   {
//     uri: "https://d3hvwccx09j84u.cloudfront.net/0,0/image/seared-beef-noodles-3a17c739.jpg",
//     name: "Chow Mein"
//   },
//   {
//     uri: "https://img1.cookinglight.timeinc.net/sites/default/files/styles/4_3_horizontal_-_1200x900/public/image/2017/08/main/fire-roasted-tomato-basil-soup-1709p63.jpg?itok=E0VGnlJw",
//     name: "Tomato Soup"
//   },
//   {
//     uri: "https://www.cactusclubcafe.com/wp-content/uploads/2015/11/111215_CACTUS_00194.jpg",
//     name: "Cactus Club House Burger"
//   }
// ]

// const backup = {
//   "Food Menu": {
//     "BURGERS + SANDWICHES": {
//       "ce8af52e-002e-11e9-8eb2-f2801f1b9fd1": {
//         "description": "created by chef rob feenie. peking duck, roasted chicken, prosciutto di modena, pecan fruit bread",
//         "name": "BBQ Duck Clubhouse",
//         "price": 19,
//         "uri": "https://i.pinimg.com/originals/ad/84/3b/ad843bde6e58f12e2a1dfe0af32569ab.jpg",
//         "views": 10
//       },
//       "ce8af7e0-002e-11e9-8eb2-f2801f1b9fd1": {
//         "description": "smashed certified angus beef®, sautéed mushrooms, aged cheddar, smoked bacon, red relish, mayonnaise, ketchup, mustard",
//         "name": "The Feenie Burger",
//         "price": 19,
//         "uri": "https://noshandnibble.blog/content/images/2018/04/cactus-club-cafe-feenie-burger.jpg",
//         "views": 2
//       }
//     },
//     "DESSERTS": {
//       "ce8af934-002e-11e9-8eb2-f2801f1b9fd1": {
//         "description": "tahitian vanilla ice cream, caramel sauce, crunchy chocolate pearls",
//         "name": "Chocolate Peanut Butter Crunch Bar",
//         "price": 9.75,
//         "uri": "https://s3.amazonaws.com/cdn.houseandhome.com/wp-content/uploads/Cake_CactusClubCafe_HH_AU11_0.jpg",
//         "views": 22
//       },
//       "ce8afa7e-002e-11e9-8eb2-f2801f1b9fd1": {
//         "description": "warm caramel foam, crunchy sponge toffee, velvety chocolate mousse",
//         "name": "Caramel Chocolate Mousse",
//         "price": 6.5,
//         "uri": "https://thisbeautifuldayblog.com/wp-content/uploads/2015/10/Cactus-club-cafe-Toronto-Dessert-e1446056953433.jpg",
//         "views": 5
//       }
//     }
//   }
// }
