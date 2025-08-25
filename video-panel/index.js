(function () {
  function isAllowedYT(u) {
    try {
      const h = new URL(u).hostname;
      return ["www.youtube.com","youtube.com","www.youtube-nocookie.com"].includes(h);
    } catch(e) { return false; }
  }

  const root = document.createElement("div");
  root.style.cssText = "width:100%;height:100%;display:flex;flex-direction:column;";
  const titleEl = document.createElement("div");
  titleEl.style.cssText = "font:600 14px sans-serif;margin-bottom:8px;display:none;";
  const iframe = document.createElement("iframe");
  iframe.setAttribute("frameborder","0");
  iframe.setAttribute("allow","accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
  iframe.setAttribute("allowfullscreen","true");
  iframe.style.cssText = "flex:1;width:100%;border-radius:10px;";
  root.appendChild(titleEl); root.appendChild(iframe); document.body.appendChild(root);

  dscc.subscribeToData((data) => {
    const rows = (data.tables && data.tables.DEFAULT) ? data.tables.DEFAULT : [];
    const fields = (data.fields && data.fields.DEFAULT) ? data.fields.DEFAULT : [];
    const vidIdx = fields.findIndex(f => f.id === "video_url");
    const titleIdx = fields.findIndex(f => f.id === "titulo");

    let url = null, title = "";
    if (rows[0] && vidIdx > -1) url = rows[0].dimensions?.[vidIdx] || null;
    if (rows[0] && titleIdx > -1) title = rows[0].dimensions?.[titleIdx] || "";

    const showTitle = data.style?.showTitle?.value ?? true;

    if (showTitle && title) { titleEl.textContent = title; titleEl.style.display = "block"; }
    else titleEl.style.display = "none";

    if (url && isAllowedYT(url)) {
      if (iframe.src !== url) iframe.src = url;
    } else {
      iframe.removeAttribute("src");
      if (showTitle) { titleEl.textContent = "Sin video para los filtros actuales"; titleEl.style.display = "block"; }
    }
  }, { transform: dscc.objectTransform });

  if (dscc.subscribeToVizSize) {
    dscc.subscribeToVizSize((size) => {
      iframe.style.width = size.width + "px";
      iframe.style.height = size.height - (titleEl.style.display !== "none" ? 24 : 0) + "px";
    });
  }
})();
