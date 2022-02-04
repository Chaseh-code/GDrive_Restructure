/*** Purpose of this script is to help resolve a shared GDrive folder & file structure that was
 *** scattered around to all the original owners, killing the original shared folder's setup.
 *** Goal is to go to each User's own GDrive, move all the appropriate files back into their folders/subfolders
 *** and then reshare those folders back inside the original shared folder. Will return as many files & folders 
 *** to their original file path if possible, otherwise will create a catch all folder that can then be manually
 *** pieced back out to the correct file path.
 */

function main() {
  let spread = SpreadsheetApp.getActiveSpreadsheet();
  let folder = DriveApp;
  let tabName = "Data Dump";
  let data = spread.setActiveSheet(spread.getSheetByName(tabName),true).getDataRange().getValues();
  let folderName;
  let folderID;
  let files;
  let file;
  let name;
  let filesNotFound = [];

  Logger.log(`Moving Files for ${tabName}. Will be done in a few moments.....`);
  data.forEach(ele => {
      name = ele[1];
      folderName = nameCheck(name);
      folderID = folder.getRootFolder().getFoldersByName(folderName).next().getId();
      files = DriveApp.getRootFolder().searchFiles(`title = "${ele[0]}"`);
      if(files.hasNext()){
        file = files.next(); 
        file.moveTo(folder.getFolderById(folderID))
        //Logger.log(file.getName());
      }
      else { 
        filesNotFound.push(ele[0]);
        //Logger.log("File Not Found");
      }
      
  });
  Logger.log("File Movement complete!");
  Logger.log(`Files Not Found`);
  Logger.log(filesNotFound);
}

function nameCheck(name){
  let folderName = name.slice(name.indexOf('from')+4, name.lastIndexOf("to")).trim();
  let folders = DriveApp.getRootFolder().getFoldersByName(folderName);
  let folder = DriveApp;
  //Logger.log(folders.hasNext());
  if(!folders.hasNext()){
    folder.createFolder(folderName);
  }
  return folderName;
}

function moveFolders(){
  let spread = SpreadsheetApp.getActiveSpreadsheet();
  let folder = DriveApp;
  let tabName = "Data Folders";
  let data = spread.setActiveSheet(spread.getSheetByName(tabName),true).getDataRange().getValues();
  let destinationName;
  let sourceName;
  let sourceFolder;
  let destinationID;

  data.forEach(ele => {
      sourceName = ele[0];
      destinationName = ele[1];
      destinationID = folder.getFoldersByName(destinationName).next().getId();
      sourceFolder = folder.getRootFolder().getFoldersByName(sourceName);
      if(sourceFolder.hasNext()){
        sourceFolder.next().moveTo(folder.getFolderById(destinationID));
      }
      
  });
}