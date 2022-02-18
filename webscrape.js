const subSitesList = [];
const blogData = [];
const blogCategories = [];
let uniqueBlogCategories = [];

class parasObj{
    constructor(brand, previousPlatform, industry, useCase){
        this.brand = brand;
        this.previousPlatform = previousPlatform;
        this.industry = industry;
        this.useCase = useCase;
    }
}

const masterLink = new XMLHttpRequest();

masterLink.open('GET', 'https://www.shopify.com/plus/customers');
masterLink.responseType = 'document';

masterLink.onload = function(){

    if(masterLink.readyState == 4 && masterLink.status == 200){
        console.log('first stage');
        const response = masterLink.responseXML.querySelectorAll('.customer-card').forEach(elem => {
            subSitesList.push('https://www.shopify.com' + elem.getAttribute('href'));
    });
    }
    else{
        console.log('error');
    }

    //delay each forEach by one second
    subSitesList.forEach((elem, i) => {

        setTimeout(() => {
        const subSiteLink = new XMLHttpRequest();

        subSiteLink.open('GET', elem);
        subSiteLink.responseType = 'document';

        subSiteLink.onload = function(){
            const paras = subSiteLink.responseXML.querySelectorAll('.note p');
            const dataPoint = new parasObj(
                elem.substr(elem.lastIndexOf('/') - elem.length + 1),
                paras[0].innerHTML,
                paras[1].innerHTML,
                paras[2].innerHTML
            );
            blogData.push(dataPoint);
            if(subSitesList.length == blogData.length && subSitesList.length != 0){
                blogData.forEach(item => {
                    blogCategories.push(item.industry);
                });
                uniqueBlogCategories = [... new Set(blogCategories)];

                const fs = require('fs');
                const blog = require("./blog");

                fs.writeFile('blogData.json', JSON.stringify(blogData), err => {
     
                    // Checking for errors
                    if (err) throw err; 
                   
                    console.log("Done writing"); // Success
                });
            }
        }
        subSiteLink.send();
        }, i * 6500);        
    }); 
};

masterLink.onerror = function(){
    console.error(masterLink.status, masterLink.statusText);
}

masterLink.send();

/* do {
    if(subSitesList.length == blogData.length && subSitesList.length != 0){
        blogData.forEach(item => {
            blogCategories.push(item.industry);
        });
        uniqueBlogCategories = [... new Set(blogCategories)];
        break;
    }
}
while(blogData.length <= subSitesList.length + 1);
*/