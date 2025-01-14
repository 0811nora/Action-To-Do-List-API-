

const apiUrl = "https://todoo.5xcamp.us";
let token = "";
let userNickname = "";
const notyf = new Notyf({
    position: { x: 'left', y: 'bottom' } 
});





// ------------- 登入頁面 ---------------
const loginPage= document.querySelector(".login-page");
const loginEmail = document.querySelector(".login-email");
const loginPassword = document.querySelector(".login-password");
const loginLoginBtn = document.querySelector(".login-login-btn")
const loginRegBtn = document.querySelector(".login-reg-btn");
const showNikname = document.querySelector(".show-nikname");
const total = document.querySelector(".total");
const startPage = document.querySelector(".start-page");
const iconBlack = document.querySelectorAll(".icon-black");
const iconYellow = document.querySelectorAll(".icon-yellow");









// 登入頁的 [登入] 按鈕


function login(){
    axios.post(`${apiUrl}/users/sign_in`,{
        "user":{
            "email": loginEmail.value,
            "password": loginPassword.value
        }
    })
    .then((res) => {
        console.log(res);
        console.log("API成功：登入")
        token = res.headers.authorization;
        userNickname = res.data.nickname;
        showNikname.innerHTML = `${userNickname}的待辦清單`;


        registerPage.classList.add('hidden');
        loginPage.classList.add('hidden');
        todoPage.classList.remove('hidden');
        todoPage.classList.add('visible');
        startPage.classList.add('hidden');
        startPage.classList.remove('visible-flex');

        loginEmail.value = "";
        loginPassword.value = "";

        getAllList();
        

    })
    .catch((error) => {
        console.log(error.response);
        notyf.error(error.response.data.message);
        
    })
}


// 登入頁的 [註冊] 按鈕
loginRegBtn.addEventListener("click",function(e){
    registerPage.classList.add("visible");
    registerPage.classList.remove("hidden");
    loginPage.classList.add("hidden");
    loginPage.classList.remove("visible");


})

// 登入行為

function keyEnterLogin(event){
    if(event.keyCode === 13 || event.keyCode ==="Enter"){
        event.preventDefault();
        login();
    }
}


loginLoginBtn.addEventListener("click", login);
loginPassword.addEventListener("keydown",keyEnterLogin);
loginEmail.addEventListener("keydown",keyEnterLogin);





// -------------- 註冊頁面 ---------------
const registerPage = document.querySelector(".register-page");
const regEmail = document.querySelector(".reg-email");
const regNickname = document.querySelector(".reg-nickname");
const regPassword = document.querySelector(".reg-password");
const regPasswordAgain = document.querySelector(".reg-password-again");
const regBtn = document.querySelector(".reg-btn");
const regLoginBtn = document.querySelector(".reg-login-btn");




// 註冊頁的[註冊帳號]按鈕


function register(){
    if(regPassword.value == regPasswordAgain.value){
        axios.post(`${apiUrl}/users`,{
            "user":{
                "email": regEmail.value,
                "nickname": regNickname.value,
                "password": regPassword.value
            }
        })
        .then((res) => {
            console.log(res);
            console.log("API成功：註冊")
            token = res.headers.authorization;
            userNickname = res.data.nickname;
            showNikname.innerHTML = `${userNickname}的待辦清單`;
            getAllList();

            registerPage.classList.add('hidden');
            loginPage.classList.add('hidden');
            todoPage.classList.remove('hidden');
            todoPage.classList.add('visible');
            startPage.classList.add('hidden');
            startPage.classList.remove('visible-flex');

            regEmail.value = "";
            regNickname.value = "";
            regPassword.value = "";
            regPasswordAgain.value = "";

            notyf.success('註冊成功');
        })
        .catch((error) => {
            console.log(error.response);
            notyf.error(error.response.data.error.join('<br>'));
        })
    }else{
        notyf.error('請確保兩次輸入的密碼相同');
    }
}

let regInput = [regEmail,regNickname,regPassword,regPasswordAgain];
regBtn.addEventListener("click", register);
regInput.forEach(item => {
    item.addEventListener("keydown", keyEnterReg);
})


function keyEnterReg(event){
    if(event.keyCode === 13 || event.keyCode ==="Enter"){
        event.preventDefault();
        register();
    }
}


// 註冊頁的[登入]按鈕
regLoginBtn.addEventListener("click",function(e){
    registerPage.classList.add("hidden");
    registerPage.classList.remove("visible");
    loginPage.classList.add("visible");
    loginPage.classList.remove("hidden");
})

// ------------ 待辦清單頁面 -------------


const todoPage = document.querySelector(".todo-page");
const todoList = document.querySelector(".todo-list");
const todoInput = document.querySelector(".todo-input");
const todoAddTo = document.querySelector(".todo-add-to");
const logoutBtn = document.querySelector(".logout-btn");
const leftImg = document.querySelector(".left-content-img");
const todoEmpty = document.querySelector(".todo-empty");
const todoPresent = document.querySelector(".todo-present");



let alltodolist = [];




// 取得所有todo清單資料
function getAllList(){
    statePending.classList.remove("button-style");
    stateDone.classList.remove("button-style");
    stateAll.classList.add("button-style");
    

    axios.get(`${apiUrl}/todos`,{
        headers:{
            'Authorization': token
        }
    })
    .then((res) => {
        console.log("API成功：已取到Todo清單資料")
        alltodolist = res.data.todos;
        console.log(alltodolist);
        
  
        if( !alltodolist || alltodolist.length === 0 ){
            todoEmpty.classList.add("visible");
            todoEmpty.classList.remove("hidden");
            todoPresent.classList.add("hidden");
            todoPresent.classList.remove("visible");
        }else{
            console.log(alltodolist);
            todoEmpty.classList.add("hidden");
            todoEmpty.classList.remove("visible");
            todoPresent.classList.add("visible");
            todoPresent.classList.remove("hidden");
            showAllList();
        }
        
    })
    .catch(error => {error.response})
}


//計算已完成數量
function countTotal(){
    let totalTodo = 0;
    alltodolist.forEach((item) => {
        if(item.completed_at === null){
            totalTodo += 1;
        }
    })
    total.innerHTML =`${totalTodo}個待完成項目`
}
        

// 顯示所有todo清單資料
function showAllList(){
    let listContent = "";
    

    alltodolist.forEach((item) =>{


        listContent += 
        
        `<div class="todo-item" id="${item.id}">
        <input type="checkbox" class="checkbox" ${item.completed_at ? 'checked' : ''}>
        <span class="todo-str ${item.completed_at ? 'todo-done' : ''}">${item.content}</span>
        <div class="edit-del-box">
            <i class='bx bxs-pencil edit-btn' ></i>
            <i class="bx bx-x del-btn"></i>
        </div>
        </div>`;
        
        
        
 

    })
    todoList.innerHTML = listContent;
    countTotal();
}



//新增 todo 清單
function addTodo(){
    let stringInput = todoInput.value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    axios.post(`${apiUrl}/todos`,{
        "todo": {
          "content": stringInput
        }
      },{
        headers:{
            'Authorization': token
        }
    })
    .then(() => {
        console.log("API成功：已新增todo清單")
        console.log(stringInput)
        getAllList();

        todoInput.value = "";
        notyf.success('新增成功');
    })
    .catch(error => console.log(error.response))
}



// [新增] 的行為
todoAddTo.addEventListener("click",addTodo);
todoInput.addEventListener("keydown",function(e){
    if(e.keyCode === 13){
        e.preventDefault();
        addTodo();
    }
});


// [切換] todo 已完成/未完成
todoList.addEventListener("change",(e) => {
    if(e.target && e.target.matches(".checkbox")){ 
        console.log(e.target);

        let todoItem = e.target.closest(".todo-item"); //點擊目標像上一層的class
        let todoId = todoItem.id; //找到ID 


        axios.patch(`${apiUrl}/todos/${todoId}/toggle`,{},{
            headers:{
                'Authorization': token
            }
        })
        .then((res) => {
            console.log("API成功：已完成/未完成")
            let updateTodo = res.data;
            let todoStr = todoItem.querySelector(".todo-str"); //找到文字內容

            if(updateTodo.completed_at){ //不是null的話就成立
                todoStr.classList.add("todo-done");
            }else{
                todoStr.classList.remove("todo-done");
            };

            alltodolist = alltodolist.map((item) => {
               return item.id === updateTodo.id ? updateTodo : item ;
            });
            countTotal();
        })
        .catch(error => (error.response))
    }
    
});




// [狀態] 

const stateAll = document.querySelector(".state-all");
const statePending = document.querySelector(".state-pending");
const stateDone = document.querySelector(".state-done");
const clearAllBtn = document.querySelector(".clear-all-btn");



statePending.addEventListener("click",showPedding);
stateDone.addEventListener("click",showDone);
stateAll.addEventListener("click",getAllList);


// [狀態] 未完成
function showPedding(){
    const todoItem = document.querySelectorAll(".todo-item");
    statePending.classList.add("button-style");
    stateDone.classList.remove("button-style");
    stateAll.classList.remove("button-style");

    todoItem.forEach((item) => {
        let checkBox = item.querySelector(".checkbox");
        
        if(checkBox.checked){
            item.classList.add("hidden")
            item.classList.remove("visible-flex")
        }else{
            item.classList.add("visible-flex")
            item.classList.remove("hidden")
        }
    })
}

// [狀態] 已完成
function showDone(){
    const todoItem = document.querySelectorAll(".todo-item");
    stateDone.classList.add("button-style");
    statePending.classList.remove("button-style");
    stateAll.classList.remove("button-style");

    todoItem.forEach((item) => {
        let checkBox = item.querySelector(".checkbox");
        if(checkBox.checked){
            item.classList.add("visible-flex")
            item.classList.remove("hidden")
        }else{
            item.classList.add("hidden")
            item.classList.remove("visible-flex")
        }
    })
}

// 顯示[編輯鈕]跟[刪除鈕]

function inlineEditDelBox(e){
    let todoItem = e.target.closest(".todo-item");
    
    if(todoItem){
        let editDelBox = todoItem.querySelector(".edit-del-box");
        if(editDelBox){
            editDelBox.style.display = "inline";
        }   
    }
}
    
function noneEditDelBox(e){
    let todoItem = e.target.closest(".todo-item");

    if(todoItem){
        let editDelBox = todoItem.querySelector(".edit-del-box");

        if(editDelBox){
            editDelBox.style.display = "none";
        }
    }
}

todoList.addEventListener("mouseover", inlineEditDelBox);
todoList.addEventListener("mouseout", noneEditDelBox);
todoList.addEventListener("mousedown",noneEditDelBox);


// [編輯] 待辦事項
todoList.addEventListener("mousedown", (e)=>{
    if(e.target && e.target.matches(".edit-btn")){
        todoList.removeEventListener("mouseover", inlineEditDelBox);
        
        let todoItem = e.target.closest(".todo-item");
        let todoId = todoItem.id;
        let todoText = todoItem.querySelector(".todo-str");
        let originalText = todoText.textContent;

        todoText.innerHTML = `
        <input type="text" class="editInput" value="${originalText}"/>
        <div class="saveCancel-box">
        <i class='bx bxs-save save-btn'></i>
        <i class='bx bxs-x-square cancel-btn'></i>
        </div>
        `;
        

       
        todoItem.querySelector(".save-btn").addEventListener("click",()=>{
            let newText = String(todoItem.querySelector(".editInput").value);
            console.log(newText);
            
            axios.put(`${apiUrl}/todos/${todoId}`,{
                "todo": {
                  "content": newText
                }
            },{
                headers:{
                'Authorization': token
                }
            })
            .then(()=>{
                console.log("修改成功");
                notyf.success('修改成功');
                todoText.textContent= newText;
                todoList.addEventListener("mouseover", inlineEditDelBox);
            })
        })

        todoItem.querySelector(".cancel-btn").addEventListener("click",()=>{
            todoText.textContent = originalText;
            todoList.addEventListener("mouseover", inlineEditDelBox);
        })
    }
})





        






// [刪除] todo 項目

todoList.addEventListener("click", (e)=>{
    if(e.target && e.target.matches(".del-btn")){ 
        let todoId = e.target.closest(".todo-item").id;
        console.log(todoId);

        //在todoList中點擊的目標，同時目標也符合class為.del-btn就執行
        //宣告todoId：離點擊目標的向上找到class為.todo-item的id


        axios.delete(`${apiUrl}/todos/${todoId}`,{
            headers:{
                'Authorization': token
            }
        })
        .then(() => {
            console.log("API成功：項目刪除")

            let todoItem = document.getElementById(todoId);
            todoItem.remove();
            notyf.success('已成功刪除');
            //宣告todoItem：存放元素的 id ，並移除todoItem 元素
        })
        .catch(error => console.log(error.response))
    }
})


//刪除全部todo項目  (需要詳細了解 forEach/map/promise的用法)
clearAllBtn.addEventListener("click",clearAllTodo)

function clearAllTodo(){

    Swal.fire({
        title: "是否清除所有項目?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "是",
        cancelButtonText: "否"
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "已清除",
            icon: "success"
          })
          let delPromise = alltodolist.map((item) => {
            return axios.delete(`${apiUrl}/todos/${item.id}`,{
                headers:{
                    'Authorization': token
                }
            })
        })
        
        Promise.all(delPromise)
        .then(() => getAllList())
        .catch(error => error.response);
        }
        
      });
}


// 登出
logoutBtn.addEventListener("click",function(e){
    axios.delete(`${apiUrl}/users/sign_out`,{
        headers:{
            'Authorization': token
        }
    })
    .then((res) => {
        console.log(res);
        console.log("API成功：登出")
    

        todoPage.classList.remove('visible');
        todoPage.classList.add('hidden');

        startPage.classList.remove('hidden');
        startPage.classList.add('visible-flex');

        loginPage.classList.remove('hidden');
        loginPage.classList.add('visible');

        registerPage.classList.remove('hidden');
        registerPage.classList.remove('visible');

       
      
       




        // startPage.style.display = "flex";
        // loginPage.style.display = "block";
    
       
        todoList.innerHTML = "";

        notyf.success('已登出');
    })
    .catch(error => console.log(error.response))
})