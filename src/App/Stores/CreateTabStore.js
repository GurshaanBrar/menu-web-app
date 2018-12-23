import { observable, action, toJS } from "mobx"
import RequestHandler from '../Services/RequestHandler';

export class CreateTabStore {
    /* #~#~#~#~#~#~ OBSERVABLES #~#~#~#~#~#~# */
    @observable itemSubStore = {
      items: [], //All items
      itemInView: "",
    };
    @observable menuSubStore = {
      loading:true,
      menuCats: [],
      itemInView: "",
    };

    /* #~#~#~#~#~#~ ACTIONS #~#~#~#~#~#~# */

    // Grabs all items from place menu
    @action
    getItems(placeId, withMenus=false) {
      RequestHandler.getDocument("Menus", placeId)
      .then(action("success", res => {        
        if(res.exists) {
          // map data() to local var 
          let data = res.data() 

          // itr menus
          for(let menu in data) {            
            let count = 0;
            // itr categories in menu
            for(var cat in data[`${menu}`]) {
              var tempLane = {
                id: cat,
                title: cat,
                cards: []
              }
              
              // itr items in menu category
              for(let item in data[`${menu}`][`${cat}`]) {
                if(item !== "type_description") {
                  // format response
                  let itemData = data[`${menu}`][`${cat}`][`${item}`];                
                  let tempObj = {category: cat, breadcrumb: `${menu}.${cat}.${item}`};
                  let retObj = { ...tempObj, ...itemData}

                  // add item to local data
                  if(withMenus) {
                    retObj['id'] = item;
                    tempLane.cards.push(retObj)
                  }
                  else {
                    this.itemSubStore.items.push(retObj)
                  }
                }
              }

              if(withMenus) { 
                console.log(tempLane);
                
                this.menuSubStore.menuCats.push(tempLane)
              }
              count++;
            }
          }
          this.menuSubStore.loading = false;
          
        }
        else {
          console.log("menu does not exist")
        }        
      }))
      .catch(err => {
        console.log(err);   
      })
    }

    @action
    clearItems() {
      this.itemSubStore.items = [];
    }

    // Sets items with new values
    @action
    editItem(placeId, path, newVal) {
      let tempObj = {};
      tempObj[path] = newVal
      RequestHandler.updateDocument("Menus", placeId, tempObj)
      .then(res => {
        console.log('updated');
      })
    }

    // Changes the item which will appear in modal
    @action
    setItemInView(newItem, subStore) {     
      if(subStore === 'item') {
        this.itemSubStore.itemInView = newItem;
      }
      else if (subStore === 'menu') {
        console.log(newItem);
        
        this.menuSubStore.itemInView = newItem;
      }
    }

    // This creates the listener for the menus doc,
    // If the document changes, the local values will be updated to mach the db
    @action
    setListener(placeId) {
      RequestHandler.listenToDoc("Menus", placeId)
      .onSnapshot({
        includeMetadataChanges: true
      }, action("success", (doc) => {

        // Update local observable itemSubStore.itemInView
        if (this.itemSubStore.itemInView !== "") {
          // copy breadcrumb key/value to new obj
          const breadcrumb = {"breadcrumb": this.itemSubStore.itemInView.breadcrumb};
          var crumbs = this.itemSubStore.itemInView.breadcrumb.split('.'); //Split into traceable obj keys

          // Set local to new values
          this.itemSubStore.items[this.itemSubStore.itemInView.index] =  { ...doc.data()[crumbs[0]][crumbs[1]][crumbs[2]] , ...breadcrumb};      
          this.itemSubStore.itemInView = { ...doc.data()[crumbs[0]][crumbs[1]][crumbs[2]] , ...breadcrumb};
        }

        // Update local observable menuSubStore.itemInView
        // if (this.menuSubStore.itemInView !== "") {
        //   var itemMap = this.menuSubStore.itemInView;
        //   console.log(this.menuSubStore.menuCats);
          
        //   console.log(this.menuSubStore.menuCats.find( x => x.title = "DESSERTS" ));
          

        //   // copy breadcrumb key/value to new obj
        //   const breadcrumb = {"breadcrumb": this.menuSubStore.itemInView.breadcrumb};
        //   var crumbs = this.menuSubStore.itemInView.breadcrumb.split('.'); //Split into traceable obj keys
          
          // // Set local to new values
          // this.itemSubStore.items[this.itemSubStore.itemInView.index] =  { ...doc.data()[crumbs[0]][crumbs[1]][crumbs[2]] , ...breadcrumb};      
          // this.itemSubStore.itemInView = { ...doc.data()[crumbs[0]][crumbs[1]][crumbs[2]] , ...breadcrumb};
        // }
      }));
    }

  }
  export default new CreateTabStore()
  

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