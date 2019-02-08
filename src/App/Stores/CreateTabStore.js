import { observable, action, toJS } from "mobx";
import RequestHandler from "../Services/RequestHandler";
var moment = require("moment");

export class CreateTabStore {
  /* #~#~#~#~#~#~ OBSERVABLES #~#~#~#~#~#~# */
  @observable items = []; //All items
  @observable loading = true;
  @observable menus = [];
  @observable menuCategories = [];
  @observable menusTree = [];
  @observable profileSubStore = {
    loading: true,
    profileData: {},
    DBUpdatedKeys: {
      address: false,
      cover_uri: false,
      description: false,
      hours: false,
      icon_uri: false,
      name: false,
      phone_number: false,
      tags: false,
      website: false
    }
  };
  @observable itemSubStore = {
    itemInView: ""
  };
  @observable menuSubStore = {
    loading: true,
    menuCats: [],
    itemInView: "",
    menuInView: "",
    menuTypes: [
      {
        name: "Lunch",
        uri:
          "https://www.ycdsb.ca/sms/wp-content/uploads/sites/90/2017/10/lunch-1200x1200.jpeg"
      },
      {
        name: "Brunch",
        uri:
          "https://images-na.ssl-images-amazon.com/images/I/61n8O21K6vL._SX258_BO1,204,203,200_.jpg"
      },
      {
        name: "Dinner",
        uri:
          "https://images-na.ssl-images-amazon.com/images/I/61O6jnlbiTL._SX258_BO1,204,203,200_.jpg"
      }
    ]
  };

  /* #~#~#~#~#~#~ ACTIONS #~#~#~#~#~#~# */

  /****** 1) Reads from firestore ******/

  // Grabs all items from place menu
  @action
  getItems(placeId) {
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
                    let itemData = data[`${menu}`][`${cat}`][`${item}`];
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
          } else {
            console.log("menu does not exist");
          }
        })
      )
      .catch(err => {
        console.log(err);
      });
  }

  // This function grabs all the info for place with placeId and converts database time 
  // to human readable time
  @action
  getPlaceData(placeId) {
    RequestHandler.getDocument("Places", placeId).then(
      action("success", res => {
        if (res.exists) {

          let tempRetObj = { formatted_hours: []};
          let count = 0;


          for (let h of res.data().hours) {

            // split time into hours and mins and convert to number
            var openHour = Number(h.open.split(":")[0]);
            var openMin = Number(h.open.split(":")[1]);
            var openForHour = Number(h.open_for.split(":")[0]);
            var openForMin = Number(h.open_for.split(":")[1]);
            var closeTime = "23:00"; //the one and only close time :)
            var minSum = openMin + openForMin;
            var offset = 0;

            // when added openForMin+openMin can be >= 60 which is invalid, this will reset the mins and add one to hour
            if (minSum >= 60) {
              openForMin = minSum - 60;
              offset = 1;
            }

            // convert to decimal time representation (. instead of :)

            var closeDec = offset + openHour + openForHour + openForMin / 100;

            // format the close time if its not correct
            if (closeDec >= 24) {
              var tempHour = openHour + openForHour - 24;
              var tempMin = openForMin;

              if (tempHour === 0) {
                tempHour = "00";
                tempMin = "00";
              } else {
                if (tempHour < 10) {
                  tempHour = `0${tempHour}`;
                }
                if (tempMin < 10) {
                  tempMin = `0${tempMin}`;
                }
              }

              closeTime = `${tempHour}:${tempMin}`;
            }

            // insert object by day 0=sunday 6=sat
            tempRetObj.formatted_hours[count] = {
              open: (moment(h.open, "HH:mm").format('h:mm a')),
              close: (moment(closeTime, "HH:mm").format('h:mm a'))
            }
  
            // increment count to next day
            count++;
          }

          // copy unformatted hours to have the time open for available to components
          let unformatted_hours = {"unformatted_hours": res.data().hours};
          
          this.profileSubStore.profileData = { ...res.data(), ...tempRetObj, ... unformatted_hours};
          this.profileSubStore.loading = false;
        }
      })
    );
  }

  /****** 2) Writes to firestore ******/

  // Sets items with new values
  @action
  editItem(placeId, path, newVal) {
    let tempObj = {};
    tempObj[path] = newVal;
    RequestHandler.updateDocument("Menus", placeId, tempObj).then(res => {
      console.log("updated");
    });
  }

  // Updates category names
  // grabs the menu in view from firestore then will do one of the two
  // things. Will create new cat object with new name write it to database then
  // deletes the old object (essentially replacing) /OR/ Will create new cat object and
  // write to database
  @action
  changeCatName(placeId, men, oldCat, newCat) {
    RequestHandler.getDocument("Menus", placeId).then(res => {
      if (res.exists) {
        let catObjCopy = res.data()[`${men}`];

        // If the old key exists replace it
        if (`${oldCat}` in catObjCopy) {
          // Make sure the new cat name is not the same as the old
          if (newCat !== oldCat) {
            // Taken from stack overflow. does some magic to delete and add keys
            Object.defineProperty(
              catObjCopy,
              newCat,
              Object.getOwnPropertyDescriptor(catObjCopy, oldCat)
            );

            // delete the old key
            delete catObjCopy[oldCat];

            // Update firebase
            this.editItem("2l2WLstfnWfsYlGEJHdc", `${men}`, catObjCopy);
          }
        }
        // Create new category and add it to firestore
        else {
          catObjCopy[`${newCat}`] = {};

          // Update firebase
          // this.editItem("placeId", `${men}`, catObjCopy);
        }
      }
    });
  }

  // Adds new category to local cache then writes new cat with items to firestore
  @action
  addCat() {
    this.menuSubStore.menuCats.push({
      id: "New Category",
      title: "New Category",
      cards: []
    });
  }

  // Moves item to a new category and writes update to firestore
  @action
  changeItemCategory(placeId, men, itemId, oldCat, newCat) {
    RequestHandler.getDocument("Menus", placeId).then(res => {
      if (res.exists && oldCat !== newCat) {
        let catObjCopy = res.data()[`${men}`];
        let itemObjCopy = catObjCopy[`${oldCat}`][`${itemId}`];

        // if the newCat is literally a newly added category ie it dne in firestore
        if (catObjCopy[`${newCat}`] === undefined) {
          let tempObj = {};
          tempObj[`${newCat}`] = { type_description: "" };

          // merge the new obj with catObjCopy
          catObjCopy = { ...catObjCopy, ...tempObj };
        }

        // add object to the new category
        catObjCopy[`${newCat}`][`${itemId}`] = itemObjCopy;
        // delete object from the old category
        delete catObjCopy[`${oldCat}`][`${itemId}`];

        // Update firebase
        this.editItem(placeId, `${men}`, catObjCopy);
      }
    });
  }

  // Writes to Profile Doc, if the key was changed using the web app then update it
  // in firebase otherwise ignore it.
  @action
  updateProfile(placeId) {
    let updateQueued = false;
    let tempObj = {}

    // only change the updated values
    for(let k in this.profileSubStore.DBUpdatedKeys) {
      if(this.profileSubStore.DBUpdatedKeys[`${k}`]) {
        updateQueued = true;
        if(k === "hours") {
          tempObj[`${k}`] = this.profileSubStore.profileData.unformatted_hours;
        }
        else{
          tempObj[`${k}`] = this.profileSubStore.profileData[`${k}`]
        }
      }
    }

    // update if necessary
    if(updateQueued) {
      RequestHandler.updateDocument("Places", placeId, tempObj).then(res => {
        console.log("updated");
      });
    }
  }

  /****** 3) Writes to local store ******/

  // Changes the item which will appear in modal
  @action
  setItemInView(newItem, subStore) {
    if (subStore === "item") {
      this.itemSubStore.itemInView = newItem;
    } else if (subStore === "menu") {
      this.menuSubStore.itemInView = newItem;
    }
  }

  // Changes the item which will appear in modal
  @action
  setMenuInView(newMenuInView) {
    this.menuSubStore.menuInView = newMenuInView;
  }

  // will sort all items into its tree
  // menu -> categories -> items
  // menuCategories and menusTree will be written too
  @action
  setMenuCategories() {
    let retObj = {};
    let knownCats = [];
    let knownMenus = [];
    let len = this.items.length;

    for (let it = 0; it < len; it++) {
      let el = this.items[it];

      if (knownMenus.indexOf(el.menu) < 0) {
        knownMenus.push(el.menu);
        retObj[el.menu] = [];
      }
    }

    // get list of categories
    for (let it = 0; it < len; it++) {
      let el = this.items[it];
      // sort only the items in menu in view assuming menu exists
      if (knownCats.indexOf(el.category) < 0) {
        knownCats.push(el.category);
        retObj[el.menu].push(el.category);
      }
    }

    this.menuCategories = knownCats;
    this.menusTree = retObj;
  }

  // This sets profileData with certain key to the newVal, special care is taken when setting hours.
  @action
  setProfileData(key, newVal) {
    let keys = key.split(".")


    // special cases need to be handled for the hours data, below will ensure data is properly set
    if(keys[0] === "hours") {
      if(keys[2] === "open_for") {
        // split times into hours mins convert to number, get time string (am/pm)
        let old_h = Number(this.profileSubStore.profileData.formatted_hours[`${keys[1]}`]['open'].split(":")[0]);
        let old_m = Number(this.profileSubStore.profileData.formatted_hours[`${keys[1]}`]['open'].split(":")[1].split(" ")[0]);
        let ampm = this.profileSubStore.profileData.formatted_hours[`${keys[1]}`]['open'].split(":")[1].split(" ")[1];
        let add_h = Number(newVal.split(":")[0]);
        let add_m = Number(newVal.split(":")[1].split(" ")[0]);
        let add_ampm = newVal.split(":")[1].split(" ")[1];        

        // convert to 24 hour time if larger then 12
        if(old_h === 12 && ampm === "am") {
          old_h = 0;
        }
        else if(ampm === "pm") {
          old_h += 12;
        }

        if(add_h === 12 && add_ampm === "am") {
          add_h = 0;
        }
        else if(add_ampm === "pm") {
          add_h += 12;
        }
        
        // update the local store the formated and unformatted hour for that day
        this.profileSubStore.profileData.formatted_hours[`${keys[1]}`]["close"] = moment(`${old_h}:${old_m}`,"HH:mm").add(add_h, "h").add(add_m, "m").format('h:mm a');
        this.profileSubStore.profileData.unformatted_hours[`${keys[1]}`][`${keys[2]}`] = `${add_h}:${add_m}`;
      }
      else {
        // update the local store the formated and unformatted hour for that day
        this.profileSubStore.profileData.formatted_hours[`${keys[1]}`][`${keys[2]}`] = newVal;
        this.profileSubStore.profileData.unformatted_hours[`${keys[1]}`][`${keys[2]}`] = newVal.split(" ")[0];
      }

      // recorded that key has been updated
      this.profileSubStore.DBUpdatedKeys.hours = true;
    }
    else {
      this.profileSubStore.loading = true;
      this.profileSubStore.profileData[`${key}`] = newVal;
      this.profileSubStore.loading = false;

      // recorded that key has been updated
      this.profileSubStore.DBUpdatedKeys[`${key}`] = true;
    }        
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
        console.log(this.itemSubStore.itemInView);

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
          let crumbs = this.itemSubStore.itemInView.breadcrumb.split("."); //Split into traceable obj keys

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
          let crumbs = this.menuSubStore.itemInView.breadcrumb.split("."); //Split into traceable obj keys

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
        // else {
        //     console.log("resetting all");

        //     this.items = doc.data();
        // }

        console.log("done");
      })
    );
  }

  // will sort all items belonging to the menuInView into there categories
  @action
  sortItems() {
    // populate menusTree and menuCategories
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
}

export default new CreateTabStore();

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
