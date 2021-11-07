var town_state = {};
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

function setItems(data){
    bl.innerHTML = '';
    if(data.length==0) nrr.classList.remove('hidden');
    else nrr.classList.add('hidden');
    for(var i = 0; i<data.length; ++i){
        var item = data[i];
        if(item['ac']==1) item['ac'] = 'A/C';
        else item['ac'] = 'Non A/C';
        var src_town = item['src_town'];
        var des_town = item['des_town'];
        s=`<li><div class="bg-primary" style="box-shadow: 0px 0px;padding: 16px;border-radius: 10px;margin: 10px;">
        <details><summary style="display:block;"><h4 class="text-light">${src_town} ⟶ ${des_town}</h4>
        <p class="text-light">Starts at ${item['start_time']} | Duration: ${item['duration']} | ${item['distance']} KM | ${item['brand']}, ${item['ac']}, ${item['chair_count']} seater bus</p></summary><p class="text-light" id="pi">From: ${item['src_name']}, ${src_town}, ${town_state[src_town]}
        <br> 
        To: ${item['des_name']}, ${des_town}, ${town_state[des_town]}
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
    xhr.open('GET', 'https://bus-company-bttc.herokuapp.com/info/'+p1+'/'+p2+'/'+p3);
    xhr.send();
    xhr.onreadystatechange = (e)=>{
        progressBar.classList.add('hidden');
        setItems(JSON.parse(xhr.responseText));
    }
}

const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://bus-company-bttc.herokuapp.com/towns');
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
        town_state[name] = data[i]['state'];
    }
}