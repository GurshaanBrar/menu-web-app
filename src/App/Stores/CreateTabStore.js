/*
 *  CreateTabStore.js
 *
 *  Description:
 *      This class manages the state for the Create tab and its sub tabs (CreateTab.js, Item.js,
 *      Menus.js, Profile.js), and handles read and write from firestore. To access firestore
 *      this store must be reference to preserve state, should look something like this to
 *      access firestore: Component -> Container -> Store -> firestore. This store has strict
 *      rules in terms of nomenclature... see each section for more details.
 *
 *  Sections:
 *      1. OBSERVABLES DECLARATION
 *      2. SETS OBSERVABLE
 *      3. READS FROM DATABASE
 *      4. WRITES TO DATABASE
 *      5. DELETES
 */

import { observable, action, toJS } from "mobx";
import RequestHandler from "../Services/RequestHandler";
var moment = require("moment");

export class CreateTabStore {
  // ==================== OBSERVABLES DECLARATION: START ==================== //
  /*
   *  These variables are available to all sub tabs in CreateTab. Each sub
   *  tab has its own sub store observable to keep store clean. These variables
   *  can be by directly calling it from store object (this.store.<varName>),
   *  however observables can only be mutated by member functions, set them by
   *  calling its setter function.
   */

  //  Store for all tabs under CreateTab
  @observable items = []; // All items
  @observable menus = {}; // list of menu names for a place
  @observable menusStats = [];
  @observable menuCategories = []; // List of categories for a menu
  @observable menusTree = []; // Preserves relationship between menus -> categories -> and items

  // SubStore for Profile tab, mapped from Places in db.
  @observable profileSubStore = {
    loading: true, // status of data fetch
    profileData: {}, // local cache of data from db
    DBUpdatedKeys: {
      // tracks the keys updated
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

  // SubStore for Items tab, mapped from Menus in db.
  @observable itemSubStore = {
    loading: true,
    itemInView: ""
  };

  // SubStore for Menus tab, mapped from Menus in db.
  @observable menuSubStore = {
    loading: true,
    itemInView: "",
    menuInView: "",
    formattedCatagories: []
  };
  // ==================== OBSERVABLES DECLARATION: END ==================== //

  // ==================== SETS OBSERVABLES: START ==================== //
  /*
   *  These functions set store observables, they should never interact
   *  with firestore. Each function should camelCased and prefixed with
   *  'set'.
   *
   *  Contents:
   *      1. setItemInView()
   *      2. setProfileSubStore()
   *      3. setItems()
   *      4. setFormattedCategories()
   *      5. setMenuInView()
   *
   */

  // Ref: ItemCard.js & ItemModal.js & MenuBoard.js
  // Des: Changes the item which will appear in modal.
  // Pre: newItem must be correctly formatted object, subStore must be,
  //      item or menu.
  // Post: the subStore's itemInView will be updated to newItem
  @action
  setItemInView(newItem, subStore) {
    if (subStore === "item") {
      this.itemSubStore.itemInView = newItem;
    } else if (subStore === "menu") {
      this.menuSubStore.itemInView = newItem;
    }
  }

  // Ref: Profile.js
  // Des: This sets profileData with certain key to the newVal, special care is taken when setting hours.
  // Pre: key must be one of existing ones in DBUpdatedKeys, value must match key required formatting
  // Post: Key/pair is updated in profileSubStore, hours will be formated, and any keys updated will
  //       be recorded by DBUpdatedKeys.
  @action
  setProfileSubStore(key, newVal) {
    let keys = key.split(".");

    // special cases need to be handled for the hours data, below will ensure data is properly set
    if (keys[0] === "hours") {
      if (keys[2] === "open_for") {
        // split times into hours mins convert to number, get time string (am/pm)
        let old_h = Number(
          this.profileSubStore.profileData.formatted_hours[`${keys[1]}`][
            "open"
          ].split(":")[0]
        );
        let old_m = Number(
          this.profileSubStore.profileData.formatted_hours[`${keys[1]}`]["open"]
            .split(":")[1]
            .split(" ")[0]
        );
        let ampm = this.profileSubStore.profileData.formatted_hours[
          `${keys[1]}`
        ]["open"]
          .split(":")[1]
          .split(" ")[1];
        let add_h = Number(newVal.split(":")[0]);
        let add_m = Number(newVal.split(":")[1].split(" ")[0]);
        let add_ampm = newVal.split(":")[1].split(" ")[1];

        // convert to 24 hour time if larger then 12
        if (old_h === 12 && ampm === "am") {
          old_h = 0;
        } else if (ampm === "pm") {
          old_h += 12;
        }

        if (add_h === 12 && add_ampm === "am") {
          add_h = 0;
        } else if (add_ampm === "pm") {
          add_h += 12;
        }

        // update the local store the formated and unformatted hour for that day
        this.profileSubStore.profileData.formatted_hours[`${keys[1]}`][
          "close"
        ] = moment(`${old_h}:${old_m}`, "HH:mm")
          .add(add_h, "h")
          .add(add_m, "m")
          .format("h:mm a");
        this.profileSubStore.profileData.unformatted_hours[`${keys[1]}`][
          `${keys[2]}`
        ] = `${add_h}:${add_m}`;
      } else {
        // update the local store the formated and unformatted hour for that day
        this.profileSubStore.profileData.formatted_hours[`${keys[1]}`][
          `${keys[2]}`
        ] = newVal;
        this.profileSubStore.profileData.unformatted_hours[`${keys[1]}`][
          `${keys[2]}`
        ] = newVal.split(" ")[0];
      }

      // recorded that key has been updated
      this.profileSubStore.DBUpdatedKeys.hours = true;
    } else {
      this.profileSubStore.loading = true;
      this.profileSubStore.profileData[`${key}`] = newVal;
      this.profileSubStore.loading = false;

      // recorded that key has been updated
      this.profileSubStore.DBUpdatedKeys[`${key}`] = true;
    }
  }

  // Ref: ItemModal.js & MenuBoard.js & Items.js
  // Des: This updates this.items key with the given path to the newVal or adds a new item to items array
  // Pre: path must be formatted as a period separated string, with the 1st(el 0) string being the uuid of the item
  //      and the 2nd(el 1) string being the name of the key to edit. EX: "4a4f4380-0c01-11e9-a3e5-cd6beef52e09.name"
  //      value must match key required formatting, if action === 'add', then the newVal is appended to this.items
  // Post: Then path in this local store will be updated to newVal, returns promise with success bool.
  @action
  setItems(path, newVal, action) {
    return new Promise((resolve, reject) => {
      let edited_id = path.split(".")[0]; // item id
      let edited_key = path.split(".")[1]; // edited key

      if (action === "add") {
        // Add new item to this.items
        this.items.push(newVal);
      } else {
        // search array for item with same id, edit that item
        for (let item of this.items) {
          if (item.id === edited_id) {
            item[`${edited_key}`] = newVal;
          }
        }
      }
      resolve(true);
    });
  }

  // Ref: MenuBoard.js & Menus.js
  // Des: Will sort all items belonging to the menuInView into there categories, specially
  //      formatted for the menu boards. if action is add, new lane (category is added).
  // Pre: if action != add, menuInView in menuSubStore must be set to a valid menu.
  // Post: menuSubStore's formattedCategories will be set to the formatted array of categories + items
  //       if action is add then formatted catagories will have a new category.
  @action
  setFormattedCategories(action = "") {
    // Adds a new lane to the formattedCategories(category)
    if (action === "add") {
      this.menuSubStore.formattedCatagories.push({
        id: "New Category",
        title: "New Category",
        cards: []
      });
    }
    // Makes a lane for each category for the menuInView then adds all items data to the cards array
    else {
      let tempCats = []; // This will replace our formattedCatagories
      let menuName = this.menuSubStore.menuInView; // The menu in views name
      let categories = []; // list of known categories
      let count = 0; // used to track element index
      let targetIndex; // saves the index to push to

      // make new lane for each known category
      for (let m in toJS(this.menus[`${menuName}`])) {
        if (m !== "time_active") {
          // adds cat to know categories
          categories.push(m);

          tempCats.push({
            id: m,
            title: m,
            cards: []
          });
        }
      }

      // iterate through each cat
      for (let cat of categories) {
        // for each array of items in each category
        for (let id of this.menus[`${menuName}`][`${cat}`].items) {
          // find the index of id in this.items by id
          targetIndex = this.items
            .map(i => {
              return i.id;
            })
            .indexOf(id);

          // push new card to the tempCats using items at targetIndex
          tempCats[`${count}`].cards.push(this.items[targetIndex]);
        }

        count++; //increment count
      }

      this.menuSubStore.formattedCatagories = tempCats;
    }
  }

  // Ref: ItemCard.js
  // Des: Changes the item which will appear in modal
  // Pre: newMenuInView must be a valid name (string & exists)
  // Post: menuInView will be updated with newMenuInView
  @action
  setMenuInView(newMenuInView) {
    this.menuSubStore.menuInView = newMenuInView;
  }

  // ==================== SETS OBSERVABLES: END ==================== //

  // ==================== READS FROM DATABASE: START ==================== //
  /*
   *  These functions read from firestore, they do not mutate the db in any way,
   *  however some functions may mutate store observables. Each function should be
   *  camelCased and prefixed with 'read'.
   *
   *  Contents:
   *      1. readPlaces()
   *      2. readItems()
   *      3. readMenus()
   *
   */

  // Ref: Profile.js
  // Des: This function grabs all the info for place with placeId and converts database time
  //      to human readable time.
  // Pre: PlaceId must be valid (exist in db)
  // Post: profileSubStore will be updated with new data, with formatted hours.
  @action
  readPlaces(placeId) {
    RequestHandler.getDocument("Places", placeId).then(
      action("success", res => {
        if (res.exists) {
          let tempRetObj = { formatted_hours: [] };
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
              open: moment(h.open, "HH:mm").format("h:mm a"),
              close: moment(closeTime, "HH:mm").format("h:mm a")
            };

            // increment count to next day
            count++;
          }

          // copy unformatted hours to have the time open for available to components
          let unformatted_hours = {
            unformatted_hours: res.data().hours
          };

          this.profileSubStore.profileData = {
            ...res.data(),
            ...tempRetObj,
            ...unformatted_hours
          };

          this.profileSubStore.loading = false;
        }
      })
    );
  }

  // Ref: Items.js & Menus.js
  // Des: Grabs all items from Items document in firestore, and maps it to local
  //      array of items.
  // Pre: placeId must be valid.
  // Post: this.items will contained an unorganized array of items, Returns promise with fetch success bool
  @action
  readItems(placeId) {
    return new Promise((resolve, reject) => {
      // clear array to push to
      this.items = [];

      // Get all Items from DB
      RequestHandler.getDocument("Items", placeId)
        .then(
          action("success", res => {
            if (res.exists) {
              // map data() to local var
              let data = res.data();

              // Convert the object of Items into an array of items with the key being the objects id
              this.items = Object.keys(data).map(key => {
                return { ...data[key], ...{ id: key } };
              });

              // loading finished
              this.itemSubStore.loading = false;

              // resolve promise (success)
              resolve(true);
            } else {
              console.log("Items do not exist");
              reject(false);
            }
          })
        )
        .catch(err => {
          console.log(`Catched at CreateTabStore, readItems(): ${err}`);
          reject(err);
        });
    });
  }

  // Ref: Menus.js
  // Des: Grabs all Menus from Menus document in firestore, and maps it to local
  //      formated object.
  // Pre: placeId must be valid.
  // Post: this.menus will contained a formatted object mirroring firebase
  @action
  readMenus(placeId) {
    // clear array to push to
    this.menu = [];

    RequestHandler.getDocument("Menus", placeId)
      .then(
        action("success", res => {
          if (res.exists) {
            // map data() to local var
            let data = res.data();

            this.menus = data;

            for (let men in this.menus) {
              let itemCount = 0;
              let catCount = 0;

              for (let cat in this.menus[`${men}`]) {
                if (cat !== "time_active") {
                  catCount++;
                  itemCount =
                    itemCount + this.menus[`${men}`][`${cat}`].items.length;
                }
              }

              this.menusStats.push({
                name: men,
                numCategories: catCount,
                numItems: itemCount,
                timeActive: this.menus[`${men}`].time_active,
                isActive: true
              });
            }

            // loading finished
            this.menuSubStore.loading = false;
          } else {
            console.log("Items do not exist");
          }
        })
      )
      .catch(err => {
        console.log(`Catched at CreateTabStore, readItems(): ${err}`);
      });
  }

  // ==================== READS FROM DATABASE: END ==================== //

  // ==================== WRITES TO DATABASE: START ==================== //
  /*
   *  These functions write to firestore. Each function should be
   *  camelCased and prefixed with 'write'.
   *
   *  Contents:
   *      1. writePlaces()
   *      2. writeItems()
   *      3. writeItemCategory()
   *      4. writeNewCategoryName()
   *      5. writeMenus()
   */

  // Ref: Profile.js
  // Des: Writes the edited data to firebase
  // Pre: placeId must be valid & exist
  // Post: For the keys updated, controlled by DBUpdateKeys, firebase will
  //       be updated with the new key/value pairs.
  @action
  writePlaces(placeId) {
    let updateQueued = false;
    let tempObj = {};

    // only change the updated values
    for (let k in this.profileSubStore.DBUpdatedKeys) {
      if (this.profileSubStore.DBUpdatedKeys[`${k}`]) {
        if (k === "hours") {
          tempObj[`${k}`] = this.profileSubStore.profileData.unformatted_hours;
        } else {
          tempObj[`${k}`] = this.profileSubStore.profileData[`${k}`];
        }

        // reset flag, trigger update
        this.profileSubStore.DBUpdatedKeys[`${k}`] = false;
        updateQueued = true;
      }
    }

    // update if necessary
    if (updateQueued) {
      RequestHandler.updateDocument("Places", placeId, tempObj).then(res => {
        console.log("updated");
      });
    }
  }

  // Ref: ItemModal.js & Items.js
  // Des: Updates the Items element with placeId and path to newVal.
  // Pre: placeId and path must be valid (exists in db) and string format,
  //      newVal should follow the format of its key.
  // Post: if successful, Items document will be updated, otherwise error will be caught
  @action
  writeItems(placeId, path, newVal) {
    //format object to update store with
    let tempObj = {};
    tempObj[path] = newVal;

    RequestHandler.updateDocument("Items", placeId, tempObj)
      .then(res => {
        console.log("Items updated");
      })
      .catch(err => {
        console.log(`Error at writeItems() in CreateTabStore.js: ${err}`);
      });
  }

  // Ref: MenuBoard.js
  // Des: Moves item to a new category or moves Items position in category
  //      and writes update to firestore. Either way the positioning of each item is preserved
  // Pre: men must be valid menu name, both oldCat and newCat must be valid
  //      category (string & exists), itemId must exist
  // Post: Firestore will be updated with the new menu
  @action
  writeItemCategory(placeId, men, itemId, oldCat, newCat, position) {
    // Changing Categories
    if (oldCat !== newCat) {
      let catObjCopy = this.menus;
      let count = 0;

      // if the newCat is literally a newly added category ie it dne in firestore
      // if (catObjCopy[`${newCat}`] === undefined) {
      //   let tempObj = {};
      //   tempObj[`${newCat}`] = { type_description: "" };

      //   // merge the new obj with catObjCopy
      //   catObjCopy = { ...catObjCopy, ...tempObj };
      // }

      // add object to the new category
      catObjCopy[`${men}`][`${newCat}`].items.splice(position, 0, itemId);

      // remove from old cat
      for (let id of catObjCopy[`${men}`][`${oldCat}`].items) {
        if (id === itemId) {
          catObjCopy[`${men}`][`${oldCat}`].items.splice(count, 1);
        }
        count++;
      }

      // Update firebase
      RequestHandler.setDocument("Menus", placeId, catObjCopy);
    }
    // Changing position in a category
    else {
      let catObjCopy = this.menus;
      let count = 0;
      let temp = null;
      let oldIndex = -1;

      console.log(itemId);

      // remove from old cat
      for (let id of catObjCopy[`${men}`][`${newCat}`].items) {
        if (id === itemId) {
          oldIndex = count;
        }

        count++;
      }

      temp = catObjCopy[`${men}`][`${newCat}`].items[position];
      catObjCopy[`${men}`][`${newCat}`].items[position] = itemId;
      catObjCopy[`${men}`][`${newCat}`].items[oldIndex] = temp;
      catObjCopy[`${men}`][`${newCat}`].items;

      // Update firebase
      RequestHandler.setDocument("Menus", placeId, catObjCopy);
    }
  }

  // Ref: MenuBoard.js
  // Des: Updates category names.grabs the menu in view from firestore then will do one of the two
  //      things. Will create new cat object with new name write it to database then
  //      deletes the old object (essentially replacing) /OR/ Will create new cat object and
  //      write to database
  // Pre: men must be valid menu name, both oldCat and newCat must be valid
  //      category (string & exists), itemId must exist
  // Post: Firebase will be updated with the new category
  @action
  writeNewCategoryName(placeId, men, oldCat, newCat) {
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
            this.writeItems(placeId, `${men}`, catObjCopy);
          }
        }
        // Create new category and add it to firestore
        else {
          catObjCopy[`${newCat}`] = {};
        }
      }
    });
  }

  // Ref: MenuBoard.js
  // Des: Will remove item from menu
  // Pre: men must be valid menu name, both oldCat and newCat must be valid
  //      category (string & exists), itemId must exist
  // Post: Firebase will be updated with the menu
  @action
  writeMenus(placeId, menu, cat, itemId) {
    let oldMenu = this.menus; // copy of menus
    let newMenu = oldMenu; // copy of the copy...
    let tempEditedCat = []; // new items array

    // iterate through the menu/category items array and copy all items except the one to delete
    for (let item of oldMenu[`${menu}`][`${cat}`].items) {
      if (item !== itemId) {
        tempEditedCat.push(item);
      }
    }

    // replace old menu/category items array with new one without delete item
    newMenu[`${menu}`][`${cat}`].items = tempEditedCat;

    // write to db
    RequestHandler.setDocument("Menus", placeId, newMenu);
  }

  @action
  writeMenuSettings(placeId, menu, newData) {
    let dataKeys = Object.keys(newData);

    // If the old key exists replace it make sure new data is not null
    if (menu in this.menus && dataKeys.length >= 1) {
      
      // Make sure the new menu name is not the same as the old update the name
      if (menu !== newData.name && dataKeys.indexOf('name') >= 0 && newData.name !=="") {
        // Taken from stack overflow. does some magic to delete and add keys
        Object.defineProperty(
          this.menus,
          newData.name,
          Object.getOwnPropertyDescriptor(this.menus, menu)
        );

        // delete the old key
        delete this.menus[menu];

        // Update all local caches.
        this.menuCategories = this.menuCategories.filter(e => e !== menu);
        this.menuCategories.push(newData.name);
        this.menuSubStore.menuInView = newData.name;
        this.setFormattedCategories();

        for(let m of this.menusStats) {          
          if(m.name === menu) {
            m.name = newData.name;
          }
        }        
      }

      if(dataKeys.indexOf('start')>= 0) {
        this.menus[menu].time_active.start = newData.start;
      }

      if(dataKeys.indexOf('duration')>= 0) {
        this.menus[menu].time_active.duration = newData.duration;
      }

      RequestHandler.setDocument("Menus", placeId, this.menus)
      .then(res => {
        console.log("Menus updated");
      })
      .catch(err => {
        console.log(`Error at writeItems() in CreateTabStore.js: ${err}`);
      });
    }
    console.log(this.menus);
  }
  // ==================== WRITES TO DATABASE: END ==================== //

  // ==================== DELETES: START ==================== //
  /*
   *  These functions deletes objects first from the database then from the local
   *  cache. Must be prefixed by delete
   *
   *  Contents:
   *      1. deleteItem()
   *
   */

  // Ref: Items.js
  // Des: Will delete an item with the delKey from db and local cache
  // Pre: placeId must exist in the Items collection, delKey must also exist
  // Post: the item with delKey will be removed from firestore and local cache returns promise
  //       with status (bool) so that you can make changes after this function has run.
  @action
  deleteItem(placeId, delKey) {
    return new Promise(resolve => {
      // Delete delKey from firebase
      RequestHandler.deleteKey("Items", placeId, delKey)
        .then(
          action("success", res => {
            // If successful continue by removing item from local cache
            let tempItems = [];

            // copies all items except the delKey
            for (let item of this.items) {
              if (item.id !== delKey) {
                tempItems.push(item);
              }
            }

            // reset items
            this.items = [];
            this.items = tempItems;

            // resolve function status
            resolve(true);
          })
        )
        .catch(err => {
          console.log("err");
        });
    });
  }
  // ==================== DELETES: END ==================== //
}

export default new CreateTabStore();
