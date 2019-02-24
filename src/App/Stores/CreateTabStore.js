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
 *      2. READS FROM DATABASE
 *      3. WRITES TO DATABASE
 *      4. SETS OBSERVABLE
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
    @observable menus = []; // list of menu names for a place
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

    // ==================== READS FROM DATABASE: START ==================== //
    /*
     *  These functions read from firestore, they do not mutate the db in any way,
     *  however some functions may mutate store observables. Each function should be
     *  camelCased and prefixed with 'read'.
     *
     *  Contents:
     *      1. readPlaces()
     *      2. readItems()
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
                        var closeDec =
                            offset + openHour + openForHour + openForMin / 100;

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
    // Des: Grabs all items from MenuData document in firestore, and maps it to local
    //      formated array of items. function then calls this.setMenuCategories(); to build
    //      tree relationship between menus categories and items
    // Pre: placeId must be valid.
    // Post: this.menus will be updated with all the menu names, this.items will contained an
    //       unorganized array of items, and setMenuCategories will be ran (see function
    //       declaration for more details).
    @action
    readItems(placeId) {
        // clear array to push to
        this.menus = [];
        this.items = [];

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

                        this.setMenuCategories();
                        this.itemSubStore.loading = false;                        
                    } else {
                        console.log("menu does not exist");
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
     *
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
                    tempObj[
                        `${k}`
                    ] = this.profileSubStore.profileData.unformatted_hours;
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
            RequestHandler.updateDocument("Places", placeId, tempObj).then(
                res => {
                    console.log("updated");
                }
            );
        }
    }

    // Ref: ItemModal.js
    // Des: Updates the element with placeId and path to newVal.
    // Pre: placeId and path must be valid (exists in db) and string format,
    //      newVal should follow the format of its key.
    // Post: if successful, menus document will be updated, otherwise error will be caught
    @action
    writeItems(placeId, path, newVal) {
        //format object to update store with
        let tempObj = {};
        tempObj[path] = newVal;

        RequestHandler.updateDocument("Menus", placeId, tempObj)
            .then(res => {
                console.log("updated");
            })
            .catch(err => {
                console.log(
                    `Error at writeItems() in CreateTabStore.js: ${err}`
                );
            });
    }

    // Ref: ItemModal.js & MenuBoard.js
    // Des: Moves item to a new category and writes update to firestore
    // Pre: men must be valid menu name, both oldCat and newCat must be valid
    //      category (string & exists), itemId must exist
    // Post: Firestore will be updated with the new categories & items
    @action
    writeItemCategory(placeId, men, itemId, oldCat, newCat) {
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
                this.writeItems(placeId, `${men}`, catObjCopy);
            }
        });
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

    // ==================== WRITES TO DATABASE: END ==================== //

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
     *      6. setMenuCategories()
     *
     */

    // Ref: ItemCard.js & MenuBoard.js
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
                    this.profileSubStore.profileData.formatted_hours[
                        `${keys[1]}`
                    ]["open"].split(":")[0]
                );
                let old_m = Number(
                    this.profileSubStore.profileData.formatted_hours[
                        `${keys[1]}`
                    ]["open"]
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
                this.profileSubStore.profileData.unformatted_hours[
                    `${keys[1]}`
                ][`${keys[2]}`] = `${add_h}:${add_m}`;
            } else {
                // update the local store the formated and unformatted hour for that day
                this.profileSubStore.profileData.formatted_hours[`${keys[1]}`][
                    `${keys[2]}`
                ] = newVal;
                this.profileSubStore.profileData.unformatted_hours[
                    `${keys[1]}`
                ][`${keys[2]}`] = newVal.split(" ")[0];
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

    // Ref: ItemModal.js
    // Des: This updates this.items key with the given path to the newVal
    // Pre: path must be formatted as a period separated string, with the 3(el 2) string being the uuid of the item
    //      and the 4(el 3) string being the name of the key to edit. EX: "Food Menu.Deserts.4a4f4380-0c01-11e9-a3e5-cd6beef52e09.name"
    //      value must match key required formatting
    // Post: Then path in this local store will be updated to newVal
    @action
    setItems(path, newVal) {
        let edited_id = path.split(".")[2];
        let edited_key = path.split(".")[3];

        for (let item of this.items) {
            if (item.id === edited_id) {
                item[`${edited_key}`] = newVal;
            }
        };
    }

    // Ref: Menus.js
    // Des: Will sort all items belonging to the menuInView into there categories, specially
    //      formatted for the menu boards. if action is add, new lane (category is added).
    // Pre: if action != add, menusTree and menuCategories should not be empty (must be already sorted).
    //      menuInView in menuSubStore must also be set to a valid menu.
    // Post: menuSubStore's formattedCategories will be set to the formatted array of categories + items
    //       if action is add then formatted catagories will have a new category.
    @action
    setFormattedCategories(action = "") {
        if (action === "add") {
            this.menuSubStore.formattedCatagories.push({
                id: "New Category",
                title: "New Category",
                cards: []
            });
        } else {
            let tempCats = []; // This will replace our formattedCatagories
            let menuName = this.menuSubStore.menuInView; // The menu in views name

            // make new lane for each known category
            for (let m of toJS(this.menusTree[`${menuName}`])) {
                tempCats.push({
                    id: m,
                    title: m,
                    cards: []
                });
            }

            // Move items to there lanes
            for (let i of toJS(this.items)) {
                // if it is the menu in view then format the card
                if (i.menu === menuName) {
                    let el0 = 0; // index of category
                    let count = 0; // used to track element index

                    // search for the index of the items category to push to temp cats
                    for (let t of tempCats) {

                        // if the category matches then return the index of the category
                        if (t.id === i.category) {
                            el0 = count;
                            count = 0;
                            break;
                        }
                        count++; //increment count
                    }

                    // push new card to the tempCats
                    tempCats[`${el0}`].cards.push(i);
                }
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

    // Ref: CreateTabStore.js (yes this class :D)
    // Des: Will sort all items into its tree, as well as record all
    //      categories encountered.
    // Pre: this.items should not be empty.
    // Post: menuCategories will be reset with all the category names, and
    //       menusTree will be reset preserving the new parent child relationship
    //       between menus -> categories -> items.
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

    // ==================== SETS OBSERVABLES: END ==================== //
}

export default new CreateTabStore();
