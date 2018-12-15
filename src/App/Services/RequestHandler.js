import * as firebase from 'firebase';
import 'firebase/firestore';

export default class RequestHandler {

    static initFirebase() {
        // Initialize Firebase
        var config = {

        };
        firebase.initializeApp(config);

        // Initialize Cloud Firestore through Firebase
        this.fs = firebase.firestore();

        console.log("init firestore");
        // Some nonsense...
        this.fs.settings({ timestampsInSnapshots: true });
    }
    
    // @Def: sets document with body, if doc dne then it will create it
    // @Param: col = target collection
    //         doc = target document
    //         body = json object to write
    //       edit the existing object, else it will make a new obj.
    // @Post: returns promise
    static setDocument(col: string, doc: string, body: Object) {    
        return(
            this.fs.collection(col).doc(doc).set(body)
        )
    }

    // @Def: Updates key with new value
    // @Param: col = target collection
    //         doc = target document
    //         body = contains key value pair to change
    // @Post: returns promise
    static updateDocument(col: string, doc: string, body: Object) {    
        return(
            this.fs.collection(col).doc(doc).update(body)
        )
    }

    // @Def: gets a document 
    // @Param: col = target collection
    //         doc = target document
    // @Post: returns promise
    static getDocument(col: string, doc: string) {
        return(
            this.fs.collection(col).doc(doc).get()
        )
    }

    // @Def: gets documents
    // @Param: col = target collection
    //         query = query expression
    //         queryKey = key in expression
    //         queryValue = value in expression
    // @Post: returns promise
    static findDocuments(col: string, queryKey: string, query: string, queryValue: any, limit: number) {
        return(
            this.fs.collection(col).where(queryKey, query, queryValue).limit(limit).get()
        )
    }

    // @Def: Appends to Document Array, note that document must exist
    // @Param: col = target collection
    //         doc = target document
    //         updateKey = key to change
    //         updateBody = value to change
    // @Post: returns promise
    static appendToArray(col: string, doc: string, updateKey:string, updateBody ) {
        var tempObj = {};
        tempObj[updateKey] = firebase.firestore.FieldValue.arrayUnion(updateBody);

        console.log(tempObj);
        return(
            this.fs.collection(col).doc(doc).update(tempObj)
        )
}
}
