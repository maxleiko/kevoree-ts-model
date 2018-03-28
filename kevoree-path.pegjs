// Kevoree Model Path Grammar
// ==========================
//
// Accepts expressions like "/namespaces[kevoree]/deployUnits[kevoree-node-javascript:5.0.0-alpha:hashjfhyfyr937465]"
// And creates a graph like:
// const graph = [
//    {
//       "ref": "namespaces",
//       "key": "kevoree"
//    },
//    {
//       "ref": "deployUnits",
//       "key": "kevoree-node-javascript:5.0.0-alpha:hashjfhyfyr937465"
//    }
// ]

Path
  = "/" refs:RefList? { return refs || []; }

Ref
 = ref:RefString "[" key:KeyString "]" {
   return { ref, key };
 }
 
RefList
  = ref:Ref "/" refs:RefList { return [ref].concat(refs); }
  / ref:Ref { return [ref]; }

RefString "ref"
  = $[a-zA-Z0-9_]+
  
KeyString "key"
  = $[a-zA-Z0-9_:.-]+