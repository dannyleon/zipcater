const CONSTRUCTOR_TOKEN = Symbol('polymerfire-firestore-mixin-constructor');
const CONNECTED_CALLBACK_TOKEN =
    Symbol('polymerfire-firestore-mixin-connected-callback');
const PROPERTY_BINDING_REGEXP = /{([^{]+)}/g;
const isOdd = (x) => x & 1 === 1;
const parsePath = (path) => {
    const parts = path.split(PROPERTY_BINDING_REGEXP);
    let literals = [],
        props = [];
    parts.forEach((part, index) => {
        (isOdd(index) ? props : literals).push(part);
    })
    return {
        literals,
        props
    };
}
const stitch = (literals, values) => {
    let whole = '';
    for (var i = 0; i < literals.length; i++) {
        whole += literals[i];
        whole += values[i] || '';
    }
    return whole;
}
const collect = (what, which) => {
    let res = {};
    while (what) {
        res = Object.assign({}, what[which], res); // Respect prototype priority
        what = Object.getPrototypeOf(what);
    }
    return res;
};
const iDoc = (snap) => {
    if (snap.exists) {
        return Object.assign({
            __id__: snap.id
        }, snap.data());
    } else {
        return null;
    }
}
const TRANSFORMS = {
    doc: iDoc,
    collection: (snap) => snap.empty ? [] : snap.docs.map(iDoc),
}

/**
 * @polymer
 * @mixin
 */
export const FirestoreMixin = (baseElement) => class extends baseElement {
    static _assertPropertyTypeCorrectness(prop) {
        const errorMessage = (listenerType, propertyType) =>
            `FirestoreMixin's ${listenerType} can only be used with properties ` +
            `of type ${propertyType}.`;
        const assert = (listenerType, propertyType) => {
            if (prop[listenerType] !== undefined && prop.type !== propertyType) {
                throw new Error(errorMessage(listenerType, propertyType.name));
            }
        }
        assert('doc', Object);
        assert('collection', Array);
    }
    constructor() {
        super();
        if (this[CONSTRUCTOR_TOKEN] === true) {
            return;
        }
        this[CONSTRUCTOR_TOKEN] = true;
        this._firestoreProps = {};
        this._firestoreListeners = {};
        this.db = this.constructor.db || firebase.firestore();
        const settings = {timestampsInSnapshots: true};
        this.db.settings(settings);
    }
    connectedCallback() {
        if (this[CONNECTED_CALLBACK_TOKEN] !== true) {
            this[CONNECTED_CALLBACK_TOKEN] = true;
            const props = collect(this.constructor, 'properties');
            Object
                .values(props)
                .forEach(this.constructor._assertPropertyTypeCorrectness);
            for (let name in props) {
                const options = props[name];
                if (options.doc || options.collection) {
                    this._firestoreBind(name, options);
                }
            }
        }
        super.connectedCallback();
    }
    _firestoreBind(name, options) {
        console.log('firestore bind:', name, '/', options)
        const defaults = {
            live: false,
            observes: [],
        }
        const parsedPath = parsePath(options.doc || options.collection);
        const config = Object.assign({}, defaults, options, parsedPath);
        const type = config.type =
            config.doc ? 'doc' : config.collection ? 'collection' : undefined;
        this._firestoreProps[name] = config;
        const args = config.props.concat(config.observes);
        console.log('args:', args)
        
        
        if (args.length > 0) {
            // Create a method observer that will be called every time
            // a templatized or observed property changes
            // const observer =
            //     `_firestoreUpdateBinding('${name}', ${args.join(',')})`
            // this._createMethodObserver(observer);

            // this[args[0]].addListener(e => this._mFirestoreUpdateBinding(name, args));
            // this.dispatchEvent(new CustomEvent('on-args-changed', {detail: {args: args, name: name}}));
            if (!this.argsArray) this.argsArray = []
            
            var argsObject = {
                args: args,
                name: name
            }
            this.argsArray.push(argsObject)
            // this.argsObject = {
            //     args: args,
            //     name: name
            // };
        } else {
            this._firestoreUpdateBinding(name, ...args.map(x => this[x]));
        }
    }

    _firestoreUpdateBinding(name, ...args) {
        console.log('firestore update binding:', name)
        this._firestoreUnlisten(name);
        const config = this._firestoreProps[name];
        const isDefined = (x) => x !== undefined;
        const propArgs = args.slice(0, config.props.length).filter(isDefined);
        const observesArgs = args.slice(config.props.length).filter(isDefined);
        const propArgsReady = propArgs.length === config.props.length;
        const observesArgsReady =
            observesArgs.length === config.observes.length;
        if (propArgsReady && observesArgsReady) {
            const collPath = stitch(config.literals, propArgs);
            const assigner = this._firestoreAssigner(name, config);
            console.log('coll path:', collPath)
            console.log('assigner:', assigner)
            let ref = this.db[config.type](collPath);
            this[name + 'Ref'] = ref;
            if (config.query) {
                ref = config.query.call(this, ref, this);
            }
            this._firestoreListeners[name] = ref.onSnapshot(assigner);
        }
    }
    _firestoreUnlisten(name, type) {
        if (this._firestoreListeners[name]) {
            this._firestoreListeners[name]();
            delete this._firestoreListeners[name];
        }
        this[name] = (type === 'collection' ? [] : null);
        this[name + 'Ref'] = null;
        this[name + 'Ready'] = false;
        // this.setProperties({
        //     [name]: type === 'collection' ? [] : null,
        //     [name + 'Ref']: null,
        //     [name + 'Ready']: false,
        // })
    }
    _firestoreAssigner(name, {
        type,
        live,
        noCache
    }) {
        const makeAssigner = (assigner) => (snap) => {
            const shouldAssign =
                noCache !== true || snap.metadata.fromCache === false;
            if (shouldAssign) {
                assigner.call(this, name, snap);
                this[name + 'Ready'] = true;
                if (live !== true) {
                    this._firestoreListeners[name]();
                }
            }
        }
        if (type === 'doc') {
            return makeAssigner(this._firestoreAssignDocument);
        } else if (type === 'collection') {
            return makeAssigner(this._firestoreAssignCollection);
        } else {
            throw new Error('Unknown listener type.');
        }
    }
    _firestoreAssignDocument(name, snap) {
        this[name] = iDoc(snap);
    }
    _firestoreAssignCollection(name, snap) {
        console.log('firestore assign collection:', name, "/", snap)
        const propertyValueIsArray = Array.isArray(this[name])
        const allDocumentsChanged = snap.docs.length === snap.docChanges().length;
        if (propertyValueIsArray && allDocumentsChanged === false) {
            snap.docChanges().forEach((change) => {
                switch (change.type) {
                    case 'added':
                        this[name].splice(change.newIndex, 0, iDoc(change.doc));
                        break;
                    case 'removed':
                        this[name].splice(change.oldIndex, 1);
                        break;
                    case 'modified':
                        if (change.oldIndex === change.newIndex) {
                            this[name].splice(change.oldIndex, 1, iDoc(change.doc));
                        } else {
                            this[name].splice(change.oldIndex, 1);
                            this[name].splice(change.newIndex, 0, iDoc(change.doc));
                        }
                        break;
                    default:
                        throw new Error(`Unhandled document change: ${change.type}.`);
                }
                console.log('requesting render...')
                this.requestUpdate();
            });
        } else {
            this[name] = snap.docs.map(iDoc);
            this.requestUpdate();
        }
    }
}