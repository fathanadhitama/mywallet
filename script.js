function title(str){
    return str.charAt(0).toUpperCase() + str.slice(1)
}// title case

//loal all current items into spending history
function loadAll(){
    fetch('http://localhost:8000/items',{method: "GET"})
    .then(res=>res.json())
    .then(data=>{
        let cards ='<div class="title"><h2>Spending History</h2></div>';
        let total = 0
        data.forEach( item => {
            total+=item.nominal
            cards += '<div class="item"><div class="data"><p>'+ title(item.name) +'</p><p>'+ item.description +'</p><p> <span style="color: blue;">Rp'+ item.nominal +'</span></p></div><div class="tools"><ul><li class="edit" data-itemid='+ item.id +'> Edit </li><li class="del" data-itemid='+ item.id +'> Delete </li></ul></div></div>';
        });
        cards+='<div class="total"><h2>Total :</h2><h2 id="total">Rp <span>190000</span></h2></div>'
        $('#history').html(cards);
        $('#total span').html(total);
    });
};

//submit button to post new data
const myForm = document.querySelector("#myForm");
myForm.addEventListener('submit', event => {
    event.preventDefault();
    let nama = document.querySelector('#name').value;
    let desc = document.querySelector('#description').value;
    let nominal = document.querySelector('#nominal').value;
    let data = {
        "name" : nama,
        "description" :desc,
        "nominal" : nominal
    };
    let converted = JSON.stringify(data);
    
    fetch('http://localhost:8000/items',{
        method: "POST",
        headers:{
            'Content-Type':'application/json'
        },
        body:converted
    })
    .then(res => res.json())
    .then(data => {
        loadAll();
        document.querySelector('option').setAttribute('selected',true);
        document.getElementById('description').value = '';
        document.querySelector('#nominal').value = '';
    })
    .catch(err => console.log(err));
})

//delete item confirmation modal
document.addEventListener('click', async function(e){
    const el = e.target
    if(el.classList.contains('del')){
        const id = el.dataset.itemid;
        fetch('http://localhost:8000/item/'+ id,{method: "GET"})
        .then(res=>res.json())
        .then(data =>{
            let text =`<p>${title(data.name)}</p><p>${data.description}</p><p> <span style="color: blue;">Rp${data.nominal}</span></p>`
            $('.modal-data').html(text);
            const modal= document.querySelector('.modal');
            const overlay = document.querySelector('.overlay');
            modal.classList.remove('hidden');
            overlay.classList.remove('hidden');
            $('#confirm').on('click', function(){
                fetch('http://localhost:8000/item/'+ id,{method: "DELETE"})
                .then(res=>res.json)
                .then(data => {
                    modal.classList.add('hidden');
                    overlay.classList.add('hidden');
                    loadAll();
                })
            })
        })
    }
})

//Edit item
document.addEventListener('click', async function(e){
    const el = e.target
    if(el.classList.contains('edit')){
        const id = el.dataset.itemid;
        fetch('http://localhost:8000/item/'+ id,{method: "GET"})
        .then(res=>res.json())
        .then(data =>{
            let text =`<form id="updateForm">
            <label for="kategori">Kategori</label><br>
            <select class="select" id="updatedName">
                <option value="pendidikan">Pendidikan</option>
                <option value="transportasi">Transportasi</option>
                <option value="konsumsi">Konsumsi</option> 
                <option value="healing">Healing</option> 
                <option value="lainnya">Lainnya</option> 
            </select><br>
            <label for="keterangan">Keterangan</label><br>
            <input type="text" id="updatedDescription"><br>
            <label for="jumlah">Jumlah</label><br>
            <input type="number" id="updatedNominal"><br>
        </form>`
            $('.modal-data').html(text);
            //fill the form with current data
            let options = Array.from(document.querySelectorAll('.modal.update option'));
            options.filter(opt => opt.value == data.name)[0].setAttribute('selected',true);
            document.getElementById('updatedDescription').value = data.description;
            document.querySelector('#updatedNominal').value = data.nominal;

            const modal= document.querySelector('.modal');
            const overlay = document.querySelector('.overlay');
            modal.classList.add('update');
            modal.classList.remove('hidden');
            overlay.classList.remove('hidden');
            $('#confirm').on('click', function(){
                fetch('http://localhost:8000/item/'+ id,{
                    method: "PUT",
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body: JSON.stringify({
                        "name" : document.getElementById('updatedName').value,
                        "description" :document.getElementById('updatedDescription').value,
                        "nominal" : document.getElementById('updatedNominal').value
                    })
                })
                .then(res=>res.json)
                .then(data => {
                    modal.classList.add('hidden');
                    overlay.classList.add('hidden');
                    loadAll();
                })
            })
        })
    }
})

//cancel button
$('#cancel').on('click', function(){
    const modal= document.querySelector('.modal');
    const overlay = document.querySelector('.overlay');
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
})

//responsive hamburger animation
const hamburger = document.querySelector('.hamburger');
const option = document.querySelector('.option');

hamburger.addEventListener('click', ()=>{
    hamburger.classList.toggle('active');
    option.classList.toggle('active');
})
document.querySelectorAll('.option a').forEach(link => {
    link.addEventListener('click', ()=>{
        hamburger.classList.remove('active');
        option.classList.remove('active');
    })
})