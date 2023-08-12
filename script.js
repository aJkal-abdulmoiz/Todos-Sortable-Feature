const form = document.getElementById("todoform");
const todoInput = document.getElementById("newtodo");
const todosListEl = document.getElementById("todos-list");
const notificationEl = document.querySelector(".notification");
const dateInput = document.getElementById("todoDate");
const tagInput = document.getElementById("todoTags");
const todoCat = document.getElementById("todo-Category");
const alphaBtn = document.getElementById("alpha-btn");
const betaBtn = document.getElementById("beta-btn");
const charlieBtn = document.getElementById("charlie-btn");




//outer arrows
const outerLeft = document.getElementById("outerLeftArrow");
const outerRight = document.getElementById("outerRightArrow");

let EditTodoId = -1;//array will not work on -1

// Users object to store todos and tags for each user
const users = {
  alpha: {
    todos: []
  },
  beta: {
    todos: []
  },
  charlie: {
    todos: []
  }
};

// Set initial user to Alpha
let currentUser = "alpha";
let activeButton="alpha-btn";

// Add event listeners to user selection buttons : (Beta) (Alpha) (Charlie)
alphaBtn.addEventListener("click", () => {
  selectUser("alpha");
  activeButton = "alpha-btn";
  
});
betaBtn.addEventListener("click", () => {
  selectUser("beta");
  activeButton = "beta-btn";
});
charlieBtn.addEventListener("click", () => {
  selectUser("charlie");
  activeButton = "charlie-btn";
});


//set the outer arrows funtionality
outerLeft.addEventListener("click", () => {
  if(activeButton=="charlie-btn"){
    selectUser("alpha");
    activeButton = "alpha-btn";
  }
  else if(activeButton=="alpha-btn"){
    selectUser("beta");
    activeButton="beta-btn";
  }
  else if(activeButton=="beta")
  {

  }
  
});


outerRight.addEventListener("click", () => {
  if(activeButton=="beta-btn"){
    selectUser("alpha");
    activeButton = "alpha-btn";
  }
  else if(activeButton=="alpha-btn"){
    selectUser("charlie");
    activeButton="charlie-btn";
  }
  else if(activeButton=="charlie")
  {

  }
  
});


// Select user function
function selectUser(user) {
  // Update the current user
    todoInput.value = ""; // Clear input box before Swtitching user
    dateInput.value = "";
    tagInput.value = "";
    currentUser = user;

    document.getElementById("head").textContent = currentUser.toUpperCase() + "'S Tasks";
    

       // Remove active class from all buttons
   alphaBtn.classList.remove("active");
   betaBtn.classList.remove("active");
   charlieBtn.classList.remove("active");


   // Add active class to selected button
   if (user === "alpha") {
     activeButton = "alpha-btn";
     alphaBtn.classList.add("active");

   } else if (user === "beta") {
     activeButton = "beta-btn";
     betaBtn.classList.add("active");

   } else if (user === "charlie") {
     activeButton = "charlie-btn";
     charlieBtn.classList.add("active");
   }

  
   
   
  // Render the todos for the selected user
  showTodos();
}

// Get the user's todos and tags based on the current user selection
function getUserData() {
  return users[currentUser];
}

//<------------------------------------------------------------------------------------------->
// 1ST RENDER
showTodos();

// FORM SUBMITTING
form.addEventListener("submit", function (event) {
  event.preventDefault();

  saveTodo();
  showTodos();
  localStorage.setItem("users", JSON.stringify(users));
});



// SAVING TODOS
function saveTodo() {
  let { todos} = getUserData(); // Array Destructuring to get the Data of current user
  const todoValue = todoInput.value;
  const todoDate = dateInput.value;
  const todotags = tagInput.value;

  // Checks if the Todo is empty
  const isEmpty = todoValue === "";
  const tisEmpty = todotags === "";

  // Check for duplicate todos
  const isDuplicate = todos.some((todo) => {
    return todo.value === todoValue && todo.date === todoDate;
  });
  const TagisDuplicate = todos.some((todo) => {
    return todo.tags === todotags;
  });

  if (isEmpty) {
    ShowNotification("Please add a Todo Input!");
  } else if (tisEmpty) {
    ShowNotification("Please add some Tags!");
  } else if (isDuplicate) {
    ShowNotification("Task Already Exists!");
  } else if (TagisDuplicate) {
    ShowNotification("Tag Already Exists!");
  } else {
    const tags = todotags.split(" ").map((tag) => {
      return tag;
    });
    console.log(tags);
    if(EditTodoId>=0){
        todos = todos.map((todo,index) =>({
                ...todo,
                value : index === EditTodoId ? todoValue :todo.value,
                tags: index === EditTodoId ? tags : todo.tags,
                date: index ===EditTodoId ? todoDate:todo.date
        }));
        editToDo=-1;
    }
    else{

        todos.push({   //push data in todos array for the current user (Object => alpha/beta/charlie)
            value: todoValue,
            date: todoDate,
            tags: tags,
            checked: false,
            color: "#019f55",
          });
        
    }

    todoInput.value = ""; // Clear input box after adding it
    dateInput.value = "";
    tagInput.value = "";
  }
}

// SHOW TODOS TO USER
function showTodos() {
  let { todos } = getUserData(); //array destructuring (key value)

  if (todos.length === 0) {
    todosListEl.innerHTML = "<center>No Tasks To Do!</center>";
    return;
  }

  // Clear element before re-rendering
  todosListEl.innerHTML = "";
  
  todos.forEach((todo, index) => {
    
    const dueDate = new Date(todo.date);
    const today = new Date();
    let daysLeft = 0;
    console.log("index:", index, "todoId:", todo); // Add this line to check the value of todoId

    
    // Calculate the number of days left using a for loop
    for (let date = today; date < dueDate; date.setDate(date.getDate() + 1)) {
      daysLeft++;
    }
    daysLeft += " Days Left";
    if (daysLeft === "0 Days Left") {
      daysLeft = "Overdue"; //show overdue if daysleft is today or passed that day
    }

    let tagsHTML = "";
    const tagColors = ["#8B0000","#A0522D","#2E8B57","#800080","#663399","#191970","#483D8B","#4169E1"];
    let colorIndex = 0;

    if (todo.tags ) {
      todo.tags.forEach((tag) => {
        let tagColor = tagColors[colorIndex];
        colorIndex = (colorIndex + 1) % tagColors.length;
        tagsHTML += `<span class="tag" style="background-color: ${tagColor};">${tag}</span> `;
      });
    }

    todoCat.innerHTML = `
    <div class="todo-Category">
        <select id="my-dropdown">
            <option class="opt" value="all">All</option>
            <option class="opt" value="groceries">Groceries</option>
            <option class="opt" value="work">Work</option>
            <option class="opt" value="health">Health</option>
        </select>
    </div>`;

    const categoryDropdown = document.getElementById("my-dropdown");

    categoryDropdown.addEventListener("change", filterTodos);

    let selectedCategory = "all";

    function filterTodos() {
        selectedCategory = categoryDropdown.value;

        const todoItems = document.getElementsByClassName('todo');

      //This will will get each todo.value in the <p> tag and change the text to lowercase
        for (let i = 0; i < todoItems.length; i++) {
            const todoItem = todoItems[i];
            const todoText = todoItem.querySelector('p').textContent.toLowerCase();


            // Check if category is either ALL or is Grocieries,Work or Health and show todos accroding to that
            if(selectedCategory === 'all' || checkForWords(todoText, selectedCategory)){
                // Show the todo item
                console.log(checkForWords);
                todoItem.style.display = '';
            }
            else{
                // Hide the todo item
                todoItem.style.display = 'none';
            }
        }
    }
    //this funtion will check if each todo's todotext has the words realted to the selected categoryy
    function checkForWords(todoText,category) {
        const categoryArray = {
            groceries: ['grocery', 'shopping', 'food', 'market', 'mart', 'items', 'eggs', 'coke', 'colddrinks', 'vegetables', 'food', 'dinner'],
            work: ['work', 'project', 'task', 'complete', 'time', 'phone', 'duedate', 'contract', 'sign', 'new', 'tie'],
            health: ['health', 'exercise', 'fitness', 'cycling', 'walking', 'medicine', 'run', 'running', 'swimming', 'juice', 'shake']
        };

        const CategoryActive = categoryArray[category] || [];

        for (const word of CategoryActive) {
            if(todoText.includes(word)){
                return true;
                //true means this todo has words related to the category
            }
        }

        return false;
          //false means todo is not of this Category
        //it will fiter the each todotext it recives according to the category each time it is called in above for loop
    }

    //Dynamically show arrow button based on active user using if/else-if
    let arrowsHTML = '';
    if (activeButton === 'alpha-btn') {
        arrowsHTML = `<i id="left-arrow" class="fa fa-arrow-left alphaLeftArrow "></i> <i id="right-arrow" class="fa fa-arrow-right alphaRightArrow"></i>`;
    } else if (activeButton === 'beta-btn') {
        arrowsHTML = `<i id="right-arrow" class="fa fa-arrow-right betaRightArrow"></i>`;
    } else if (activeButton === 'charlie-btn') {
        arrowsHTML = `<i id="left-arrow" class="fa fa-arrow-left charlieLeftArrow"></i>`;
    }




      todosListEl.innerHTML += `
        <div class="todo" id="${index}" draggable="true">
            <i class="fa ${todo.checked ? 'fa-check-circle"':'fa-circle-o" '}"
                style="color : ${todo.color}" data-action="check">
            </i>
            
            <p class="${todo.checked ? 'checked' : ''}" data-action="check">${todo.value}</p>
            
            <div class="hashTag" id=${index}>
            <button class="tags" style="background-color: inherit" >${tagsHTML}</button> 
            </div>
            <label class="track" style="color: ${daysLeft === "Overdue" ? "red" : "inherit"}">${daysLeft} </label>
            <i class="fa fa-pencil-square-o" data-action="edit"></i>
            <i class="fa fa-trash-o" data-action="delete"></i>
            <div class="Duedate">
            <p>${todo.date ? todo.date : ''}</p>
            </div>
            // <div class="arrows" id="${index}">
            //   ${arrowsHTML}
            // </div>
            
        </div>`;
       

   // Add event listeners for inner arrows
   const betaRight =document.querySelectorAll(".betaRightArrow");

   const alphaLeft= document.querySelectorAll(".alphaLeftArrow");
   const alphaRight = document.querySelectorAll(".alphaRightArrow");

   const charlieLeft =document.querySelectorAll(".charlieLeftArrow");

   
//All todos of Beta right arrows
betaRight.forEach((element) => {
    element.addEventListener("click", () => {
    const todoId = parseInt(element.parentNode.getAttribute("id"));
      // console.log(todoId);
    shiftTodoToUser(todoId, "alpha");
      // selectUser("alpha");
      // activeButton = "alpha-btn";

  });
});


//All todos of Alpha left arrows
alphaLeft.forEach((element) => {
  element.addEventListener("click", () => {
    const todoId = parseInt(element.parentNode.getAttribute("id"));
    shiftTodoToUser(todoId, "beta");
    // selectUser("beta");
    // activeButton = "beta-btn";

  });
});
//All todos of Alpha right arrows
alphaRight.forEach((element) => {
  element.addEventListener("click", () => {
    const todoId = parseInt(element.parentNode.getAttribute("id"));
    shiftTodoToUser(todoId, "charlie");
    // selectUser("charlie");
    // activeButton = "charlie-btn";

  });
});



//All todos of charlie left arrows
charlieLeft.forEach((element) => {
  element.addEventListener("click", () => {
    const todoId = parseInt(element.parentNode.getAttribute("id"));
    shiftTodoToUser(todoId, "alpha");
    // selectUser("alpha");
    // activeButton = "alpha-btn";

  });
});


const sortableObject = new Sortable(todosListEl, {
        animation: 157, 
        ghostClass: "sortable-ghost", // Class used in css to hide shadow of a todo
        onUpdate: () => {
          
          const { todos } = getUserData();

          const newOrder = Array.from(todosListEl.children).map((todoEl) => {
            
            return Number(todoEl.id);

          });
          
          const sortedTodos = newOrder.map((id) => {
            
            return todos[id];

          });
          
          todos.splice(0, todos.length, ...sortedTodos); // spread operator having all tofos values in array and replaces original 
          
          showTodos();
          localStorage.setItem("users", JSON.stringify(users));
          showTodos();
        }
      });

      
//       let initialXPosition = 0;
//       let draggedTodo = null;
// //dragstart
//       todosListEl.addEventListener("dragstart", (event) =>{
//         const todoId = event.target.id;
//         event.dataTransfer.setData("text/plain", todoId);
//         draggedTodo = event.target;
//         initialXPosition = event.clientX;  //Initial position from where draging started 
        

//       });

// //dragover
// todosListEl.addEventListener("dragover", (event) => {
//   event.preventDefault();


//     // Compare Current position with initial position
//     const currentXPosition = event.clientX;
//     const diffX = currentXPosition - initialXPosition;
//     const todoId = event.target.id;
    
//     // Move left
//     if (diffX < 0) {

//       if (activeButton === "alpha-btn") {
//         shiftTodoToUser(todoId, "beta");
        
        
//       } else if (activeButton === "charlie-btn") {
//         shiftTodoToUser(todoId, "alpha");
        
//       }

//     }
//     // Move right
//     else if (diffX > 0) {

//       if (activeButton === "alpha-btn") {
//         shiftTodoToUser(todoId, "charlie");

//       } else if (activeButton === "beta-btn") {
//         shiftTodoToUser(todoId, "alpha");

//       }

//     }
    

// });




//       todosListEl.addEventListener("dragend", (e) => {
//         initialXPosition = 0;
  
//         draggedTodo =e.target;
//         const todoId = e.target.id;
//         let data = e.dataTransfer.getData("text/plain",todoId);
//         e.target.appendChild(document.getElementById(data));
       

//       });
      

      



});
}



// SHIFTING SINGLE TODO FOR INNER ARROWS
function shiftTodoToUser(todoId, targetUser) {
  const { todos } = getUserData();
  const todo = todos[todoId];

  todos.splice(todoId, 1);// Remove todo before shifting

  // adding the todo to other user
  users[targetUser].todos.push(todo);


  showTodos();
  localStorage.setItem("users", JSON.stringify(users));
}










//CLICK EVENT LISTENER FOR ALL ACTIONS like EDIT DELETE THE TODOS
todosListEl.addEventListener("click", (event) => {
  const target = event.target;
  const parentElement = target.parentNode;

  if (parentElement.className !== "todo") return;

  // Todo IDs
  const todo = parentElement;
  const todoId = Number(todo.id);

  // Target Action
  const action = target.dataset.action;

  if (action === "check") {
    checkToDo(todoId);
  } 
  else if (action === "edit") {
    editToDo(todoId);
  } 
  else if (action === "delete") {
    deleteToDo(todoId);
  }

});

// Tick/Cross a Todo
function checkToDo(todoId) {
  const { todos } = getUserData();
  todos[todoId].checked = !todos[todoId].checked;
  showTodos();
  localStorage.setItem("users", JSON.stringify(users));
}

// Edit a Task
function editToDo(todoId) {
  const { todos } = getUserData();
  const todo = todos[todoId];
  todoInput.value = todo.value;
  dateInput.value = todo.date;
  tagInput.value = todo.tags.join(" ");
  todos.splice(todoId, 1); // remove previous todo after edited
  showTodos();
}

// Delete Todo
function deleteToDo(todoId) {
  const { todos } = getUserData();
  todos.splice(todoId, 1);
  editToDo = -1;
  showTodos();
  localStorage.setItem("users", JSON.stringify(users));
}

// Show Notification
function ShowNotification(msg) {
  notificationEl.innerHTML = msg;
  notificationEl.classList.add("notif-enter");
  setTimeout(() => {
    notificationEl.classList.remove("notif-enter");
  }, 3000);
}

// Load data from localStorage on page load
const savedData = localStorage.getItem("users");
if (savedData) {
  const parsedData = JSON.parse(savedData);
  Object.assign(users, parsedData);
  showTodos();
}
