import * as firebase from 'firebase';
import 'firebase/firestore';
import { Config } from '../../env';

export default class RequestHandler {

    static initFirebase() {
        // Initialize Firebase
        var config = Config;
        firebase.initializeApp(config);

        // Initialize Cloud Firestore through Firebase
        this.fs = firebase.firestore();

        console.log("init firestore");
        // Some nonsense...
        this.fs.settings({ timestampsInSnapshots: true });
    }

    static listenToDoc() {
        return(
            this.fs.collection("Menus").doc("2l2WLstfnWfsYlGEJHdc")
        )
    }
    
    // @Def: sets document with body, if doc dne then it will create it
    // @Param: col = target collection (string)
    //         doc = target document (string)
    //         body = json object to write (object)
    //       edit the existing object, else it will make a new obj.
    // @Post: returns promise
    static setDocument(col, doc, body) {    
        return(
            this.fs.collection(col).doc(doc).set(body)
        )
    }

    // @Def: Updates key with new value
    // @Param: col = target collection (string)
    //         doc = target document (string)
    //         body = contains key value pair to change (object)
    // @Post: returns promise
    static updateDocument(col, doc, body) {    
        return(
            this.fs.collection(col).doc(doc).update(body)
        )
    }

    // @Def: gets a document 
    // @Param: col = target collection (string)
    //         doc = target document (string)
    // @Post: returns promise
    static getDocument(col, doc) {
        return(
            this.fs.collection(col).doc(doc).get()
        )
    }

    // @Def: gets documents
    // @Param: col = target collection (string)
    //         query = query expression (string)
    //         queryKey = key in expression (string)
    //         queryValue = value in expression (string)
    //         limit = limit to number of docs returned (number)
    // @Post: returns promise
    static findDocuments(col, queryKey, query, queryValue, limit) {
        return(
            this.fs.collection(col).where(queryKey, query, queryValue).limit(limit).get()
        )
    }

    // @Def: Appends to Document Array, note that document must exist
    // @Param: col = target collection (string)
    //         doc = target document (string)
    //         updateKey = key to change (string)
    //         updateBody = value to change (object)
    // @Post: returns promise
    static appendToArray(col, doc, updateKey, updateBody ) {
        var tempObj = {};
        tempObj[updateKey] = firebase.firestore.FieldValue.arrayUnion(updateBody);

        console.log(tempObj);
        return(
            this.fs.collection(col).doc(doc).update(tempObj)
        )
}
}
