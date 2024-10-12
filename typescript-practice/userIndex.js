console.log("Helllo , I am from User Index.ts");
var inputEle = document.getElementById("userInput");
var submitBtn = document.getElementById("submitBtn");
var div = document.createElement("div");
div.style.display = "flex";
div.style.justifyContent = "flex-start";
div.style.gap = "9px";
div.style.textDecoration = "none";
document.body.append(div);
submitBtn.addEventListener("click", function () {
    var inputVal = inputEle.value;
    var ul = document.createElement("ul");
    var li = document.createElement("li");
    var deleteBtn = document.createElement("button");
    li.textContent = inputVal;
    // styling in list element
    ul.style.display = "flex";
    ul.style.justifyContent = "flex-start";
    ul.style.alignItems = "center";
    ul.style.textDecoration = "none";
    ul.style.gap = "9px";
    ul.style.border = "1px solid gray";
    ul.style.padding = "1rem";
    ul.style.listStyleType = "none";
    li.style.color = "green";
    li.style.textDecoration = "none";
    ul.appendChild(li);
    ul.appendChild(deleteBtn);
    //delete btn
    deleteBtn.id = "deleteId";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", function () {
        console.log("Deleted list");
        ul.remove();
    });
    div.append(ul);
    console.log({ inputVal: inputVal });
    console.log("Hello from btn element");
    inputEle.value = "";
});
// document.addEventListener("DOMContentLoaded", () => {
//     const deleteList = document.getElementById("deleteId") as HTMLButtonElement;
//     deleteList.addEventListener("click", (e) => {
//         console.log("Clicked delete Button");
//         console.log("Delete Event : ", e);
//     });
// });
