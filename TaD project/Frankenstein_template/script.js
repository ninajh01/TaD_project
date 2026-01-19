// Declare variables for getting the xml file for the XSL transformation (folio_xml) and to load the image in IIIF on the page in question (number).
let tei = document.getElementById("folio");
let tei_xml = tei.innerHTML;
let extension = ".xml";
let folio_xml = tei_xml.concat(extension);
let page = document.getElementById("page");
let pageN = page.innerHTML;
let number = Number(pageN);

// Loading the IIIF manifest
var mirador = Mirador.viewer({
  "id": "my-mirador",
  "manifests": {
    "https://iiif.bodleian.ox.ac.uk/iiif/manifest/53fd0f29-d482-46e1-aa9d-37829b49987d.json": {
      provider: "Bodleian Library, University of Oxford"
    }
  },
  "window": {
    allowClose: false,
    allowWindowSideBar: true,
    allowTopMenuButton: false,
    allowMaximize: false,
    hideWindowTitle: true,
    panels: {
      info: false,
      attribution: false,
      canvas: true,
      annotations: false,
      search: false,
      layers: false,
    }
  },
  "workspaceControlPanel": {
    enabled: false,
  },
  "windows": [
    {
      loadedManifest: "https://iiif.bodleian.ox.ac.uk/iiif/manifest/53fd0f29-d482-46e1-aa9d-37829b49987d.json",
      canvasIndex: number,
      thumbnailNavigationPosition: 'off'
    }
  ]
});


// function to transform the text encoded in TEI with the xsl stylesheet "Frankenstein_text.xsl", this will apply the templates and output the text in the html <div id="text">
function documentLoader() {

  Promise.all([
    fetch(folio_xml).then(response => response.text()),
    fetch("Frankenstein_text.xsl").then(response => response.text())
  ])
    .then(function ([xmlString, xslString]) {
      var parser = new DOMParser();
      var xml_doc = parser.parseFromString(xmlString, "text/xml");
      var xsl_doc = parser.parseFromString(xslString, "text/xml");

      var xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xsl_doc);
      var resultDocument = xsltProcessor.transformToFragment(xml_doc, document);

      var criticalElement = document.getElementById("text");
      criticalElement.innerHTML = ''; // Clear existing content
      criticalElement.appendChild(resultDocument);
    })
    .catch(function (error) {
      console.error("Error loading documents:", error);
    });
}

// function to transform the metadate encoded in teiHeader with the xsl stylesheet "Frankenstein_meta.xsl", this will apply the templates and output the text in the html <div id="stats">
function statsLoader() {

  Promise.all([
    fetch(folio_xml).then(response => response.text()),
    fetch("Frankenstein_meta.xsl").then(response => response.text())
  ])
    .then(function ([xmlString, xslString]) {
      var parser = new DOMParser();
      var xml_doc = parser.parseFromString(xmlString, "text/xml");
      var xsl_doc = parser.parseFromString(xslString, "text/xml");

      var xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xsl_doc);
      var resultDocument = xsltProcessor.transformToFragment(xml_doc, document);

      var criticalElement = document.getElementById("stats");
      criticalElement.innerHTML = ''; // Clear existing content
      criticalElement.appendChild(resultDocument);
    })
    .catch(function (error) {
      console.error("Error loading documents:", error);
    });
}

// Initial document load
documentLoader();
statsLoader();
// Event listener for sel1 change
function selectHand(event) {
  // Use querySelectorAll to specifically target the classes with the '#' character
  const visible_mary = document.querySelectorAll('.\\#MWS');
  const visible_percy = document.querySelectorAll('.\\#PBS');

  if (event.target.value == 'both') {
    visible_mary.forEach(el => el.style.color = 'black');
    visible_percy.forEach(el => el.style.color = 'black');
  } else if (event.target.value == 'Mary') {
    visible_mary.forEach(el => el.style.color = '#cb416b');
    visible_percy.forEach(el => el.style.color = 'black');
  } else if (event.target.value == 'Percy') {
    visible_percy.forEach(el => el.style.color = 'blue');
    visible_mary.forEach(el => el.style.color = 'black');
  }
}
// write another function that will toggle the display of the deletions by clicking on a button
function toggleDels() {
  const btn = document.getElementById("deleting-toggle");
  // store deletion elements in an array    
  const deletions = [...document.getElementsByClassName('del')];

  deletions.forEach(el => {
    if (el.style.display === 'none') {
      el.style.display = 'inline';
    } else {
      el.style.display = 'none';
    }
  });
  if (deletions[0].style.display === "none") {
    btn.innerText = "Show deletions";
  } else {
    btn.innerText = "Hide deletions"
  }
}

// function for hiding and showing metamarks
function wrapCaretSymbols() {
  const textDiv = document.getElementById("text");
  if (textDiv) {
    textDiv.innerHTML = textDiv.innerHTML.replace(/\^/g, '<span class="metamark">^</span>');
  }
}

function toggleMetamarks() {
  wrapCaretSymbols();

  document.body.classList.toggle("hide-marks");
  const btn = document.getElementById("metamark-toggle")
  if (btn) {
    if (document.body.classList.contains("hide-marks")) {
      btn.innerText = "Show metamarks";
    } else {
      btn.innerText = "Hide metamarks";
    }
  }  
}

// function to display reading text
function toggleReadingText() {
  document.body.classList.toggle("reading-mode")
  const btn = document.getElementById("reading-toggle")
  if (document.body.classList.contains("reading-mode")) {
    btn.innerText = "View manuscript";
  } else {
    btn.innerText = "View reading text"
  }
}



