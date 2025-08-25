(function () {
  const root = document.createElement("div");
  root.style.cssText = "width:100%;height:100%;overflow:auto;font:13px system-ui, sans-serif;";
  const table = document.createElement("table");
  table.style.cssText = "border-collapse:collapse;width:100%;";
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  table.appendChild(thead); table.appendChild(tbody); root.appendChild(table); document.body.appendChild(root);

  function th(txt){ const th=document.createElement("th"); th.textContent=txt; th.style.cssText="text-align:left;padding:8px;border-bottom:1px solid #ddd;position:sticky;top:0;background:#fafafa;"; return th; }
  function td(txt){ const td=document.createElement("td"); td.textContent=txt==null?"":String(txt); td.style.cssText="padding:8px;border-bottom:1px solid #eee;"; return td; }

  function sendKeyFilter(keyValue) {
    // Aplica filtro sobre el campo 'key'
    dscc.sendInteraction && dscc.sendInteraction({
      type: "FILTER",
      data: {
        filters: [{ fieldId: "key", values: [keyValue] }]
      }
    });
  }

  dscc.subscribeToData((data) => {
    // Cabecera
    thead.innerHTML="";
    const hr=document.createElement("tr");
    ["Tipo","Rival","Resultado","Observación","Partido"].forEach(h=>hr.appendChild(th(h)));
    thead.appendChild(hr);

    // Filas
    tbody.innerHTML="";
    const rows = data.tables?.DEFAULT || [];
    const fields = data.fields?.DEFAULT || [];
    const idx = {
      tipo: fields.findIndex(f=>f.id==="tipo"),
      rival: fields.findIndex(f=>f.id==="rival"),
      res: fields.findIndex(f=>f.id==="resultado"),
      obs: fields.findIndex(f=>f.id==="obs"),
      par: fields.findIndex(f=>f.id==="partido"),
      key: fields.findIndex(f=>f.id==="key")
    };

    rows.forEach(r=>{
      const tr=document.createElement("tr");
      tr.style.cursor="pointer";
      tr.addEventListener("mouseenter",()=>{ tr.style.background="#f6faff";});
      tr.addEventListener("mouseleave",()=>{ tr.style.background="transparent";});

      const d=r.dimensions||[];
      const keyVal = d[idx.key];

      tr.onclick = ()=> keyVal && sendKeyFilter(keyVal);

      tr.appendChild(td(d[idx.tipo]));
      tr.appendChild(td(d[idx.rival]));
      tr.appendChild(td(d[idx.res]));
      tr.appendChild(td(d[idx.obs]));
      tr.appendChild(td(d[idx.par]));

      tbody.appendChild(tr);
    });
  }, { transform: dscc.objectTransform });
})();
