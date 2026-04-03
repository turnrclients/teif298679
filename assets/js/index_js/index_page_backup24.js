let sectionFileMap = {};
let originalSectionMap = {};
// let currentSection = null;

// function generateContent(id) {

//     currentSection = id;

//     const htmlContent = document.getElementById(id).innerText;

//     AIBridge.send({
//         type: "GENERATE_TEXT",
//         payload: { text: htmlContent }
//     });
// }

// AIBridge.onMessage(function (data) {

//     if (data.type === "GENERATE_TEXT_RESULT") {

//         document.getElementById(currentSection).innerHTML = data.payload.text;

//     }

// });

// //
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();

            if (cookie.substring(0, name.length + 1) === (name + "=")) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// =============================
// AI CONTENT MODAL SYSTEM
// =============================

let currentSection = null;
let generatedText = "";

// -----------------------------
// Inject CSS
// -----------------------------
const style = document.createElement("style");
style.innerHTML = `
.ai-modal{
    position:fixed;
    inset:0;
    background:rgba(0,0,0,0.6);
    display:none;
    z-index:9999;
    align-items:center;
    justify-content:center;
    backdrop-filter:blur(4px);
}

.ai-modal-content{
    width:900px;
    max-height:85vh;
    background:white;
    border-radius:14px;
    padding:25px;
    display:flex;
    flex-direction:column;
    box-shadow:0 20px 60px rgba(0,0,0,0.2);
}

.ai-tabs{
    display:flex;
    gap:20px;
    border-bottom:1px solid #eee;
}

.ai-tab{
    padding:10px 16px;
    cursor:pointer;
    font-weight:500;
    color:#666;
}

.ai-tab.active{
    border-bottom:3px solid #F28F32;
    color:#000;
    font-weight:600;
}
.ai-actions{
    margin-top:20px;
    display:flex;
    gap:10px;
    justify-content:flex-end;
}
.ai-body{
    flex:1;
    overflow-y:auto;
    overflow-x:auto;
    margin-top:15px;
}
.ai-tab-content{
    width:100%;
}

.website-builder .ai-tab-content{
  overflow:hidden;
}

.website-builder .ai-tab-content .section-wrapper{
  min-width:1200px;
  zoom:0.67;
}

    .ai-tab-content img{
    max-width:100% !important;
    height:auto;
}

.ai-tab-content .container,
.ai-tab-content .container-fluid{
    max-width:100% !important;
    width:100% !important;
}
.ai-tab-content{
    display:none;
}
.ai-tab-content section{
    transform:scale(0.9);
    transform-origin:top left;
}
.ai-tab-content.active{
    display:block;
}

.ai-actions{
    margin-top:15px;
    display:flex;
    gap:10px;
}

.ai-btn{
    padding:8px 14px;
    border:none;
    background:#000;
    color:white;
    cursor:pointer;
    border-radius:4px;
}

#ai-generate,
#ai-apply{
  background: linear-gradient(90deg, #F28F32 0%, #a73729 100%);
  color:#fff;
  border-radius:30px;
  border:none;
  padding:8px 22px;
  cursor:pointer;
  font-weight:500;
}
.generate-btn{
background: linear-gradient(90deg, #F28F32 0%, #a73729 100%);
  color: #fff;
  border-radius: 30px;
  border: none;
  padding: 0px 14px 0px 14px;
  cursor: pointer;
  font-weight: 500;
  margin-left: 16px;
  font-size: 18px;
}
  .generate-btn:hover{
  background: linear-gradient(90deg, #a73729 0%, #F28F32 100%);
  }
  .generate-btn span i{
  vertical-align: top;
  }



#ai-close,
#edit-images{
  background:#000;
  color:#fff;
  border-radius:30px;
  border:none;
  padding:8px 22px;
  cursor:pointer;
}




 .ai-switch-icon{
font-size: 20px;
color: #ffb200;
  margin: 0 6px;
    margin-right: 6px;
  padding: 0 11px;
  margin-right: 21px;
}


.ai-body{
    flex:1;
    overflow-y:auto;
    overflow-x:auto;
    margin-top:15px;
    position:relative;
}
.ai-loader{
    position:absolute;
    inset:0;
    background:rgba(255,255,255,0.6);
    backdrop-filter:blur(3px);
    display:none;
    align-items:center;
    justify-content:center;
    flex-direction:column;
    gap:15px;
    z-index:10;
}

.ai-spinner{
    width:42px;
    height:42px;
    border:4px solid rgba(0,0,0,0.1);
    border-top:4px solid #F28F32;
    border-radius:50%;
    animation:spin 0.9s linear infinite;
}

@keyframes spin{
    to{ transform:rotate(360deg); }
}


.image-picker-modal{
position:fixed;
inset:0;
background:rgba(0,0,0,0.6);
display:flex;
align-items:center;
justify-content:center;
z-index:99999;
}

.image-picker-box{
  background: linear-gradient(145deg, #fff, #e1e1e1);
width:560px;
padding:20px;
border-radius:10px;
}

.image-grid{
display:grid;
grid-template-columns:repeat(3,1fr);
gap:10px;
margin-top:10px;
}

#imgUrlInput{
border-radius:21px;
}

.image-grid img{
width:100%;
cursor:pointer;
border:2px solid transparent;
}

.image-grid img.selected{
border:2px solid red;
}

.preview-box img{
max-width:100%;
margin-top:10px;
}

/*
image upload modal */



.image-picker-modal .modal-body {
  max-height: 64vh;
  overflow-y: auto;
  padding-right: 16px;
  padding: 11px;
  background: #ffffffb0;
  border-radius: 10px;
  border: 1px solid #ececec;
}
.image-picker-modal .modal-body::-webkit-scrollbar {
  width: 6px; /* thin scrollbar */
}

.image-picker-modal .modal-body::-webkit-scrollbar-track {
  background: transparent;
}

.image-picker-modal .modal-body::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}

.image-picker-modal .modal-body::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.5);
}

/* ===== Firefox ===== */
.image-picker-modal .modal-body {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.3) transparent;
}
.image-picker-modal .modal-content {

  background: linear-gradient(145deg, #fff, #e1e1e1);
  color: #fff;
  border-radius: 18px;
  border: none;
  box-shadow: 0 20px 60px rgba(0,0,0,.6);
}


.image-picker-modal .modal-header .close{
  font-size: 34px!important;
  color: #1f1f2e;
}
.image-picker-modal .modal-header .close:hover{
 color: #f4402a;
}
.image-picker-modal .modal-footer {
margin-top: 10px;
}
.image-picker-modal .modal-footer .btn{
border-radius: 25px;
}
.image-picker-modal .modal-title{
/* color: #fff; */
color: #1f1f2e;
}
#img-url{
  border-radius: 35px;
}

.image-picker-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
}

.image-picker-tabs button {
  background: #1f1f2e;
  color: #bbb;
  border: none;
  padding: 6px 14px;
  border-radius: 999px;
}

.image-picker-tabs button.active {
  background: linear-gradient(135deg, #e39a4e, #fb1b1b);
  color: #fff;
}
#pexelsSearch, #imgUrl{
 border-radius: 35px;
}


.image-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.image-grid img {
  width: 100%;
  height: 110px;
  object-fit: cover;
  border-radius: 10px;
  cursor: pointer;
  border: 2px solid transparent;
}

.image-grid img.selected {
  border-color: #6a5cff;
}

.upload-box {
  border: 2px dashed #444;
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  color: #1f1f2e;
}

.preview-box {
  margin-top: 14px;
  text-align: center;
}

.preview-box img {
  max-width: 100%;
  max-height: 180px;
  border-radius: 12px;
}

.url-row {
  display: flex;
  gap: 8px;
}

.btn-capsule {
  border-radius: 999px;
}

.hidden { display:none; }
/* Buttons */
.website-info-btn-primary {
  background: linear-gradient(135deg, #e39a4e, #fb1b1b);
  color: #fff !important;
  border: none;
  padding: 8px 30px;
  border-radius: 230px;
  font-weight: 600;
  transition: 0.3s;
  font-size: 15px;
}

.website-info-btn-primary:hover {
  background: linear-gradient(135deg, #fb1b1b, #e39a4e);
}



`;
document.head.appendChild(style);

// -----------------------------
// Create Modal HTML
// -----------------------------
const modal = document.createElement("div");
modal.className = "ai-modal";

modal.innerHTML = `
<div class="ai-modal-content">

    <div class="ai-tabs">
        <div class="ai-tab active" data-tab="original">Original</div>
        <div class="ai-tab" data-tab="generated">AI Generated</div>
    </div>

    <div class="ai-body">
        <div id="ai-loader" class="ai-loader">
        <div class="ai-spinner"></div>
        <p>Generating AI Content...</p>
        </div>
        <div id="ai-original" class="ai-tab-content active"></div>

        <div id="ai-generated" class="ai-tab-content"></div>

    </div>

    <div class="ai-actions">
        <button id="ai-generate" class="ai-btn">Generate</button>
        <button id="ai-apply" class="ai-btn">Apply</button>
        <button id="edit-images" class="ai-btn">Edit Images</button>
        <button id="ai-close" class="ai-btn">Close</button>
    </div>

</div>
`;

document.body.appendChild(modal);

// -----------------------------
// Tab Switching
// -----------------------------
document.querySelectorAll(".ai-tab").forEach(tab => {

    tab.onclick = function(){

        document.querySelectorAll(".ai-tab").forEach(t=>t.classList.remove("active"));
        document.querySelectorAll(".ai-tab-content").forEach(c=>c.classList.remove("active"));

        this.classList.add("active");

        if(this.dataset.tab === "original")
            document.getElementById("ai-original").classList.add("active");
        else
            document.getElementById("ai-generated").classList.add("active");

    }

});





// -----------------------------
// Open Modal
// -----------------------------
function openAIModal(){

    modal.style.display = "flex";

}

// -----------------------------
// Close Modal
// -----------------------------
document.getElementById("ai-close").onclick = function(){

    delete sectionFileMap[currentSection];

    modal.style.display = "none";

};

// -----------------------------
// Generate Content Button
// -----------------------------
document.getElementById("ai-generate").onclick = async function(){

    const htmlContent = document.getElementById("ai-original").innerHTML;

    // show overlay loader
    document.getElementById("ai-loader").style.display="flex";

    const response = await fetch("/ai/generate/",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "X-CSRFToken": getCookie("csrftoken")
        },
        body:JSON.stringify({
            html: htmlContent,
            sectionId: currentSection,
            tempFile: sectionFileMap[currentSection] || null
        })
    });

    const data = await response.json();

    generatedText = data.generated;

    document.getElementById("ai-generated").innerHTML = generatedText;

    sectionFileMap[currentSection] = data.temp_file;

    // hide loader
    document.getElementById("ai-loader").style.display="none";

    // switch tab
    document.querySelector('[data-tab="generated"]').click();

};
// document.getElementById("ai-generate").onclick = function(){

//     const htmlContent = document.getElementById("ai-original").innerHTML;

//     AIBridge.send({
//         type:"GENERATE_TEXT",
//         payload:{ text: htmlContent }
//     });

// };

// -----------------------------
// Apply Button
// -----------------------------
document.getElementById("ai-apply").onclick = function(){

    const generatedContainer = $("#ai-generated");

    generatedContainer.find("img").each(function(){
        $(this).css({
            outline: "",
            border: "",
            cursor: ""
        });
        $(this).off("click");
    });

    const generatedHTML = generatedContainer.html();
    const container = $("#"+currentSection);

    let aiWrapper = container.find(".ai-generated-wrapper");

    if(!aiWrapper.length){
        aiWrapper = $('<div class="ai-generated-wrapper"></div>');
        container.append(aiWrapper);
    }

    aiWrapper.html(generatedHTML);

    // show toggle controls
    container.find(".ai-toggle").show();

    const originalCheckbox = $("#"+currentSection+"_component");
    const aiCheckbox = container.find(".ai-version-checkbox");

    // enforce radio behaviour
    aiCheckbox.prop("checked", true);
    originalCheckbox.prop("checked", false);

    // add section entry to cookies
    originalCheckbox.prop("checked", true);
    handleSectionSelection(originalCheckbox);
    setGlobalVariablesInLocalStorage(currentSection);

    // show AI section
    aiWrapper.show();
    container.find("section").first().hide();

    // uncheck original visually
    originalCheckbox.prop("checked", false);

    modal.style.display = "none";
};

// -----------------------------
// Start Generation
// -----------------------------
function generateContent(sectionId){

    currentSection = sectionId;

    const container = document.getElementById(sectionId);

    // -------------------------
    // ORIGINAL SECTION
    // -------------------------

    if(!originalSectionMap[sectionId]){

        const originalSection = container.querySelector("section");

        if(originalSection){
            originalSectionMap[sectionId] = originalSection.outerHTML;
        }

    }

    const originalHTML = originalSectionMap[sectionId] || "";

    // -------------------------
    // GENERATED SECTION
    // -------------------------

    const generatedWrapper = container.querySelector(".ai-generated-wrapper");

    let generatedHTML = "";

    if(generatedWrapper){
        generatedHTML = generatedWrapper.innerHTML;
        generatedText = generatedHTML;
    }else{
        generatedText = "";
    }

    // -------------------------
    // LOAD INTO MODAL
    // -------------------------

    document.getElementById("ai-original").innerHTML = originalHTML;
    document.getElementById("ai-generated").innerHTML = generatedHTML;

    // auto select correct tab
    if(generatedHTML){
        document.querySelector('[data-tab="generated"]').click();
    }else{
        document.querySelector('[data-tab="original"]').click();
    }

    openAIModal();

}

// -----------------------------
// Worker Response
// -----------------------------
AIBridge.onMessage(function(data){

    if(data.type === "GENERATE_TEXT_RESULT"){

        generatedText = data.payload.text;
        alert('generatedText: '+ generatedText)

        document.getElementById("ai-generated").innerHTML = generatedText;

        // switch to generated tab
        document.querySelector('[data-tab="generated"]').click();

    }

});


// ----------------------------------------------------------
//PUBLISH SITE THEN MOVE THE NEW SECTION GENERATED TO RESPECTIVE FOLDERS
//----------------------------------------------------
async function publishSite(){

    const response = await fetch("/ai/publish/",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "X-CSRFToken": getCookie("csrftoken")
        },
        body:JSON.stringify({
            sections: sectionFileMap
        })
    });

    const data = await response.json();

    console.log("Published:", data.files);

}


$(document).on("change",".ai-version-checkbox",function(){

    const sectionId = $(this).data("target");
    const container = $("#"+sectionId);
    const originalCheckbox = $("#"+sectionId+"_component");

    if($(this).is(":checked")){

        // uncheck original
        originalCheckbox.prop("checked", false);

        // show AI
        container.find("section").first().hide();
        container.find(".ai-generated-wrapper").show();

        // store section
        originalCheckbox.prop("checked", true);
        handleSectionSelection(originalCheckbox);
        setGlobalVariablesInLocalStorage(sectionId);

        originalCheckbox.prop("checked", false);

    }else{

        container.find(".ai-generated-wrapper").hide();
        container.find("section").first().show();

    }

});
$(document).on("change",".section-checkbox",function(){

    const sectionId = $(this).attr("id").replace("_component","");
    const container = $("#"+sectionId);

    // uncheck AI checkbox
    container.find(".ai-version-checkbox").prop("checked",false);

    container.find(".ai-generated-wrapper").hide();
    container.find("section").first().show();

});




// -----------------------------
// EDITING IMAGE
// -----------------------------
$("#edit-images").on("click", function () {

    const container = $("#ai-generated");
    const images = container.find("img");

    images.each(function () {

        $(this).css({
            outline: "2px dashed #ff5c5c",
            cursor: "pointer",
            border: "5px solid red"
        });

        $(this).off("click").on("click", function (e) {

            e.stopPropagation();
            openImagePicker(this);

        });

    });

});

let selectedImageSrc = null;
let selectedFile = null;
let currentEditingImg = null;

const PEXELS_KEY = "7QPIcP3MfPcDte34Q1Vsu1lPrl0iwWFZ5GOl1NUgcLN40W6zhih4Yv5i";

function openImagePicker(targetImg) {

    currentEditingImg = targetImg;

    if ($("#imagePickerModal").length === 0) {

        const modal = $(`
        <div id="imagePickerModal" class="image-picker-modal">

            <div class="image-picker-box">

                <div class="modal-header">
                    <button class="close" data-dismiss="modal">&times;</button>
                    <h4>Select Image</h4>
                </div>

                <div class="modal-body">

                    <div class="image-picker-tabs">
                        <!-- <button class="tab-btn" data-tab="assets">Assets</button> -->
                        <button class="tab-btn active" data-tab="pexels">Pexels</button>
                        <button class="tab-btn" data-tab="upload">Upload</button>
                        <button class="tab-btn" data-tab="url">URL</button>
                    </div>

                    <div class="tab-content-area"></div>

                    <div class="preview-box hidden">
                        <img id="previewImage">
                    </div>

                </div>

                <div class="modal-footer">
                    <button class="btn btn-default" id="cancelImage">Cancel</button>
                    <button class="btn website-info-btn-primary" id="confirmImage">Apply</button>
                </div>

            </div>

        </div>
        `);

        $("body").append(modal);
    }

    $("#imagePickerModal").css("display", "flex");

    loadPexels();
}


// -----------------------------
// TAB SWITCH
// -----------------------------
$(document).on("click", ".tab-btn", function () {

    $(".tab-btn").removeClass("active");
    $(this).addClass("active");

    $(".preview-box").addClass("hidden");

    selectedImageSrc = null;
    selectedFile = null;

    const tab = $(this).data("tab");

    // if (tab === "assets") loadAssets();
    if (tab === "pexels") loadPexels();
    if (tab === "upload") loadUpload();
    if (tab === "url") loadURL();

});


// -----------------------------
// ASSETS TAB
// -----------------------------
// function loadAssets() {

//     $(".tab-content-area").html(`

//         <div class="image-grid">
//             <img src="assets/images/library/sample-1.jpg">
//             <img src="assets/images/library/sample-2.jpg">
//             <img src="assets/images/library/sample-3.jpg">
//         </div>

//     `);

//     $(".image-grid img").on("click", function () {

//         $(".image-grid img").removeClass("selected");

//         $(this).addClass("selected");

//         selectedImageSrc = $(this).attr("src");
//         selectedFile = null;

//         $("#previewImage").attr("src", selectedImageSrc);

//         $(".preview-box").removeClass("hidden");

//     });

// }


// -----------------------------
// PEXELS TAB
// -----------------------------
function loadPexels() {

    $(".tab-content-area").html(`

        <input id="pexelsSearch" class="form-control" placeholder="Search images">

        <div id="pexelsResults" class="image-grid"></div>

    `);

    $("#pexelsSearch").on("keyup", function () {

        const q = $(this).val();

        if (q.length < 3) return;

        fetch(`https://api.pexels.com/v1/search?query=${q}&per_page=6`, {
            headers: { Authorization: PEXELS_KEY }
        })
        .then(res => res.json())
        .then(res => {

            const grid = $("#pexelsResults");
            grid.html("");

            res.photos.forEach(p => {

                const img = $(`<img src="${p.src.medium}">`);

                grid.append(img);

                img.on("click", function () {

                    selectedImageSrc = $(this).attr("src");

                    $("#previewImage").attr("src", selectedImageSrc);

                    $(".preview-box").removeClass("hidden");

                });

            });

        });

    });

}


// -----------------------------
// UPLOAD TAB
// -----------------------------
function loadUpload() {

    $(".tab-content-area").html(`

        <div class="upload-box">Click to upload</div>
        <input type="file" id="imageUploadInput" accept="image/*" style="display:none">

    `);

    $(".upload-box").on("click", function () {

        $("#imageUploadInput").click();

    });

    $("#imageUploadInput").on("change", function () {

        const file = this.files[0];

        if (!file) return;

        selectedFile = file;

        const reader = new FileReader();

        reader.onload = function (e) {

            selectedImageSrc = e.target.result;

            $("#previewImage").attr("src", selectedImageSrc);

            $(".preview-box").removeClass("hidden");

        };

        reader.readAsDataURL(file);

    });

}


// -----------------------------
// URL TAB
// -----------------------------
function loadURL() {

    $(".tab-content-area").html(`
<div style="display:flex;
gap:20px;">
        <input id="imgUrlInput" class="form-control" placeholder="Paste image URL">

        <button id="previewUrlBtn" class="btn website-info-btn-primary">Preview</button>
</div>
    `);

    $("#previewUrlBtn").on("click", function () {

        const url = $("#imgUrlInput").val();

        if (!url) return;

        selectedImageSrc = url;

        $("#previewImage").attr("src", url);

        $(".preview-box").removeClass("hidden");

    });

}


// -----------------------------
// APPLY IMAGE
// -----------------------------
$(document).on("click", "#confirmImage", function () {

    if (!selectedImageSrc) return;

    $(currentEditingImg).attr("src", selectedImageSrc);

    $("#imagePickerModal").hide();

});


// -----------------------------
// CANCEL
// -----------------------------
$(document).on("click", "#cancelImage, .close", function () {

    $("#imagePickerModal").hide();

});