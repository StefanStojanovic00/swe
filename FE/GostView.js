import { GostPretragaLinija } from "./GostPretragaLinija.js";
import { lang } from "./lang.js";

export class GostView{

    constructor(){
        this.tip = document.cookie.split("next")[1];
        this.lng = document.cookie.split("next")[2];
        Window.lang = new lang(document.cookie.split("next")[2]);
        this.kontejner = null;
}

    Crtaj(host){
        if(!host)
            throw new Error("nije unet host");
        
        this.kontejner = document.createElement("div");
        this.kontejner.className = "kontejner";
        host.appendChild(this.kontejner);

        let headerDiv = document.createElement("div");
        headerDiv.className = "head";
        this.kontejner.appendChild(headerDiv);

        let logo = document.createElement("h1");
        logo.innerHTML = Window.lang.text.where_is_my_train;
        logo.className = "logo";
        headerDiv.appendChild(logo);

        let jezLogDiv = document.createElement("div");
        headerDiv.appendChild(jezLogDiv);
        jezLogDiv.className = "jezLog";

        //-----------------

         let jezikDiv = document.createElement("div");
        jezikDiv.className = "jezikDiv";
        jezLogDiv.appendChild(jezikDiv);

        /*let enLab = document.createElement("lab");
        enLab.innerHTML = "EN";
        jezikDiv.appendChild(enLab);*/
        let en2=document.createElement("img");
        en2.src="engZastava.jpg";
        en2.className="zastave";
        jezikDiv.appendChild(en2);
        

        let jezikLab = document.createElement("label");
        jezikLab.className = "switch";
        jezikDiv.appendChild(jezikLab);

        let jezikIn = document.createElement("input");
        jezikIn.classList.add("jezikIn");
        jezikIn.type = "checkbox";
        jezikLab.appendChild(jezikIn);

        let jezikSp = document.createElement("span");
        jezikSp.className = "slider";
        jezikLab.appendChild(jezikSp);
        
        /*let srLab = document.createElement("lab");
        srLab.innerHTML = "SR";
        jezikDiv.appendChild(srLab);*/
        let srb2=document.createElement("img");
        srb2.src="srbZastava.jpg";
        srb2.className="zastave";
        jezikDiv.appendChild(srb2);

        if(this.lng == "sr")
            jezikIn.checked = true;

        jezikIn.onclick = (ev) =>{
            if(jezikIn.checked){
                document.cookie = `${this.ime}next${this.tip}nextsrnext${document.cookie.split("next")[3]};expires=${document.cookie.split("next")[3]};path:/;`;
                this.lng = "sr";
            }else{
                document.cookie = `${this.ime}next${this.tip}nextennext${document.cookie.split("next")[3]};expires=${document.cookie.split("next")[3]};path:/;`;
                this.lng = "en";
            }
            Window.lang.zameni(this.lng);
            //console.log(document.cookie)
            this.Crtaj(host);
            location.reload();
        }

        //--------------------

        let logDiv = document.createElement("div");
        logDiv.className = "logDiv";
        jezLogDiv.appendChild(logDiv);




        //-----------------------------------------------------

        let logINDiv = document.createElement("div");
        jezLogDiv.appendChild(logINDiv);

        let logBtn = document.createElement("button");
        logBtn.innerHTML =  Window.lang.text.login;
        logINDiv.appendChild(logBtn);
        logBtn.className="btn btn-primary"
        logBtn.onclick = (ev)=>this.login();

        //------------------------------

        let searchDiv = document.createElement("div");
        searchDiv.className = "searchDiv";
        this.kontejner.appendChild(searchDiv);

        //----------------------

        let tDiv = document.createElement("div");
        tDiv.className = "tDiv";
        this.kontejner.appendChild(tDiv);

        let vpDiv = document.createElement("div");
        vpDiv.className = "vdd";


        let vpIn = document.createElement("input");
        vpIn.className = "form-control rounded";
        vpIn.type = "time";

        let vplab = document.createElement("h6");
        vplab.innerHTML = "Od:";


        vpDiv.appendChild(vplab);
        vpDiv.appendChild(vpIn);
        tDiv.appendChild(vpDiv);

        let vdIn = document.createElement("input");
        vdIn.className = "form-control rounded";
        vdIn.type = "time";

        let vdlab = document.createElement("h6");
        vdlab.innerHTML = "Do:";

        let vdDiv = document.createElement("div");
        vdDiv.className = "vdd";

        vdDiv.appendChild(vdlab);
        vdDiv.appendChild(vdIn);
        tDiv.appendChild(vdDiv);
        //----------------------

        let polStan = document.createElement("input");
        polStan.className = "form-control rounded";
        polStan.placeholder = Window.lang.text.departure_station;
        searchDiv.appendChild(polStan);

        let dolStan = document.createElement("input");
        dolStan.placeholder = Window.lang.text.arrival_station;
        dolStan.className = "form-control rounded";
        searchDiv.appendChild(dolStan);

        let datumIn = document.createElement("input");
        datumIn.className = "form-control rounded";
        datumIn.type = "date";
        searchDiv.appendChild(datumIn);

        let pbody = document.createElement("div");
        pbody.className = "pbody";
        this.kontejner.appendChild(pbody);
        

        let srcBtn = document.createElement("button");
        srcBtn.innerHTML =  Window.lang.text.search;
        srcBtn.className="btn btn-primary";
        srcBtn.onclick=(ev)=>
        {        

            if(polStan.value != "" && dolStan.value != "" && datumIn.value != "" && vpIn.value != "" && vdIn.value != ""){
                if(vpIn.value < vdIn.value){
                fetch(`http://localhost:5001/Voznja/VratiVoznjeVreme/${polStan.value}/${dolStan.value}/${datumIn.value}/${datumIn.value + " " + vpIn.value}/${datumIn.value + " " + vdIn.value}`,
                {
                    method: "GET",
                    headers: {'Authorization': `Bearer ` + this.token}
                }
                    ).then(s=>{
                        if(s.ok)
                        {
                            s.json().then(s=>{
                                while(pbody.firstChild != null)
                                    pbody.removeChild(pbody.firstChild);
                                if(s != ""){
                                s.forEach(el => {
                                     let a = new PretragaLinija(el.id,convertFromStringToDate(el.termin),el.pocetnaStanica.mesto,el.krajnaStanica.mesto,convertFromStringToDate(el.stize),el.prevoznik.id,el.prevoznik.username,this.ime,el.pocetnaStanica.id,el.krajnaStanica.id);
                                    
                                     function convertFromStringToDate(responseDate) { 
                                        let prviDatum=   new Date(Date.parse(responseDate));
                                        let DatumtoS=prviDatum.toString();
                                        let k =DatumtoS.slice(0,25);                     
                                        return(k)      
                                                                           
                                                             
                                    }
                                    a.crtaj(pbody);
                                });
                                }else{
                                    let v = document.createElement("h3");
                                    v.className = "phh";
                                    v.innerHTML = "Nema pronadjenih rezultata";
                                    pbody.appendChild(v);
                                }
                            })
                        
                        }
                        else
                        {
                            alert(Window.lang.text.DosloDoGreske);
                        }
                    })
                }else{
                    alert("polazno vreme ne sme biti manje od vremena stizanja");
                }
            }else if(polStan.value != "" && dolStan.value != "" && datumIn.value != ""){
            fetch(`http://localhost:5001/Voznja/VratiVoznje/${polStan.value}/${dolStan.value}/${datumIn.value}`,
            {
                method: "GET",
                headers: {'Authorization': `Bearer ` + this.token}
            }
                ).then(s=>{
                    if(s.ok)
                    {
                        s.json().then(s=>{
                            while(pbody.firstChild != null)
                                pbody.removeChild(pbody.firstChild);
                            if(s != ""){
                            s.forEach(el => {
                                let a = new GostPretragaLinija(el.id,convertFromStringToDate(el.termin),el.pocetnaStanica.mesto,el.krajnaStanica.mesto,convertFromStringToDate(el.stize),el.prevoznik.username);
                                
                                 function convertFromStringToDate(responseDate) { 
                                    let prviDatum=   new Date(Date.parse(responseDate));
                                    let DatumtoS=prviDatum.toString();
                                    let k =DatumtoS.slice(0,25);                     
                                    return(k)      
                                                                       
                                                         
                                }
                                a.crtaj(pbody);
                            });
                            }else{
                                let v = document.createElement("h3");
                                v.className = "phh";
                                v.innerHTML = "Nema pronadjenih rezultata";
                                pbody.appendChild(v);
                            }
                        })
                    
                    }
                    else
                    {
                        alert(Window.lang.text.DosloDoGreske);
                    }
                })
            }else{
                alert(Window.lang.text.NisuUnetiPodaci);
            }
    
            }
            searchDiv.appendChild(srcBtn);
    
        }

        /*
        if(polStan.value != "" && dolStan.value != "" && datumIn.value != ""){
        fetch(`http://localhost:5001/Voznja/VratiVoznje/${polStan.value}/${dolStan.value}/${datumIn.value}`,{
            method: "GET"}).then(s=>{
                if(s.ok)
                {
                    s.json().then(s=>{
                        while(pbody.firstChild != null)
                            pbody.removeChild(pbody.firstChild);
                        if(s != ""){
                        s.forEach(el => {
                             let a = new GostPretragaLinija(el.id,convertFromStringToDate(el.termin),el.pocetnaStanica.mesto,el.krajnaStanica.mesto,convertFromStringToDate(el.stize),el.prevoznik.username);
                             
                            function convertFromStringToDate(responseDate) {    
                                let prviDatum=   new Date(Date.parse(responseDate));
                                let DatumtoS=prviDatum.toString();
                                let k =DatumtoS.slice(0,25);                     
                                return(k)      
                                                                   
                                                     
                            }
                            a.crtaj(pbody);
                        });
                    }else{
                        let v = document.createElement("h3");
                            v.className = "phh";
                            v.innerHTML = "Nema pronadjenih rezultata";
                            pbody.appendChild(v);
                    }
                    })
                }
                else
                {
                    alert(Window.lang.text.DosloDoGreske);
                }
            })
        }else{
            alert(Window.lang.text.NisuUnetiPodaci);
        }

        }
        
        searchDiv.appendChild(srcBtn);

    }*/



    login()
    {
        document.cookie = `l;expires = ${new Date(Date.now() - 100000).toUTCString()};path:/`;
            location.reload();
    }
}