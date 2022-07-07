// Name: Lo Tsz Yuk
// SID: 1155133625

//Special button
function pop(){
    let bar = document.getElementById('taskBar');
    if (bar.style.display === 'none') {
        bar.style.display = 'inline';
    } else {
        bar.style.display = 'none';
    }
}

//Task 1
function left_center_right(){
    let align1 = document.getElementById("header_aboutMe");
    let align2 = document.getElementById("header_Courses");
    let align3 = document.getElementById("header_hobby");
    let align4 = document.getElementById("header_design");

    if (align1.style.textAlign === "left"){
        align1.style.textAlign = "center";
        align2.style.textAlign = "center";
        align3.style.textAlign = "center";
        align4.style.textAlign = "center";
    } else if (align1.style.textAlign === "center"){
        align1.style.textAlign = "right";
        align2.style.textAlign = "right";
        align3.style.textAlign = "right";
        align4.style.textAlign = "right";
    } else if (align1.style.textAlign === "right") {
        align1.style.textAlign = "left";
        align2.style.textAlign = "left";
        align3.style.textAlign = "left";
        align4.style.textAlign = "left";
    }
}

//Task 2
function add(){
    let hobby = prompt("Please give me a new hobby");
    let ul = document.getElementById("hobby_list");
    let newli = document.createElement("li");
    if (hobby != null && hobby != ""){
        newli.textContent= hobby;
        ul.appendChild(newli);
    }
}

//Task 3
function pop_bar(){
    let bar = document.getElementById('bar');
    if (bar.style.display === 'none') {
        bar.style.display = 'block';
    } else {
        bar.style.display = 'none';
    }
}

window.onscroll = function() {scroll()};
function scroll() {
    // scroll indicator
    let Scroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (Scroll / height) * 100;
    document.getElementById("myBar").style.width = scrolled + "%";
    document.getElementById("myBar").innerHTML= Math.round(scrolled) + "%";

    // place the class sticky-top into #bar
    document.getElementById("bar").classList.toggle("sticky-top", window.scrollY>0);
}

//comment
function processform(){
    let newComment = document.createElement("div");
    let element = '<div>' +
    '                   <svg height="100" width="100"><circle cx="50" cy="50"r="40"></svg>' +
    '             </div>' +
    '             <div>' +
    '                   <h5></h5>' +
    '                   <p></p>' +
    '             </div>';
    newComment.innerHTML = element;

    newComment.className = "d-flex";
    newComment.querySelectorAll("div")[0].className = "flex-shrink-0"; // 1st div
    newComment.querySelectorAll("div")[1].className = "flex-grow-1"; // 2nd div

    let lastComment = document.querySelector("#comments").lastElementChild; // instead of lastChild for div element
    newComment.id = 'c' + (Number(lastComment.id.substr(1)) + 1);

    newComment.querySelector("h5").innerHTML = document.querySelector("#new-email").value;
    newComment.querySelector("p").innerHTML = document.querySelector("#new-comment").value;

    let color = document.querySelectorAll("input[name=new-color]:checked")[0].value;

    newComment.querySelector("circle").setAttribute("fill", color);

    // email & comment validation
    if (!document.querySelector("#new-email").validity.valid || !document.querySelector("#new-comment").validity.valid ) {
        if(!document.querySelector("#new-email").validity.valid){
            document.getElementById("new-email").classList.add("is-invalid");
        }else{
            document.getElementById("new-email").classList.remove("is-invalid");
        }
        if(!document.querySelector("#new-comment").validity.valid){
            document.getElementById("new-comment").classList.add("is-invalid");
        }else{
            document.getElementById("new-comment").classList.remove("is-invalid");
        }
        return
    }else{
        if(document.querySelector("#new-email").validity.valid){
            document.getElementById("new-email").classList.remove("is-invalid");
        }
        if(document.querySelector("#new-comment").validity.valid){
            document.getElementById("new-comment").classList.remove("is-invalid");
        }
    }

    document.querySelector("#comments").appendChild(newComment);
    document.querySelector("form").reset();

    //save
    fetch('comment.txt', {
        method: 'PUT',
        body: document.querySelector("#comments").innerHTML
    });
}

function load(){
    fetch('comment.txt')
        .then(res => res.text())
        .then(txt => document.querySelector("#comments").innerHTML = txt)
}

