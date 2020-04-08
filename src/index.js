export var XLSX = require('../node_modules/xlsx');

// Listen for the event.
document.addEventListener('DataLoaded', doDataStuff);
document.addEventListener('ResetAndInitialize', init);

function doDataStuff(){
  generateExcelFile();
}

init();

var activeConsumerObj=[];
var activeConsumerFileName= "";
var pendingBooklingsObj=[];
var pendingBookingConsumerFileName = "";
var areaWiseNumber = [];

function init(){
console.log("Init called");
activeConsumerObj=[];
activeConsumerFileName= "";
pendingBooklingsObj=[];
pendingBookingConsumerFileName = "";
areaWiseNumber = [];
}

function generateExcelFile(){
  (new ExcelToJSON()).createFile(pendingBooklingsObj,areaWiseNumber);
  document.dispatchEvent('ResetAndInitialize')
}

function processRequest(){
    // validate that both the files are uploaded    
    var activeConsumerFile = document.getElementById("fileupload1").files[0];
    var pendingBookingConsumerFile = document.getElementById("fileupload2").files[0];    
    if(activeConsumerFile!= null && pendingBookingConsumerFile!= null){
        console.log("Both files uploaded correctly");
        activeConsumerFileName = activeConsumerFile.name;
        pendingBookingConsumerFileName = pendingBookingConsumerFile.name;
        generateFile(activeConsumerFile,pendingBookingConsumerFile);
    } else {
      alert("file(s) not uploaded. Please Upload both the files");
    }
}

// var activeConsumerObj=[];
// var activeConsumerFileName= "";
// var pendingBooklingsObj=[];
// var pendingBookingConsumerFileName = "";
// var areaWiseNumber = [];

function generateFile(file1, file2){
 var excel = new ExcelToJSON();
  if(file1.name.endsWith(".xlsx")){
    excel.parseExcel(file1);
  } else if(file1.name.endsWith(".csv")){
    readCSV(file1,file2);
  }
}

function readCSV(file, file2){
  if((file.name) == "ActiveConsumer_Report.csv"){
    let reader = new FileReader();
    reader.onload = function(progressEvent){
      // Entire file
      // console.log(this.result);
  
      // By lines
      console.log("Started reading file " + file.name);
      let lines = this.result.split('\n');
      for(let line = 1; line < lines.length; line++){
        let info = lines[line].split(",");
        let customerInfo = {};
        if(info.length == 25) {
          customerInfo['ConsumerNo']=info[0];
          // customerInfo['ConsumerName']=info[1];
          // customerInfo['AddressLine1']=info[2];
          // customerInfo['AddressLine2']=info[3];
          // customerInfo['AddressLine3']=info[4];
          // customerInfo['PIN']=info[5];
          // customerInfo['ResidencephoneNo']=info[6];
          // customerInfo['OfficePhoneNo']=info[7];
          // customerInfo['MobileNo']=info[8];
          // customerInfo['Email']=info[9];
          // customerInfo['Taluka']=info[10];
          customerInfo['Area']=info[11];
          // customerInfo['CylinderPackageCode']=info[12];
          // customerInfo['PackageCodeDescription']=info[13];
          // customerInfo['CylinderQuantity']=info[14];
          // customerInfo['CylinderDepositAmount']=info[15];
          // customerInfo['RegulatorCode']=info[16];
          // customerInfo['RegulatorCodeDescription']=info[17];
          // customerInfo['RegulatorQuantity']=info[18];
          // customerInfo['RegulatorDepositAmount']=info[19];
          // customerInfo['TypeOfConnection']=info[20];
          customerInfo['NatureOfConnection']=info[21];
          // customerInfo['AdditionalCylinderQty']=info[22];
          // customerInfo['DepositAmount']=info[23];
          // customerInfo['AvgMonthlyConsumption']=info[24];
          // console.log("activeConsumerObj " + activeConsumerObj);
          activeConsumerObj.push(customerInfo);
          //console.log("post push length " + activeConsumerObj.length);

        } else {
          //manipulation required
        }
      }
      console.log("Finished reading file " + file.name);      
      console.log("post read length " + activeConsumerObj.length);
      
      if(file2!=null && file2.name.endsWith(".xlsx")){
        excel.parseExcel(file2);
      }else if(file2!=null && file2.name.endsWith(".csv")){
        readCSV(file2,null);
      }    
    }; 
    reader.readAsText(file);
  } else {
    let reader = new FileReader();
    reader.onload = function(progressEvent){
      // Entire file
      // console.log(this.result);
  
      // By lines
      console.log("Started reading file " + file.name);
      let lines = this.result.split('\n');
      // console.log("total lines are "+ lines.length);
      for(let line = 1; line < lines.length; line++){
        let info = lines[line].split(",");
        let pendingOrderInfo = {};
        // console.log(info);
        // console.log("info.length " + info.length);
        if(info.length == 20) {
          // console.log("Info obj " + info);
          pendingOrderInfo['SL No.'] = info[0];
          pendingOrderInfo['Order No.']= info[1];
          pendingOrderInfo['Order Date']= info[2];
          pendingOrderInfo['Order Status']= info[3];
          // pendingOrderInfo['Order Source']= info[4];
          // pendingOrderInfo['Order Type']= info[5];
          pendingOrderInfo['Consumer No.']= info[6];
          pendingOrderInfo['Consumer Name']= info[7];
          pendingOrderInfo['Cash Memo']= info[8];
          pendingOrderInfo['Cash Memo Date']= info[9];    
          
          let temp = getInfo(info[6]);
          if(temp!= null){
            pendingOrderInfo['Area'] = temp['Area'];
            pendingOrderInfo['NatureOfConnection'] =  temp['NatureOfConnection'];  
            updateAreaWiseList(temp['Area']);
            // console.log(pendingOrderInfo);
          } else {
            console.log("record not found");
          }
          pendingBooklingsObj.push(pendingOrderInfo);
        } else {
          //manipulation required
        }
      }
      console.log("Finished reading file " + file.name);
      document.dispatchEvent(new Event('DataLoaded'));
    }; 
    reader.readAsText(file);
  }
}

function updateAreaWiseList(areaName){
  for(let i = 0; i<areaWiseNumber.length; i++){
    if(areaWiseNumber[i]['Area'] == areaName){
      areaWiseNumber[i]['Number'] = areaWiseNumber[i]['Number'] + 1;
      return;
    }
  }
  areaWiseNumber.push({'Area':areaName, 'Number':1});
}

function getInfo(consumerNo){
  console.log("activeConsumerObj length " + activeConsumerObj.length);
  for (let o = 0 ; o < activeConsumerObj.length; o++) {
      if((activeConsumerObj[o])['ConsumerNo'] == consumerNo){
        return activeConsumerObj[o];
      }
  }
  return null;
}

var ExcelToJSON = function() {  
  //commented code works fine!
  this.parseExcel = function(file) {
      let reader = new FileReader();
      var fileName = file.name;
      reader.onload = function(e,fileName) {
        var data = e.target.result;
        var workbook = XLSX.read(data, {
          type: 'binary'
        });
        workbook.SheetNames.forEach(function(sheetName) {
          // Here is your object
          // var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
          let XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
          if(file.name == activeConsumerFileName){
            // activeConsumerObj = XL_row_object;
            console.log(XL_row_object);
          } else if(file.name == pendingBookingConsumerFileName){
            pendingBooklingsObj = XL_row_object;
          }
        })        
      };
  
      reader.onerror = function(ex) {
        console.log(ex);
      };
  
      reader.readAsBinaryString(file);
    };

    this.createFile = function(data1, data2) {  
      let wb = XLSX.utils.book_new();
      let ws1 = XLSX.utils.json_to_sheet(data1);
      let ws2 = XLSX.utils.json_to_sheet(data2);

      XLSX.utils.book_append_sheet(wb, ws1, "PendingBookings");
      XLSX.utils.book_append_sheet(wb, ws2, "AreaWisePendingNumbers");

      XLSX.writeFile(wb, 'out.xlsb');
    };
  };

var button = document.getElementById('getReportButton');
button.addEventListener("click",processRequest);