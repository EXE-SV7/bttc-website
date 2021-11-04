var towns_list = ['ANY'];
const srcSelect = document.getElementById('src-select');
const desSelect = document.getElementById('des-select');
const bp = document.getElementsByName('bp');
const bl = document.getElementById('bus-list');
const progressBar = document.getElementById('progress-bar');
const nrr = document.getElementById('nrr');

function removeAll(selectBox) {
    while (selectBox.options.length > 0) {
        selectBox.remove(0);
    }
}

function get(url){
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.send();
    xhr.onreadystatechange = (e)=>{
        removeAll(srcSelect);
        removeAll(desSelect);
        srcSelect.add(new Option('ANY', 'ANY'), undefined);
        desSelect.add(new Option('ANY', 'ANY'), undefined);
        var data = JSON.parse(xhr.responseText);
        for(var i = 0; i<data.length; ++i){
            var name = data[i]['name'];
            srcSelect.add(new Option(name, name), undefined);
            desSelect.add(new Option(name, name), undefined);
            towns_list.push(name);
        }
        
        console.log(towns_list);
    }
}

get('https://bus-company-bttc.herokuapp.com/towns');


const fields = ['brand', 'chair_count', 'ac', 'src_name', 'src_town', 'des_name', 'des_town', 'start_time', 'duration', 'distance', 'inter_towns']


function setItems(data){
    bl.innerHTML = '';
    if(data.length==0) nrr.classList.remove('hidden');
    else nrr.classList.add('hidden');
    for(var i = 0; i<data.length; ++i){
        var item = data[i];
        if(item['ac']==1) item['ac'] = 'A/C';
        else item['ac'] = 'Non A/C'
        s=`<li><div class="bg-primary" style="box-shadow: 0px 0px;padding: 16px;border-radius: 10px;margin: 10px;">
        <h4 class="text-light">${item['src_town']} ⟶ ${item['des_town']}</h4>
        <p class="text-light">Starts at ${item['start_time']} | Duration: ${item['duration']} | ${item['distance']} KM | ${item['brand']}, ${item['ac']}</p>
        
        <div><a class="btn btn-secondary" data-bs-toggle="collapse" aria-expanded="false"
                aria-controls="collapse-1" href="#collapse-1" role="button">More Details</a>
            <div class="collapse show" id="collapse-1">
                <p class="text-light" id="pi">From: ${item['src_name']}, ${item['src_town']}
                <br> 
                To: ${item['des_name']}, ${item['des_town']}
                <br>
                Intermediate Town(s): ${item['inter_towns']}
                <br>
                Driver(s): ${item['drivers']}</p>
            </div>
        </div>
    </div><li>`
    s=`<li><div class="bg-primary" style="box-shadow: 0px 0px;padding: 16px;border-radius: 10px;margin: 10px;">
    <details><summary style="display:block;"><h4 class="text-light">${item['src_town']} ⟶ ${item['des_town']}</h4>
    <p class="text-light">Starts at ${item['start_time']} | Duration: ${item['duration']} | ${item['distance']} KM | ${item['brand']}, ${item['ac']}</p></summary><p class="text-light" id="pi">From: ${item['src_name']}, ${item['src_town']}
    <br> 
    To: ${item['des_name']}, ${item['des_town']}
    <br>
    Intermediate Town(s): ${item['inter_towns']}
    <br>
    Driver(s): ${item['drivers']}</p></details>
    </div><li>`
        bl.innerHTML+=s;
    }
}

function search(){
    progressBar.classList.remove('hidden');
    const xhr = new XMLHttpRequest();
    var p1 = srcSelect.options[srcSelect.selectedIndex].text;
    var p2 = desSelect.options[desSelect.selectedIndex].text;
    var p3 = 'ANY';
    for(var i = 0; i<bp.length; ++i){
        if(bp[i].checked) p3 = bp[i].value;
    }
    console.log('here'+p3);
    xhr.open('GET', 'https://bus-company-bttc.herokuapp.com/info/'+p1+'/'+p2+'/'+p3);
    xhr.send();
    xhr.onreadystatechange = (e)=>{
        progressBar.classList.add('hidden');
        console.log(xhr.responseText);
        setItems(JSON.parse(xhr.responseText));
    }
}