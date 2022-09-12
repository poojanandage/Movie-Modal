let cl = console.log;



let addBtn = document.getElementById('addMovieBtn');
let backshow = document.getElementById('backdropBtn');
let myModalBtn1 = document.getElementById('myModalBtn');
let addmovie1 = document.getElementById('addmovie');
let upBtn = document.getElementById('upBtn');
let movieInfo1 = document.getElementById('movieInfo');
let title = document.getElementById('title');
let imageUrl = document.getElementById('imageUrl');
let rating = document.getElementById('rating');
let moveInfoContent = document.getElementById('moveInfoContent');
let closeBtns = Array.from(document.querySelectorAll('.closebtns'))
let movieArr = [];

let tokenValue = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
localStorage.setItem("token",tokenValue);
let baseUrl = 'http://localhost:3000/movies';

function makeMovieApiCall(methodName,url,body){
    return new Promise((resolve,reject) =>{
        let xhr = new XMLHttpRequest();

        xhr.open(methodName,url);

        xhr.setRequestHeader("content-type","application/json; charset=UTF-8");
        xhr.setRequestHeader("autherazation",localStorage.getItem('token'))

        xhr.onload = function(){
            if(xhr.status === 200 || xhr.status === 201){
                resolve(xhr.response)
            }else{
                reject("something went wrong")
            }
            
        }
        xhr.send(body)
    })
}
let geturl = `${baseUrl}`
makeMovieApiCall("GET",geturl)
    .then(res =>{
        movieArr = JSON.parse(res)
        templating(movieArr)
        // templating(JSON.parse(res))
    })
    .catch(cl)


const onclickBTn = (ele) =>{
    // backshow.classList.toggle('show')
    // myModalBtn1.classList.toggle('show')
    toggleBtns()
    

}
closeBtns.forEach(btn =>{
    const onclickcloseBtn = (e) =>{
        // backshow.classList.toggle('show')
        // myModalBtn1.classList.toggle('show')
        toggleBtns()
        

    }
    btn.addEventListener("click",onclickcloseBtn)

})
function toggleBtns (){
     backshow.classList.toggle('show')
     myModalBtn1.classList.toggle('show')
}
const onaddmovieclick = (e) =>{
    e.preventDefault();
    cl("submit")
    let obj ={
        title : title.value,
        imgUrl : imageUrl.value,
        rate : rating.value
    }
    cl(obj)
    // e.target.reset();
    let postUrl = `${baseUrl}`
    makeMovieApiCall("POST",postUrl,JSON.stringify(obj))
        .then(res =>{
            cl(res)
        })
        .catch(cl)
             movieArr.push(obj)
            templating(movieArr)
  
     toggleBtns()
    
  
}

const onclickEdit = (e) =>{

    cl(e)
    let editId = +(e.dataset.id);
    // let editId = e.getAttribute("data-id")
    localStorage.setItem('updateId',editId)
    // cl(editId)
    let editUrl = `${baseUrl}/${editId}`
    // cl(editUrl)
    
    makeMovieApiCall("GET",editUrl)
        .then(res =>{
            let data =(JSON.parse(res))
            title.value = data.title;
            imageUrl.value = data.imgUrl;
            rating.value = data.rate

        })
        .catch(cl)
    addmovie1.classList.add('d-none')
    upBtn.classList.remove('d-none')
     toggleBtns()
    
}

const onUpdateMovie = (e) =>{
    let updateId = localStorage.getItem('updateId')
    let updateUrl = `${baseUrl}/${updateId}`
    let updateObj = {
        title : title.value,
        imgUrl : imageUrl.value,
        rate : rating.value
    }
    cl(updateObj)
    makeMovieApiCall("PATCH",updateUrl,(JSON.stringify(updateObj)))
                .then(cl)
                .catch(cl)
                toggleBtns()

} 

const onclickDelete = (e) =>{
    cl(e)
    let deleteId = +(e.dataset.id);
    let deleteUrl =    `${baseUrl}/${deleteId}`
    makeMovieApiCall("DELETE",deleteUrl)
            .then(cl)
            .catch(cl)
}
const templating = (arr) =>{
    let result ="";
   arr.forEach(movie =>{
        result +=`
        <div class="col-md-4 mt-4">
        <div class="card">
            <div class="card-body bg-light">
                <figure>
                    <div class="img-info">
                        <img src="${movie.imgUrl}" alt="${movie.title}" class="img img-fluid img-thumbnail">
                    </div>
                    <figcaption>
                        <h3>${movie.title}</h3>
                        <p class="rating h4  ${color(movie.rate)}">${movie.rate}/5</p>
                        <div class="text-right">
                            <button class="btn btn-success" data-id=${movie.id} onClick='onclickEdit(this)'>Edit</button>
                            <button class="btn btn-danger" data-id=${movie.id} onClick='onclickDelete(this)'>Delete</button>
                        </div>
                        </figcaption>
                </figure>

            </div>
        </div>
    </div>
        `
    })
    moveInfoContent.innerHTML = result
}
function color(rate){
    if(rate >= 5){
       return "green"
    }else if(rate >= 3){
       return "orange"
    }else{
       return "red"
    }
}

addBtn.addEventListener("click",onclickBTn)
movieInfo1.addEventListener("submit",onaddmovieclick)
upBtn.addEventListener('click',onUpdateMovie)
