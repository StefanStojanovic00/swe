export class Greska{

    constructor(id,opis,parent){
        this.id = id;
        this.opis = opis;
        this.kontejner = null;
        this.parent = parent;
    }

    Crtaj(host){
        if(!host)
            throw new Error("nije unet host");
        
        this.kontejner = document.createElement("div");
        this.kontejner.classList.add("korisnik");
        host.appendChild(this.kontejner);

        let lab = document.createElement("label");
        lab.innerHTML = this.opis;
        this.kontejner.appendChild(lab);

        let btn = document.createElement("button");
        btn.className = "btn btn-primary";
        btn.innerHTML = Window.lang.text.remove_error;
        this.kontejner.appendChild(btn);

        btn.onclick = async (ev) =>{
            await fetch("http://localhost:5001/Greska/ObrisiGresku/"+this.id,{method: "DELETE",headers: {'Authorization': `Bearer ` + Window.token}});
            let ph = document.querySelector(".placeholde");
            this.parent[3](ph);
        }
    }
}