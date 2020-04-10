export var XLSX = require('../node_modules/xlsx');
// import './Assets/Styles/style.css'
// import './Assets/Styles/w3.css'
import logo from './Assets/Images/hpGasLogo.png'
import ActiveConsumer from './Model/ActiveConsumer';
import PendingBooking from './Model/PendingBooking';
import PendingBookingExtended from './Model/PendingBookingExtended';

var activeConsumerObj = [];
var fileOneName = "";
var pendingBooklingsObj = [];
var fileTwoName = "";
var areaWiseNumber = [];
const FILE_UPLOAD_1 = "fileupload1";
const FILE_UPLOAD_2 = "fileupload2";
const GET_REPORT_BUTTON = "getReportButton";

init();

function init() {
  loadImages();
  setupEventListeners();
}

function setupEventListeners() {
  document.addEventListener('DataGenerated', PostProcessor);
  // document.addEventListener('ResetAndInitialize', init);
  document.addEventListener('ActiveConsumerLoaded', ProcessPendingConsumers);
  document.getElementById(FILE_UPLOAD_1).addEventListener('change', (e) => { uploaded(e); });
  document.getElementById(FILE_UPLOAD_2).addEventListener('change', (e) => { uploaded(e); });

  let button = document.getElementById(GET_REPORT_BUTTON);
  button.addEventListener("click", ProcessRequest);
}

function loadImages() {
  let img = document.getElementById("logo");
  img.src = logo;
}

function uploaded(e) {
  e.target.nextElementSibling.innerText = "Uploaded";
  e.target.nextElementSibling.style.backgroundColor = "green";
}

function ProcessRequest() {
  // validate that both the files are uploaded    undefined
  let activeConsumerFiles = document.getElementById(FILE_UPLOAD_1).files;
  let pendingBookingConsumerFile = document.getElementById(FILE_UPLOAD_2).files;
  if (activeConsumerFiles.length > 0 && pendingBookingConsumerFile.length > 0) {
    console.log("Both files uploaded");
    fileOneName = activeConsumerFiles[0].name;
    fileTwoName = pendingBookingConsumerFile[0].name;

    if (fileOneName.endsWith(".csv") && fileTwoName.endsWith(".csv")) {
      loadActiveConsumers(activeConsumerFiles[0]);
    } else {
      alert("Please upload files in .CSV format Only");
    }

    // LoadDataFromFiles(activeConsumerFiles, pendingBookingConsumerFile);
  } else {
    alert("Please Upload both the files");
  }
}

function loadActiveConsumers(file) {
  let reader = new FileReader();

  reader.onload = function (event) {

    let lines = this.result.split('\n');
    for (let line = 1; line < lines.length; line++) {
      let row = lines[line].split(",");
      let activeCustomer = new ActiveConsumer(row);
      activeConsumerObj.push(activeCustomer);
    }

    console.log(`Total Active consumers read: ${activeConsumerObj.length}`);
    console.log(`Consumers with Problems: ${lines.length - activeConsumerObj.length - 1}`);
    document.dispatchEvent(new Event('ActiveConsumerLoaded'));
  }
  reader.readAsText(file);
}

function ProcessPendingConsumers(e) {
  let file = document.getElementById(FILE_UPLOAD_2).files[0];
  let reader = new FileReader();
  reader.onload = function (event) {
    console.log("Started reading file " + file.name);
    let lines = this.result.split('\n');

    for (let line = 1; line < lines.length; line++) {
      let row = lines[line].split(",");
      let pendingBooking = new PendingBooking(row);
      let temp = getInfo(row[6]);
      let pendingBookingExtended;
      if (Object.keys(temp).length > 0) {
        pendingBookingExtended = new PendingBookingExtended(pendingBooking, temp['Area'], temp['NatureOfConnection']);
      } else {
        pendingBookingExtended = new PendingBookingExtended(pendingBooking, "", "");
      }
      updateAreaWiseList(temp['Area']);
      pendingBooklingsObj.push(pendingBookingExtended);
    }
    console.log(`Total Pending Orders read: ${pendingBooklingsObj.length}`);
    console.log(`Pending Orders with Problems: ${lines.length - pendingBooklingsObj.length - 1}`);
    document.dispatchEvent(new Event('DataGenerated'));
  };
  reader.readAsText(file);
}

function PostProcessor(event) {
  generateExcelFile();
  document.getElementById(GET_REPORT_BUTTON).innerText = "Generated";
  document.getElementById(GET_REPORT_BUTTON).style.backgroundColor = "green";
}

function generateExcelFile() {
  (new ExcelToJSON()).createFile(pendingBooklingsObj, areaWiseNumber);
  document.dispatchEvent(new Event("ResetAndInitialize"));
}

function updateAreaWiseList(areaName) {
  for (let i = 0; i < areaWiseNumber.length; i++) {
    if (areaWiseNumber[i]['Area'] == areaName) {
      areaWiseNumber[i]['Number'] = areaWiseNumber[i]['Number'] + 1;
      return;
    }
  }
  areaWiseNumber.push({ 'Area': areaName, 'Number': 1 });
}

function getInfo(consumerNo) {
  
  for(let i =0; i < activeConsumerObj.length; i++){
    let temp = activeConsumerObj[i];
    if (temp.ConsumerNo == consumerNo) {
      return temp;
    }
  }
  console.log(`Pending Booking exists consumerID '${consumerNo}'. But consumerID does not exists in active consumber list!!`);
  return {};
}

var ExcelToJSON = function () {
  this.createFile = function (data1, data2) {
    let wb = XLSX.utils.book_new();
    let ws1 = XLSX.utils.json_to_sheet(data1);
    let ws2 = XLSX.utils.json_to_sheet(data2);

    XLSX.utils.book_append_sheet(wb, ws1, "PendingBookings");
    XLSX.utils.book_append_sheet(wb, ws2, "AreaWisePendingNumbers");

    XLSX.writeFile(wb, 'out.xlsb');
  };
};