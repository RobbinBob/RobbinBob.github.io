var apiJson;

function FindElementWithName(name) {
   const classes = apiJson.classes;
   for(var i = 0; i < classes.length; ++i) {
      if(classes[i].full_name == name)
         return classes[i];
   }
   return null;
}
function GetTypeName(full_name) {
   return full_name.split('.').reverse()[0];
}
function GetNamespace(full_name) {
   var comps = full_name.split('.').splice(0, full_name.split('.').length - 1)

   var namespace = "";

   for(var i = 0; i < comps.length; ++i) {
      if (i > 0) {
         namespace += '.';
      }
      namespace += comps[i];
   }

   return namespace;
}
function GetReturn(return_obj) {
   if(return_obj == null) {
      return "void";
   } else {
      if(return_obj.split('.').length == 1) {
         return return_obj;
      } else {
         return GetTypeName(return_obj);
      }
   }
}
function GetExtends(type_obj) {
   if(type_obj.extends == null || type_obj.extends == "none") {
      if(type_obj.type == "class") {
         return `extends Object`;
      } else {
         return ``;
      }
   }else {
      return `extends ${GetTypeName(type_obj.extends)}`;
   }
}
function GetImplements(type_obj) {
   //console.log(type_obj.type == "class")
   if(type_obj.implements == null || type_obj.implements.length == 0) {
      return '';
   } else {
      if(type_obj.type =="class") {
         var implements = 'implements ';
         for(var i = 0; i < type_obj.implements.length; ++i) {
            if(i > 0) implements += ', ';
            implements += GetTypeName(type_obj.implements[i]);
         }
         return implements;
      } else {
         return '';
      }
   }
}
function GetArguments(args_obj) {
   if(args_obj == null || args_obj.length == 0) {
      return '';
   } else {
      var args = '';
      for(var i = 0; i < args_obj.length; ++i) { 
         if(i > 0) args += ', ';
         args += `${GetTypeName(args_obj[i].type)} ${args_obj[i].name}`;
      }
      return args;
   }
}

function GetInheritedMembers(parent_name) {
   console.log(`Finding inherited members for type ${parent_name}`);
   var type = null;
   for(var i = 0; i < apiJson.classes.length; ++i) {
      if(apiJson.classes[i].full_name.includes('.' + parent_name)) {
         console.log(`Found type with name ${apiJson.classes[i].full_name}`);
         type = apiJson.classes[i];
      }
   }
   if(type == null)
      return [];
   
   var inheritedMembers = [];
   var members = type.members;
   if(members.length > 0) {
      for(var i = 0; i < members.length; ++i) {
         var member = members[i];
         var accessor = member.accessor;

         if (accessor.includes('public') || accessor.includes('protected'))
            inheritedMembers.push(member);
      }
   }

   var baseInheritedMembers = GetInheritedMembers(type.extends);
   if (baseInheritedMembers != null && baseInheritedMembers.length > 0) {
      for(var i = 0; i < baseInheritedMembers.length; ++i)  
         inheritedMembers.push(baseInheritedMembers[i]);
   }

   return inheritedMembers;
}
function GetInheritedMethods(parent_name) {
   console.log(`Searching type with name ${parent_name}`);
   var type = null;
   for(var i = 0; i < apiJson.classes.length; ++i) {
      if(apiJson.classes[i].full_name.includes('.' + parent_name)) {
         console.log(`Found type with name ${apiJson.classes[i].full_name}`);
         type = apiJson.classes[i];
      }
   }
   if(type == null)
      return [];

   var inheritedMethods = [];
   var methods = type.methods;
   if(methods != null && methods.length > 0) {
      for(var i = 0; i < methods.length; ++i) {
         var method = methods[i];
         var accessor = method.accessor;

         if(accessor.includes('public') || accessor.includes('protected'))
            inheritedMethods.push(method);
      }
   }

   var baseInheritedMethods = GetInheritedMethods(type.extends);
   if(baseInheritedMethods != null && baseInheritedMethods.length > 0) {
      for(var i = 0; i < baseInheritedMethods.length; ++i)
         inheritedMethods.push(baseInheritedMethods[i]);
   }


   return inheritedMethods;
}

function CreateMemberHtml(member_obj) {
   var divNode = document.createElement("div");
   divNode.setAttribute("style", "width:100%;height:auto;");

   var paraNode = document.createElement("p");
   paraNode.textContent = member_obj.description;

   var preNode = document.createElement("pre");
   var codeNode = document.createElement("code");
   codeNode.setAttribute("class", "hljs language-java");
   preNode.appendChild(codeNode);

   divNode.appendChild(paraNode);
   divNode.appendChild(preNode);

   codeNode.textContent = `${member_obj.accessor} ${member_obj.type} ${member_obj.name}`;
   return divNode;
}
function CreateMethodHtml(method_obj) {
   var divNode = document.createElement("div");
   divNode.setAttribute("style", "width:100%;height:auto;");

   var paraNode = document.createElement("p");
   paraNode.textContent = method_obj.description;

   var preNode = document.createElement("pre");
   var codeNode = document.createElement("code");
   codeNode.setAttribute("class", "hljs language-java");
   preNode.appendChild(codeNode);
   divNode.appendChild(paraNode);

   if(method_obj.return_desc != null && method_obj.return_desc != 'No Description Supplied.') {
      paraNode = document.createElement("p");
      paraNode.textContent = `Return - ${method_obj.return_desc}`;
      divNode.appendChild(paraNode);
   }

   if(method_obj.args != null && method_obj.args.length > 0) {
      for(var i = 0; i < method_obj.args.length; ++i) {
         paraNode = document.createElement("p");
         paraNode.textContent = `${method_obj.args[i].name} - ${method_obj.args[i].description}`;
         divNode.appendChild(paraNode);
      }
   }

   divNode.appendChild(preNode);
   codeNode.textContent = `${method_obj.accessor} ${GetReturn(method_obj.return)} ${method_obj.name}(${GetArguments(method_obj.args)})`;
   return divNode;
}



function LoadTypeContent(typeId) {
   console.log("Loading type content for type " + typeId);

   const typeObject = FindElementWithName(typeId);
   if(typeObject == null) {
      console.log(`Failed to load type information for type | ${typeId}`);
      // TODO - Make this display an error in the type information window on the web page
      return;
   }

   const typeName = GetTypeName(typeId);
   document.getElementById("api-element-name").textContent = typeName;

      // Load a small description about the type being displayed
   if(typeObject.description == null) {
      document.getElementById("api-element-description").textContent = "No type description found :(";
   } else {
      document.getElementById("api-element-description").textContent = typeObject.description;
   }

      // Create package nodes
   var preNode = document.createElement("pre");
   var codeNode = document.createElement("code");
   codeNode.setAttribute("class", "hljs language-java");
   preNode.appendChild(codeNode);
   codeNode.textContent = `package ${GetNamespace(typeId)}`;
   var packageDiv = document.getElementById("api-element-package");
   packageDiv.innerHTML = '';
   packageDiv.appendChild(preNode);

      // Create declaration nodes
   preNode = document.createElement("pre");
   codeNode = document.createElement("code");
   codeNode.setAttribute("class", "hljs language-java");
   preNode.appendChild(codeNode);
   codeNode.textContent = `${typeObject.accessor} ${typeObject.type} ${typeName} ${GetExtends(typeObject)} ${GetImplements(typeObject)}`;
   var declarationDiv = document.getElementById("api-element-declaration");
   declarationDiv.innerHTML = '';
   declarationDiv.appendChild(preNode);

      // Create constructor nodes
   const constructorContainer = document.getElementById("api-element-constructors");
   constructorContainer.innerHTML = '';
   const constructors = typeObject.constructors;
   const constructorsWrapper = document.getElementById("api-element-constructors-wrapper");
   if(constructors != null && constructors.length > 0) {
      constructorsWrapper.style.display = 'block';
      for(var i = 0; i < constructors.length; ++i) {
         var constructor = constructors[i];

         divNode = document.createElement("div");
         divNode.setAttribute("style", 'width:100%;height:auto;');

         var paraNode = document.createElement("p");
         paraNode.textContent = constructor["description"];

         preNode = document.createElement("pre");
         codeNode = document.createElement("code");
         codeNode.setAttribute("class", "hljs language-java");
         preNode.appendChild(codeNode);
         divNode.appendChild(paraNode);
         
         if(constructor.args != null || constructor.args.length > 0) {
            for(var l = 0; l < constructor.args.length; ++l) {
               paraNode = document.createElement("p");
               paraNode.textContent = `${constructor.args[l].name} - ${constructor.args[l].description}`;
               divNode.appendChild(paraNode);
            }
         }

         divNode.appendChild(preNode);

         codeNode.textContent = `${constructor.accessor} ${typeName}(${GetArguments(constructor.args)})`;
         constructorContainer.appendChild(divNode);
      }
   }
   else
      constructorsWrapper.style.display = 'none';

      // Create members
   const memberContainer = document.getElementById("api-element-members");
   memberContainer.innerHTML = '';
   const members = typeObject.members;
   const membersWrapper = document.getElementById("api-element-members-wrapper");
   if(members != null && members.length > 0) {
      membersWrapper.style.display = 'block';
      for(var i = 0; i < members.length; ++i)
         memberContainer.append(CreateMemberHtml(members[i]));
   }
   else
      membersWrapper.style.display = 'none';


   const inheritedMemberContainer = document.getElementById("api-element-inherited-members");
   inheritedMemberContainer.innerHTML = '';
   const inheritedMembers = GetInheritedMembers(typeObject.extends);
   const inheritedMembersWrapper = document.getElementById("api-element-inherited-members-wrapper");
   if(inheritedMembers != null && inheritedMembers.length > 0) {
      inheritedMembersWrapper.style.display = 'block';
      for(var i = 0; i < inheritedMembers.length; ++i)
         inheritedMemberContainer.append(CreateMemberHtml(inheritedMembers[i]));
   }
   else
      inheritedMembersWrapper.style.display = 'none';

      // Create methods
   const methodContainer = document.getElementById("api-element-methods");
   methodContainer.innerHTML = '';
   const methods = typeObject.methods;
   const methodsWrapper = document.getElementById("api-element-methods-wrapper");
   if(methods != null && methods.length > 0) {
      methodsWrapper.style.display = 'block';
      for(var i = 0; i < methods.length; ++i)
         methodContainer.appendChild(CreateMethodHtml(methods[i]));
   }
   else
      methodsWrapper.style.display = 'none';
   
   const inheritedMethodContainer = document.getElementById("api-element-inherited-methods");
   inheritedMethodContainer.innerHTML = '';
   const inheritedMethods = GetInheritedMethods(typeObject.extends);
   const inheritedMethodsWrapper = document.getElementById("api-element-inherited-methods-wrapper")
   if(inheritedMethods != null && inheritedMethods.length > 0) {
      inheritedMethodsWrapper.style.display = 'block';
      for(var i = 0; i < inheritedMethods.length; ++i)
         inheritedMethodContainer.append(CreateMethodHtml(inheritedMethods[i]));
   }
   else  
      inheritedMethodsWrapper.style.display = 'none';


   hljs.highlightAll();
}

var path = 'https://raw.githubusercontent.com/RobbinBob/NLVMCore/main/build/api.json';
const IS_DEVELOPMENT = false;
if(IS_DEVELOPMENT) {
   path = "generated_api.json";
}

fetch(path).then(response => {
   if(!response.ok)
      {
         throw new Error(`Http error | Status ${response.status}`);
      }
   return response.json();
})
.then(data => {
   apiJson = data;

   const classes = apiJson.classes;
   const types = document.getElementById("api-overview");
   types.innerHTML = '';

   var typeHtml = "";

      // Creates a list of types in the overview
   for(var i = 0; i < classes.length; ++i) {
      var typeData = classes[i];

      const aNode = document.createElement("a")
      aNode.setAttribute("class", "api-element");
      aNode.setAttribute("id", typeData.full_name);

      const h4Node = document.createElement("h4");
      h4Node.setAttribute("class", "api-element-text");
      h4Node.textContent = typeData.full_name;

      aNode.appendChild(h4Node);
      types.appendChild(aNode);

      aNode.addEventListener("click", function() {
         LoadTypeContent(this.getAttribute("id"));
      })
   }

   LoadTypeContent(classes[0].full_name);
})
.catch(error => console.error(`Error fetching json`, error));