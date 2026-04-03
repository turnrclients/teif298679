$(document).ready(function () {

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}


    $(document).on('click', '.edit-site', function() {
     var filename = $(this).attr("href");
        // alert('filename------------------: ' + filename);
        console.log('filename: ', filename);

        var clientName = getCookie('clientName');
        // alert('clientName: ' + clientName);

        var clientProjectName = getCookie('projectName');
        // alert('clientProjectName: ' + clientProjectName);

        if (filename){
            console.log('requested file ------- ' + filename);
        } else {
            console.log('filename missing ---------- ');
            return;
        }
        if(!clientProjectName){
            clientProjectName = getCookie('clientProjectName')
        }
        console.log('clientprojectname',clientProjectName)
        $.ajax({
            type: 'POST',
            url: "es/",
            data: {
            'clientName': clientName,
            'clientProjectName': clientProjectName,
            'srcReq': filename
            },
            headers: {
                 "X-Requested-With": "XMLHttpRequest",
            },
            success: function (data) {
                console.log('data: ', data)

              var newTab = window.open("", "_self");

            // Inject <base> before writing HTML
            const baseUrl = `${window.location.protocol}//${window.location.host}/`;
            const updatedData = data.replace(
                /<head([^>]*)>/i,
                `<head$1><base href="${baseUrl}">`
            );

              newTab.document.write(updatedData);
              newTab.document.close();
                newTab.onload = function () {
                    function appendElement(tag, attributes, toBody) {
                        var element;
             if (tag === 'script') {
                    element = newTab.document.querySelector('script[src="' + attributes.src + '"]');
                    if (!element) {
                        element = newTab.document.createElement(tag);
                        for (var attr in attributes) {
                            element[attr] = attributes[attr];
                        }
                        if (toBody) {
                             newTab.document.body.appendChild(element);
                        } else {
                            newTab.document.head.appendChild(element);
                        }
                    }
                }
            }


              $('<input>', {type: 'hidden',class: 'hidden selectedPageName',name: 'selectedPageName',value: filename}).appendTo(newTab.document.body);
              appendElement('link', { rel: 'stylesheet', href: 'https://cdn.quilljs.com/1.3.6/quill.snow.css' }, false);
              appendElement('link', { rel: 'stylesheet', href: 'assets/css/custom/editmode.css' }, false);
              appendElement('link', { rel: 'stylesheet', href: 'assets/css/custom/custom.css' }, false);
              appendElement('script', { src: 'https://cdn.quilljs.com/1.3.6/quill.min.js', type: 'text/javascript' }, true);
              appendElement('script', { src: 'assets/js/custom/main.js', type: 'text/javascript' }, true);
              appendElement('script', { src: 'assets/js/custom/editmode.js', type: 'text/javascript' }, true);
              appendElement('script', { src: 'assets/js/custom/editModeScript.js', type: 'text/javascript' }, true);


                var anchorTags = newTab.document.querySelectorAll('a');
                  anchorTags.forEach(function(anchor) {
                  anchor.classList.add('edit-site');
              });


            };
            },
            error: function (data, errmsg, err) {
                alert(data.responseJSON.errorMessage);
            }
          });
          return false;
      });
 });
