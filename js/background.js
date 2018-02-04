var g_listTabId = 0;
function setListTab(id)
{
    g_listTabId = id;
}
function onDownloadChange(item)
{
    if(typeof(item.filename) != "undefined")
    {
        console.log("download filename: " + item.filename.current);
    }
    if(typeof(item.state) != "undefined")
    {
        console.log("download state: " + item.state.current);
        //if(RegExp(g_downloadingFileName).test(item.filename) && (item.state =="complete" || item.state == "interrupted"))
        if(item.state.current =="complete" || item.state.current == "interrupted")
        {
            //chrome.downloads.erase({id: item.id}, function (ids){});
            chrome.tabs.query({title: "Amadeus - Export completed"}, function(tabArray)
            {
                for (i = 0; i < tabArray.length; i++){
                    console.log("Download tab id : " + tabArray[i].id);
                    //chrome.tabs.remove(tabArray[i].id);
                    chrome.tabs.sendMessage(tabArray[i].id, {action: "complete", sender: "background"}, function(){});
                }
            });
            g_downloadingFileName = ""; 
        }
    }
}
chrome.downloads.onChanged.addListener(onDownloadChange);
