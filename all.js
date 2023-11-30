// ************** 預設：預設的套票物件及臺灣縣市陣列資料
//陣列：套票物件陣列
let data = [
    
];
//陣列：臺灣縣市陣列
let cityOfTaiwan = ['台北', '新北', '基隆', '桃園', '新竹', '苗栗', '台中', '南投', '彰化', '雲林', '嘉義', '臺南', '高雄', '屏東', '宜蘭', '花蓮', '台東', '澎湖', '金門', '連江'];


// ************** 起始：使用 axios 抓遠端資料，放到 data 陣列儲存，設定景點地區下拉選單選項、設定地區搜尋下拉選單選項、渲染起始套票區域
axios.get("https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json").then((response)=>{
    data = response.data.data;
    setRegion();
    renderInitialTicketArea();
});



function setRegion() {
    let ticketRegion = document.querySelector("#ticketRegion");
    let regionSearch = document.querySelector(".regionSearch");
    let regionStr = ` 
    <option value="" disabled selected hidden>請選擇景點地區</option>
    `;
    let regionSearchStr = `
    <option value="地區搜尋" disabled selected hidden>地區搜尋</option>
    <option value="">全部地區</option>
    `;
    cityOfTaiwan.forEach(function (item) {
        regionStr += combineRegion(item);
        regionSearchStr += combineRegion(item);
    })
    ticketRegion.innerHTML = regionStr;
    regionSearch.innerHTML = regionSearchStr;

    function combineRegion(item) {
        let option = `<option value="${item}">${item}</option>`
        return option;
    }
}
function renderInitialTicketArea() {
    let ticketCardArea = document.querySelector(".ticketCard-area");
    let str = "";
    data.forEach(function (item) {
        str += combineTicketCardArea(item);
    })
    ticketCardArea.innerHTML = str;
}
function combineTicketCardArea(item) {
    let li = `
             <li class="ticketCard list-unstyled">
                <div class="ticketCard-img">
                   <a href="#">
                  <img src="${item.imgUrl}" alt="">
                   </a>
                   <div class="ticketCard-region">${item.area}</div>
                   <div class="ticketCard-rank">${item.rate}</div>
                </div>
                <div class="ticketCard-content">
                  <div>
                     <h3>
                       <a href="#" class="ticketCard-name">${item.name}</a>
                     </h3>
                     <p class="ticketCard-description">
                       ${item.description}
                     </p>
                </div>
                <div class="ticketCard-info">
                     <p class="ticketCard-num">
                       <span><i class="fas fa-exclamation-circle"></i></span>
                       剩下最後 <span id="ticketCard-num">${item.group} </span> 組
                     </p>
                     <p class="ticketCard-price">
                       TWD <span id="ticketCard-price">$${item.price} </span>
                     </p>
                </div>
                </div>
             </li>`;
    return li;
}

// ************** 當使用者與網頁產生互動

// 監聽：新增套票按鈕事件 click -> 把組好的物件資料塞到 data 陣列裡面。
let addTicketBtn = document.querySelector(".addTicket-btn");
addTicketBtn.addEventListener("click", function (e) {
    //把DOM都抓起來，丟到 newDataArray
    let newDataNodeList = document.querySelectorAll(".form-group>div>input");
    let newDataArray = Array.prototype.slice.call(newDataNodeList);
    newDataArray.push(document.querySelector("#ticketRegion"));
    newDataArray.push(document.querySelector("#ticketDescription")); 

    let itemId = "";
    let targetItemMessage = "";
    let isValid = false;

    //抓 class = addTicket-input 裡面的 input, select, textarea，檢查有沒有漏填
    newDataArray.forEach((item) => {
        itemId = item.id; // 陣列順序用的變數
        targetItemMessage = document.querySelector(`#${itemId}-message`); // 抓DOM判斷是否為空值
        //有漏填->欄位顯示必填
        if (item.value === "") {
            targetItemMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i>
            <span>必填!</span>`;
            isValid = false;
        }
        //沒有漏填->欄位不顯示必填
        else {
            targetItemMessage.innerHTML = ``;
            isValid = true;
        }
    })
    if (isValid == true) {
        data.push(assignInfo(newDataArray));
        //抓取DOM，併把 value 賦予給套票物件的對應屬性
        function assignInfo(item) {
            //初始化一個套票物件，準備賦值
            let scenePackageInfo = {};
            //把 item.value 傳入scenePackageInfo 裡面對應的 attribute
            console.log(item);
            scenePackageInfo.id = data.length;
            scenePackageInfo.name = item[0].value;
            scenePackageInfo.imgUrl = item[1].value;
            scenePackageInfo.price = parseInt(item[2].value);
            scenePackageInfo.group = parseInt(item[3].value);
            scenePackageInfo.rate = parseInt(item[4].value);
            scenePackageInfo.area = item[5].value;
            scenePackageInfo.description = item[6].value;
            //清除欄位內容
            item.forEach((item) => {
                item.value = "";
            })
            return scenePackageInfo;
        }
        renderTicketArea();
    }
})

// 監聽：地區搜尋下拉選單事件 change
// 渲染：根據 data 儲存的資料，按照篩選條件渲染畫面
let regionSearch = document.querySelector(".regionSearch");
let searchResultText = document.querySelector("#searchResult-text");
regionSearch.addEventListener("change", (e) => {
    //確認 change 之後，檢查regionValue 是多少
    let regionValue = regionSearch.value;
    console.log(regionSearch.value);
    console.log(regionValue);
    //把  value 丟給 renderTicketArea()
    renderTicketArea(regionValue);

    let newDataNodeList = document.querySelectorAll(".form-group>div>input");
    let newDataArray = Array.prototype.slice.call(newDataNodeList);
    newDataArray.push(document.querySelector("#ticketRegion"));
    newDataArray.push(document.querySelector("#ticketDescription")); 
    newDataArray.forEach((item) => {
        let itemId = item.id; // 陣列順序用的變數
        targetItemMessage = document.querySelector(`#${itemId}-message`); // 抓DOM判斷是否為空值
        console.log
        //無論如何清掉紅色標記
            targetItemMessage.innerHTML = ``;
    })
})

function renderTicketArea(regionValue){
    let ticketCardArea = document.querySelector(".ticketCard-area");
    let renderArray=[];
    data.forEach((item) => {
        if(item.area === regionValue || regionValue === "" || regionValue === undefined){
            renderArray.push(item);
            searchResultText.textContent = `本次搜尋共 ${renderArray.length} 筆資料`
        }else{
            searchResultText.textContent = `本次搜尋共 ${renderArray.length} 筆資料`
        }

    })
    let str = "";
    renderArray.forEach((item) => {
        str += combineTicketCardArea(item);
    })
    ticketCardArea.innerHTML = str;
}

